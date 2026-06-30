import os
import json
import re
import requests

CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cache")
CACHE_FILE = os.path.join(CACHE_DIR, "worldcup2026_games.json")
API_URL = "https://worldcup26.ir/get/games"

def parse_scorers(scorers_str):
    if not scorers_str or scorers_str == "null" or scorers_str == "None":
        return []
    s = scorers_str.strip()
    if s.startswith("{") and s.endswith("}"):
        s = s[1:-1]
    
    # Split by comma
    parts = re.split(r',', s)
    res = []
    for p in parts:
        p = p.strip()
        # Remove backslashes, double quotes, single quotes, and curly quotes
        p = re.sub(r'^[\\"\u201c\u201d\u2018\u2019\']+|[\\"\u201c\u201d\u2018\u2019\']+$', '', p)
        p = p.strip()
        if p:
            res.append(p)
    return res

def fetch_and_cache_2026_games():
    """
    Fetches the 2026 World Cup games from the external API and caches them.
    Falls back to the local cached JSON file if offline or on timeout.
    """
    try:
        print("Fetching 2026 World Cup games from API...")
        res = requests.get(API_URL, timeout=3.0)
        if res.status_code == 200:
            data = res.json()
            os.makedirs(CACHE_DIR, exist_ok=True)
            with open(CACHE_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return data.get("games", [])
    except Exception as e:
        print(f"Failed to fetch 2026 games from API: {e}. Falling back to cache.")
    
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("games", [])
    
    return []

def get_2026_matches():
    raw_games = fetch_and_cache_2026_games()
    matches = []
    for game in raw_games:
        # Map stage
        g_type = game.get("type", "group")
        g_group = game.get("group", "A")
        if g_type == "group":
            stage = f"Group Stage • Group {g_group}"
        elif g_type == "r32":
            stage = "Round of 32"
        elif g_type == "r16":
            stage = "Round of 16"
        elif g_type == "qf":
            stage = "Quarter-Final"
        elif g_type == "sf":
            stage = "Semi-Final"
        elif g_type == "third":
            stage = "Third Place Play-off"
        elif g_type == "final":
            stage = "Final"
        else:
            stage = "Knockout Stage"
            
        home_team = game.get("home_team_name_en") or game.get("home_team_label") or "TBD"
        away_team = game.get("away_team_name_en") or game.get("away_team_label") or "TBD"
        
        finished_val = game.get("finished") == "TRUE"
        time_elapsed = game.get("time_elapsed", "notstarted")
        home_score = game.get("home_score", "0")
        away_score = game.get("away_score", "0")
        home_scorers = parse_scorers(game.get("home_scorers"))
        away_scorers = parse_scorers(game.get("away_scorers"))
        

        matches.append({
            "match_id": f"wc2026_{game.get('id')}",
            "name": f"{home_team} vs {away_team}",
            "stage": stage,
            "desc": f"FIFA World Cup 2026 Match. Group {g_group}. Venue Stadium ID: {game.get('stadium_id', 'N/A')}.",
            "is_2026": True,
            "finished": finished_val,
            "time_elapsed": time_elapsed,
            "home_score": home_score,
            "away_score": away_score,
            "local_date": game.get("local_date", "TBD"),
            "home_scorers": home_scorers,
            "away_scorers": away_scorers
        })
    return matches

def get_2026_bulletin():
    matches = get_2026_matches()
    
    # Filter out completed matches
    uncompleted = [m for m in matches if not m["finished"]]
    
    if not uncompleted:
        return {
            "live": [],
            "upcoming": []
        }
        
    # Find all live matches
    live_matches = [m for m in uncompleted if m["time_elapsed"] != "notstarted"]
    
    # Determine the reference date of "that day"
    if live_matches:
        reference_date = live_matches[0]["local_date"].split(" ")[0]
    else:
        # Otherwise, the date of the first upcoming match
        upcoming = [m for m in uncompleted if m["time_elapsed"] == "notstarted"]
        if upcoming:
            reference_date = upcoming[0]["local_date"].split(" ")[0]
        else:
            reference_date = None
            
    # Filter upcoming matches of that day
    upcoming_matches = []
    if reference_date:
        upcoming_matches = [
            m for m in uncompleted 
            if m["time_elapsed"] == "notstarted" and m["local_date"].startswith(reference_date)
        ]
        
    return {
        "live": live_matches,
        "upcoming": upcoming_matches
    }

def register_2026_match_context(match_id: str):
    """
    Dynamically registers a 2026 match's metadata, milestones, and fallback reports
    into both analyzer MATCH_MAPPING and flows_orchestrator MATCH_DETAILS_MAP.
    """
    from backend.analyzer import MATCH_MAPPING
    from backend.flows_orchestrator import MATCH_DETAILS_MAP
    
    if match_id in MATCH_MAPPING and match_id in MATCH_DETAILS_MAP:
        return
        
    matches = get_2026_matches()
    match_data = next((m for m in matches if m["match_id"] == match_id), None)
    if not match_data:
        return
        
    # Build details for MATCH_MAPPING
    MATCH_MAPPING[match_id] = {
        "name": match_data["name"],
        "stage": match_data["stage"],
        "desc": match_data["desc"]
    }
    
    # Parse and compile milestones
    milestones = ["0' Match Kickoff - The match begins."]
    home_name, away_name = match_data["name"].split(" vs ")
    
    # Add home scorers
    for scorer in match_data["home_scorers"]:
        min_match = re.search(r'(\d+)\'?\+?(\d+)?\'?', scorer)
        minute = min_match.group(0).replace("'", "") if min_match else "45"
        milestones.append(f"{minute}' Goal - {scorer} ({home_name})")
        
    # Add away scorers
    for scorer in match_data["away_scorers"]:
        min_match = re.search(r'(\d+)\'?\+?(\d+)?\'?', scorer)
        minute = min_match.group(0).replace("'", "") if min_match else "45"
        milestones.append(f"{minute}' Goal - {scorer} ({away_name})")
        
    # Sort milestones by minute
    def get_min(m_str):
        parts = m_str.split("' ")
        try:
            return float(parts[0].split("+")[0])
        except:
            return 0.0
            
    sorted_goals = sorted(milestones[1:], key=get_min)
    
    # Reassemble milestones
    final_milestones = [milestones[0]]
    halftime_added = False
    for m in sorted_goals:
        m_min = get_min(m)
        if m_min > 45 and not halftime_added:
            final_milestones.append(f"45' Halftime - {home_name} {match_data['home_score']} - {match_data['away_score']} {away_name}")
            halftime_added = True
        final_milestones.append(m)
        
    if not halftime_added:
        final_milestones.append(f"45' Halftime - {home_name} {match_data['home_score']} - {match_data['away_score']} {away_name}")
        
    final_milestones.append(f"90' Fulltime - Match finished. Final Score: {home_name} {match_data['home_score']} - {match_data['away_score']} {away_name}")
    
    # Fallback paragraphs
    first_half_txt = f"The match between {home_name} and {away_name} kicked off in high intensity. "
    home_goals_1st = [m for m in sorted_goals if get_min(m) <= 45 and home_name in m]
    away_goals_1st = [m for m in sorted_goals if get_min(m) <= 45 and away_name in m]
    if home_goals_1st:
        first_half_txt += f" {home_name} opened their account early with goals from {', '.join(match_data['home_scorers'])}. "
    if away_goals_1st:
        first_half_txt += f" {away_name} responded with goals from {', '.join(match_data['away_scorers'])}. "
    if not home_goals_1st and not away_goals_1st:
        first_half_txt += "Both defenses remained highly organized, resulting in a scoreless first half."
        
    second_half_txt = f"In the second half, both teams adjusted their tactical configurations. "
    home_goals_2nd = [m for m in sorted_goals if get_min(m) > 45 and home_name in m]
    away_goals_2nd = [m for m in sorted_goals if get_min(m) > 45 and away_name in m]
    if home_goals_2nd:
        second_half_txt += f" {home_name} secured their dominance with second half goals. "
    if away_goals_2nd:
        second_half_txt += f" {away_name} mounted pressure in the final third. "
    second_half_txt += f" The match ended with a final score of {match_data['home_score']} - {match_data['away_score']}."
    
    MATCH_DETAILS_MAP[match_id] = {
        "name": match_data["name"],
        "stage": match_data["stage"],
        "score": f"{match_data['home_score']} - {match_data['away_score']}",
        "status": "FT" if match_data["finished"] else "LIVE" if match_data["time_elapsed"] != "notstarted" else "Not Started",
        "possession": {"A": 50, "B": 50},
        "shots": {"A": int(match_data["home_score"])*3 + 2, "B": int(match_data["away_score"])*3 + 2},
        "passes": {"A": 480, "B": 460},
        "milestones": final_milestones,
        "fallbacks": {
            "first_half": first_half_txt,
            "second_half": second_half_txt,
            "tactical_insights": f"Tactical analysis indicates that {home_name} controlled the tempo in wide areas, while {away_name} structured a midblock to limit vertical penetration.",
            "player_performance": "Expected pass completion accuracy remained stable. Stamina curves show standard decay in late intervals.",
            "dangerous_periods": "ML threat model highlights active transitional phases following turnovers in the midfield.",
            "attacking_dominance": f"Possession was evenly distributed, with both teams trading territorial dominance.",
            "pressure_phases": "Defensive line heights compressed as fatigue rates increased after the 70th minute.",
            "tactical_influence": "Substitutions in the second half introduced fresh legs on the wings, shifting transition speeds."
        }
    }
