import sys
import os
import re
# Configure path to allow importing 'backend' when run from any directory level
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.analyzer import MATCH_MAPPING, calculate_momentum, get_pressure_stats
from backend.ml_engine import MLEngine, predict_player_fatigue_over_time
from backend.flows_orchestrator import LangFlowOrchestrator, MATCH_DETAILS_MAP
from backend.mcp_server import MCPServer
from backend.worldcup2026 import get_2026_matches, get_2026_bulletin, register_2026_match_context

app = FastAPI(
    title="PitchPulse AI Backend",
    description="Deconstructing tactical geometry, explaining match momentum.",
    version="1.0.0"
)

# Enable CORS for React frontend development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engines
ml_engine = MLEngine()
ml_engine.load_model()
orchestrator = LangFlowOrchestrator()
mcp_server = MCPServer()

# Pydantic input schemas
class PassPredictionInput(BaseModel):
    x: float
    y: float
    dist: float
    angle: float
    under_pressure: int
    in_attacking_third: int

class VarAnalysisInput(BaseModel):
    incident_type: str  # e.g., 'handball', 'offside', 'ball_out_of_play'
    details: str
    lang: str = "English"

class ChatInput(BaseModel):
    message: str
    persona: str = "expert"  # expert, casual, gamer
    lang: str = "English"
    mode: str = "analyst"    # fan, analyst
    match_id: str = None
    match_name: str = None
    red_players: list = None
    blue_players: list = None

class MCPCallInput(BaseModel):
    name: str
    arguments: dict

@app.get("/api/matches")
def get_matches():
    """Returns available matches to switch between in the UI."""
    matches_2022 = [
        {
            "match_id": match_id,
            "name": details["name"],
            "stage": details["stage"],
            "desc": details["desc"]
        }
        for match_id, details in MATCH_MAPPING.items()
    ]
    try:
        matches_2026 = get_2026_matches()
    except Exception as e:
        print(f"Error loading 2026 matches: {e}")
        matches_2026 = []
    return matches_2022 + matches_2026

@app.get("/api/worldcup2026/bulletin")
def get_world_cup_bulletin():
    """Returns Live, Upcoming, and Previous matches for the home bulletin card."""
    try:
        return get_2026_bulletin()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/match/{match_id}/momentum")
def get_match_momentum(match_id: str):
    """Returns calculated and smoothed momentum curves for a match."""
    if match_id.startswith("wc2026_"):
        register_2026_match_context(match_id)
        tA, tB = MATCH_MAPPING[match_id]["name"].split(" vs ")
        # Build a list of milestone dictionaries for the frontend timeline
        raw_milestones = MATCH_DETAILS_MAP[match_id]["milestones"]
        events_list = []
        for rm in raw_milestones:
            match_min = re.match(r'^(\d+)\'\s+([A-Za-z\s\-]+)\s*-\s*(.*)$', rm)
            if match_min:
                minute = int(match_min.group(1))
                event_type = match_min.group(2).strip()
                detail = match_min.group(3).strip()
                player = event_type
                if "Goal" in event_type and "(" in detail:
                    player = detail.split("(")[0].strip()
                events_list.append({
                    "minute": minute,
                    "type": event_type,
                    "player": player,
                    "detail": rm,
                    "query": f"Explain the tactical setup and milestone at {rm}."
                })
            else:
                min_match = re.match(r'^(\d+)\'', rm)
                minute = int(min_match.group(1)) if min_match else 45
                events_list.append({
                    "minute": minute,
                    "type": "Match Event",
                    "player": "Match",
                    "detail": rm,
                    "query": f"Explain the tactical setup and milestone at {rm}."
                })
        return {"teamA": tA, "teamB": tB, "timeline": [], "events": events_list}
    if match_id not in MATCH_MAPPING:
        raise HTTPException(status_code=404, detail="Match not found")
    try:
        return calculate_momentum(match_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/match/{match_id}/pressure")
def get_match_pressure(match_id: str):
    """Returns pressure heatmaps and top pressured players."""
    if match_id.startswith("wc2026_"):
        register_2026_match_context(match_id)
        tA, tB = MATCH_MAPPING[match_id]["name"].split(" vs ")
        # Return mock players based on teams for scouting roster cards
        return {
            "teamA": tA, "teamB": tB,
            "heatmapA": [], "heatmapB": [],
            "top_pressured_players": [
                {"player": f"Star Player A1 ({tA})", "team": tA, "total_passes": 52, "pressure_passes": 14, "completed_pressure_passes": 12, "pressure_accuracy": 85.7},
                {"player": f"Midfielder A2 ({tA})", "team": tA, "total_passes": 48, "pressure_passes": 10, "completed_pressure_passes": 8, "pressure_accuracy": 80.0},
                {"player": f"Striker B1 ({tB})", "team": tB, "total_passes": 32, "pressure_passes": 12, "completed_pressure_passes": 9, "pressure_accuracy": 75.0},
                {"player": f"Winger B2 ({tB})", "team": tB, "total_passes": 38, "pressure_passes": 8, "completed_pressure_passes": 6, "pressure_accuracy": 75.0}
            ]
        }
    if match_id not in MATCH_MAPPING:
        raise HTTPException(status_code=404, detail="Match not found")
    try:
        return get_pressure_stats(match_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/match/{match_id}/fatigue")
def get_match_fatigue(match_id: str):
    """Returns ML-predicted physical fatigue indices for top players over time."""
    if match_id.startswith("wc2026_"):
        register_2026_match_context(match_id)
        tA, tB = MATCH_MAPPING[match_id]["name"].split(" vs ")
        return {
            f"Star Player A1 ({tA})": {"team": tA, "curve": [{"interval": "0-15'", "fatigue_percentage": 10}, {"interval": "75-95'", "fatigue_percentage": 58}]},
            f"Striker B1 ({tB})": {"team": tB, "curve": [{"interval": "0-15'", "fatigue_percentage": 12}, {"interval": "75-95'", "fatigue_percentage": 62}]}
        }
    if match_id not in MATCH_MAPPING:
        raise HTTPException(status_code=404, detail="Match not found")
    try:
        return predict_player_fatigue_over_time(match_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/match/{match_id}/summary")
def get_match_summary(match_id: str, lang: str = "English"):
    """Runs LangFlow match summary report writer using Granite 3.3 2B."""
    if match_id.startswith("wc2026_"):
        register_2026_match_context(match_id)
    elif match_id not in MATCH_MAPPING:
        raise HTTPException(status_code=404, detail="Match not found")
    try:
        match_name = MATCH_MAPPING[match_id]["name"]
        return orchestrator.run_match_summary_flow(match_id, match_name, lang=lang)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/match/{match_id}/momentum-analysis")
def get_match_momentum_analysis(match_id: str, lang: str = "English"):
    """Runs LangFlow match momentum explanation using Granite 3.3 2B."""
    if match_id.startswith("wc2026_"):
        register_2026_match_context(match_id)
    elif match_id not in MATCH_MAPPING:
        raise HTTPException(status_code=404, detail="Match not found")
    try:
        match_name = MATCH_MAPPING[match_id]["name"]
        return orchestrator.run_momentum_analysis_flow(match_id, match_name, lang=lang)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict-xp")
def predict_xp(data: PassPredictionInput):
    """Calculates expected pass completion using the trained Logistic Regression model."""
    try:
        xp = ml_engine.predict_xp(
            data.x, data.y, data.dist, data.angle,
            data.under_pressure, data.in_attacking_third
        )
        return {
            "expected_pass_completion": xp,
            "percentage": f"{round(xp * 100, 1)}%"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/var/analyze")
def analyze_var(data: VarAnalysisInput):
    """Runs LangFlow VAR RAG pipeline with Docling rules & Granite 3.3 2B."""
    query = f"Incident: {data.incident_type}. Details: {data.details}"
    try:
        flow_result = orchestrator.run_var_rag_flow(query, lang=data.lang)
        return flow_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
def chat_coach(data: ChatInput):
    """Runs LangFlow Multi-Persona Coach pipeline with Granite 3.3 2B."""
    try:
        flow_result = orchestrator.run_coach_persona_flow(
            data.message, persona=data.persona, lang=data.lang, mode=data.mode,
            match_id=data.match_id, match_name=data.match_name,
            red_players=data.red_players, blue_players=data.blue_players
        )
        return flow_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# MCP Routes (Context Forge alignment)
@app.get("/api/mcp/tools")
def list_mcp_tools():
    """Lists registered Model Context Protocol tools."""
    return mcp_server.list_tools()

@app.post("/api/mcp/call")
def call_mcp_tool(data: MCPCallInput):
    """Calls an MCP tool in the local Context Forge proxy."""
    result = mcp_server.call_tool(data.name, data.arguments)
    if result.get("is_error"):
        raise HTTPException(status_code=400, detail=result["content"][0]["text"])
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
