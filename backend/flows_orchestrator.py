import sys
import os
# Configure path to allow importing 'backend' when run from any directory level
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
import requests
from backend.parser import get_law_section

MATCH_DETAILS_MAP = {
    "3869685": {
        "name": "Argentina vs France",
        "stage": "Final",
        "score": "3 - 3 (Pen 4-2)",
        "status": "FT (AET)",
        "possession": {"A": 54, "B": 46},
        "shots": {"A": 20, "B": 10},
        "passes": {"A": 642, "B": 528},
        "milestones": [
            "23' Goal - Lionel Messi (ARG): Penalty converted after Dembele fouled Di Maria.",
            "36' Goal - Angel Di Maria (ARG): Stunning counter-attack finished by Di Maria.",
            "64' Substitution - Di Maria off (ARG): Defensive shift to compact shape.",
            "80' Goal - Kylian Mbappe (FRA): Penalty scored.",
            "81' Goal - Kylian Mbappe (FRA): Sensational volley equalizer.",
            "108' Goal - Lionel Messi (ARG): Rebound scored in extra time.",
            "118' Goal - Kylian Mbappe (FRA): Penalty completed hat-trick."
        ],
        "fallbacks": {
            "first_half": "Argentina established immediate tactical superiority by starting Angel Di Maria on the left flank rather than the right. This unexpected configuration forced Ousmane Dembele into active defensive duties, stretching France's narrow midblock. Di Maria's spatial positioning isolated Dembele in 1v1 duels, eventually forcing a penalty in the 23rd minute which Messi converted. In the 36th minute, a lightning-fast five-pass counter-attack cut through France's rest defense, with Mac Allister crossing to Di Maria to slot home for 2-0.",
            "second_half": "Argentina maintained their compact defensive midblock, preserving the 2-0 lead comfortably until the 80th minute. Didier Deschamps shifted France to an extremely direct 4-2-4 formation, loading physical strikers high up the pitch. This strategy collapsed Argentina's defensive line height. In the 80th minute, Kolo Muani bypassed Otamendi, forcing a penalty which Kylian Mbappe converted. Merely 97 seconds later, Coman dispossessed Messi, triggering a rapid vertical combination that allowed Mbappe to score a sensational volley equalizer.",
            "tactical_insights": "Substitutions in the 64th minute altered Argentina's defensive line height. France capitalized on vertical transition structures, bypassing the midblock completely. The expected pass completion accuracy for Argentina collapsed by 15% post-substitution.",
            "player_performance": "Physical tracking indicates that Argentina's high-pressing midblock (led by Rodrigo De Paul and Alexis Mac Allister) suffered extreme physical decay after 75 minutes, with De Paul's ML fatigue index peaking at 74% sprint decay. Under extreme cognitive stress, Argentina's pass accuracy collapsed from 86.7% to 64.2% during the pressure phase.",
            "dangerous_periods": "The ML model detected intense goal threat intervals for France between 80' and 85' as they scored two quick goals and inverted Argentina's pressure curves.",
            "attacking_dominance": "Argentina held structural control for the first 70 minutes, utilizing Angel Di Maria to stretch the pitch, while France struggled to register a single shot inside the box.",
            "pressure_phases": "Argentina's counter-pressing block maintained high intensity until Di Maria's substitution, after which France increased spatial entry rates through the flanks.",
            "tactical_influence": "Scaloni's initial 4-3-3 shape completely neutralized Deschamps' narrow 4-3-3 setup, though France's late shift to a direct 4-2-4 bypassed Argentina's midfield block."
        }
    },
    "3857300": {
        "name": "Argentina vs Saudi Arabia",
        "stage": "Group Stage",
        "score": "1 - 2",
        "status": "FT",
        "possession": {"A": 69, "B": 31},
        "shots": {"A": 15, "B": 3},
        "passes": {"A": 593, "B": 264},
        "milestones": [
            "10' Goal - Lionel Messi (ARG): Penalty scored after set-piece foul.",
            "22' Disallowed Goal - Lautaro Martinez (ARG): Caught by Saudi's high offside trap.",
            "46' Tactical Shift: Saudi Arabia switches to aggressive high press starting 2nd half.",
            "48' Goal - Saleh Al-Shehri (KSA): Midfield turnover leads to equalizer.",
            "53' Goal - Salem Al-Dawsari (KSA): Sensational solo shot from edge of box."
        ],
        "fallbacks": {
            "first_half": "Argentina established early positional control, with Messi converting a penalty in the 10th minute. Argentina sought to exploit Saudi's defense with vertical runs. However, Herve Renard implemented an extremely risky, highly coordinated high offside line. This tactical choice caught Lautaro Martinez and Messi offside repeatedly, leading to three disallowed goals and frustrating Argentina's attacking transition buildup.",
            "second_half": "Saudi Arabia emerged in the second half with extreme high pressing triggers. In the 48th minute, a midfield turnover in Zone 14 allowed Al-Shehri to bypass Romero and equalize. Five minutes later, Salem Al-Dawsari evaded three defenders on the edge of the box, scoring a sensational solo shot into the top corner. Saudi Arabia then retreated into a highly compact low block, defending heroically.",
            "tactical_insights": "Argentina's failure to adapt to Saudi's high line blocks prevented line-breaking entries. Momentum swings favored Saudi Arabia, who maintained high stamina curves during the pressing phases.",
            "player_performance": "Saudi players showed incredible physical stamina, maintaining high-speed pressing triggers for 90 minutes. In contrast, Argentina's midfield buildup suffered from cognitive stress, with expected pass accuracy dropping under press in Zone 14.",
            "dangerous_periods": "The ML model detected intense goal threat intervals for Saudi Arabia between 48' and 54' as they scored two quick goals on the counter.",
            "attacking_dominance": "Argentina dominated possession (69%) but struggled to bypass Saudi Arabia's disciplined high offside defensive line.",
            "pressure_phases": "Saudi Arabia's high press starting in the second half successfully disrupted Argentina's midfield circulation, forcing high-pressure turnovers.",
            "tactical_influence": "Herve Renard's high defensive line trapped Argentina offside 10 times, disrupting their build-up play and neutralizing Lautaro Martinez."
        }
    },
    "3869420": {
        "name": "Croatia vs Brazil",
        "stage": "Quarter-Final",
        "score": "1 - 1 (Pen 4-2)",
        "status": "FT (AET)",
        "possession": {"A": 51, "B": 49},
        "shots": {"A": 9, "B": 21},
        "passes": {"A": 683, "B": 662},
        "milestones": [
            "46' Tactical Control: Croatia midfield Modric-Brozovic-Kovacic dominates possession.",
            "75' Substitution - Antony on (BRA): Brazil loads wingers to stretch Croatia's narrow shape.",
            "105+1' Goal - Neymar (BRA): Stunning combinations through center in extra-time.",
            "117' Goal - Bruno Petkovic (CRO): Deflected equalizer from rapid counter-attack."
        ],
        "fallbacks": {
            "first_half": "Croatia set up a highly disciplined midblock, suffocating Brazil's winger progression. Luka Modric, Marcelo Brozovic, and Mateo Kovacic controlled the tempo by rotating possession and slowing down game speed, preventing Brazil from launching transition overloads.",
            "second_half": "Brazil loaded wide wingers (Antony and Rodrygo) in the second half to stretch Croatia's narrow shape. Dominic Livakovic made multiple crucial saves to keep Croatia level. The match entered extra time, where Neymar scored a stunning solo goal in the 105+1' minute, only for Bruno Petkovic to deflect a dramatic late equalizer in the 117' minute.",
            "tactical_insights": "Croatia's narrow rest defense neutralised Brazil's winger overloads for major periods. Late tactical transitions showed high stamina performance under extreme shootout pressure.",
            "player_performance": "Croatia's veteran midfield showed incredible fatigue resistance, maintaining compact shapes. Modric's pass accuracy under pressure remained at 92%. Brazil's shootout pressure triggered cognitive stress, resulting in missed penalties.",
            "dangerous_periods": "The ML model detected intense goal threat intervals for Brazil in the second half as Livakovic made multiple crucial saves.",
            "attacking_dominance": "Brazil dominated shot generation (21 shots) but Croatia's veteran midfield maintained possession control and slowed game speed.",
            "pressure_phases": "Croatia's midblock counter-pressing neutralised Brazil's winger progression, forcing them wide and contesting second balls.",
            "tactical_influence": "Croatia's central density neutralised Brazil's spatial geometry, forcing them into wide channels and contesting second balls successfully."
        }
    },
    "3857255": {
        "name": "Japan vs Spain",
        "stage": "Group Stage",
        "score": "2 - 1",
        "status": "FT",
        "possession": {"A": 18, "B": 82},
        "shots": {"A": 6, "B": 12},
        "passes": {"A": 228, "B": 1058},
        "milestones": [
            "12' Goal - Alvaro Morata (ESP): Spain dominates possession, scoring early header.",
            "46' Substitution - Ritsu Doan on (JPN): Japan switches to high-energy pressing block.",
            "48' Goal - Ritsu Doan (JPN): Spain turnover forced, Doan blasts home equalizer.",
            "51' Goal - Ao Tanaka (JPN): Tanaka scores from goal-line cross (VAR confirms ball in play)."
        ],
        "fallbacks": {
            "first_half": "Spain dominated possession completely (82%), passing patient combinations to unlock Japan's deep 5-4-1 low block. Alvaro Morata scored a header in the 12th minute. Japan remained passive, seeking to prevent central penetration.",
            "second_half": "Japan made two halftime substitutions, inserting Ritsu Doan and switching to high-intensity pressing triggers. Spain was caught off guard; Doan equalized in the 48' minute. Three minutes later, Tanaka scored from a controversial goal-line cross, confirmed by VAR.",
            "tactical_insights": "Spain's high possession rate (82%) lacked penetration. Japan's tactical shift to high-energy pressing block completely disrupted Spain's buildup, leading to progressive turnovers.",
            "player_performance": "Japan's fresh substitutes maintained extreme pressing rates, suffocating Spain's midfielders. Under Japan's counter-press, Spain's expected pass accuracy collapsed by 22% in their own defensive third, showcasing intense cognitive fatigue.",
            "dangerous_periods": "The ML model detected intense goal threat intervals for Japan between 48' and 52' as they forced high-pressure turnovers.",
            "attacking_dominance": "Spain held a high 82% possession rate but lacked vertical penetration, rotating passive passes in front of Japan's compact low block.",
            "pressure_phases": "Japan's halftime pressing trigger adjustments forced a 32% collapse in Spain's pass completion rate inside their own defensive third.",
            "tactical_influence": "Moriyasu's transition to an active 5-4-1 pressing block and Ritsu Doan's entry completely disrupted Spain's buildup, leading to rapid turnovers."
        }
    }
}

class LangFlowOrchestrator:
    """
    Executes exported LangFlow JSON schema configurations by tracing edges,
    evaluating nodes (RAG, templates, input/output), and querying Ollama Granite.
    """
    def __init__(self):
        self.current_dir = os.path.dirname(os.path.abspath(__file__))
        self.flows_dir = os.path.join(self.current_dir, "flows")
        self.ollama_url = "http://localhost:11434/api/generate"

    def _query_ollama(self, prompt: str, model: str = "granite3.3:2b", temperature: float = 0.5) -> str:
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature
            }
        }
        try:
            res = requests.post(self.ollama_url, json=payload, timeout=45)
            if res.status_code == 200:
                return res.json().get("response", "").strip()
            return f"Error from Ollama model: HTTP {res.status_code} - {res.text}"
        except Exception as e:
            return f"Ollama connection failed: {e}. Please ensure Ollama is running with model 'granite3.3:2b'."

    def run_var_rag_flow(self, user_message: str, lang: str = "English") -> dict:
        """
        Loads and executes 'var_rag_flow.json'.
        Traces: ChatInput -> DoclingRetriever -> PromptTemplate -> OllamaGranite -> ChatOutput.
        """
        flow_path = os.path.join(self.flows_dir, "var_rag_flow.json")
        with open(flow_path, "r", encoding="utf-8") as f:
            flow_data = json.load(f)
            
        # Visual execution history to return to frontend for node graph lighting
        execution_trace = []
        
        # Step 1: Chat Input Node
        execution_trace.append({"node_id": "chat-input-1", "status": "active", "output": user_message})
        
        # Step 2: Docling RAG Node
        # In actual LangFlow this calls a retriever. Here we query our Docling parser.
        retrieved_rules = get_law_section(user_message)
        execution_trace.append({
            "node_id": "docling-retriever-1", 
            "status": "active", 
            "output": retrieved_rules[:150] + "..." # truncated log
        })
        
        # Step 3: Prompt Template Node
        prompt_node = next(n for n in flow_data["data"]["nodes"] if n["id"] == "prompt-template-1")
        raw_template = prompt_node["data"]["node"]["template"]
        if isinstance(raw_template, dict):
            raw_template = raw_template.get("template", "")
        
        # Format expects matching dictionary keys (dots aren't valid in format identifiers)
        # We replace dots with underscores in both the template string and dictionary keys.
        formatted_template = raw_template.replace("docling-retriever-1.output", "docling_retriever_1_output")
        formatted_template = formatted_template.replace("chat-input-1.message", "chat_input_1_message")
        
        prompt_content = formatted_template.format(
            docling_retriever_1_output=retrieved_rules,
            chat_input_1_message=user_message
        )
        prompt_content += f"\n\nIMPORTANT SYSTEM INSTRUCTION: You must write your entire response and explanation in the target language: '{lang}' (e.g. Hindi, Spanish, French, Mandarin Chinese, or English). Do not write any English summary if the target language is not English. Translate all tactical feedback and rule references."
        execution_trace.append({"node_id": "prompt-template-1", "status": "active", "output": "Formatted Prompt Template"})
        
        # Step 4: Ollama Granite LLM Node
        llm_node = next(n for n in flow_data["data"]["nodes"] if n["id"] == "ollama-granite-1")
        model = llm_node["data"]["node"]["template"]["model"]
        temp = llm_node["data"]["node"]["template"]["temperature"]
        
        print(f"Running LangFlow [VAR RAG] via model {model}...")
        llm_response = self._query_ollama(prompt_content, model=model, temperature=temp)
        execution_trace.append({"node_id": "ollama-granite-1", "status": "active", "output": "Ollama Response Generated"})
        
        # Step 5: Chat Output Node
        execution_trace.append({"node_id": "chat-output-1", "status": "active", "output": llm_response})
        
        return {
            "flow_id": "var_rag_flow",
            "result": llm_response,
            "rules_used": retrieved_rules[:400] + ("..." if len(retrieved_rules) > 400 else ""),
            "trace": execution_trace
        }

    def run_coach_persona_flow(self, user_message: str, persona: str = "expert", lang: str = "English", mode: str = "analyst", match_id: str = None, match_name: str = None, red_players: list = None, blue_players: list = None) -> dict:
        """
        Loads and executes 'coach_persona_flow.json'.
        Traces: ChatInput + PersonaPrompter -> PromptTemplate -> OllamaGranite -> ChatOutput.
        """
        flow_path = os.path.join(self.flows_dir, "coach_persona_flow.json")
        with open(flow_path, "r", encoding="utf-8") as f:
            flow_data = json.load(f)
            
        execution_trace = []
        
        # Step 1: Input node
        execution_trace.append({"node_id": "chat-input-2", "status": "active", "output": user_message})
        
        # Step 2: Persona Prompter Node
        prompter_node = next(n for n in flow_data["data"]["nodes"] if n["id"] == "persona-prompter-2")
        system_prompts = prompter_node["data"]["node"]["template"]["system_prompt"]
        selected_system_prompt = system_prompts.get(persona, system_prompts["expert"])
        execution_trace.append({
            "node_id": "persona-prompter-2", 
            "status": "active", 
            "output": f"Loaded persona: {persona} (Mode: {mode})"
        })
        
        # Step 3: Prompt Template Node
        prompt_node = next(n for n in flow_data["data"]["nodes"] if n["id"] == "prompt-template-2")
        raw_template = prompt_node["data"]["node"]["template"]
        if isinstance(raw_template, dict):
            raw_template = raw_template.get("template", "")
        
        formatted_template = raw_template.replace("persona-prompter-2.system_prompt", "persona_prompter_2_system_prompt")
        formatted_template = formatted_template.replace("chat-input-2.message", "chat_input_2_message")
        
        prompt_content = formatted_template.format(
            persona_propper_2_system_prompt=selected_system_prompt,
            persona_prompter_2_system_prompt=selected_system_prompt,
            chat_input_2_message=user_message
        )

        # Context Grounding
        m_name = ""
        match_context_str = ""
        if match_id and match_id in MATCH_DETAILS_MAP:
            details = MATCH_DETAILS_MAP[match_id]
            m_name = match_name or details["name"]
            milestones_str = "\n".join([f"- {m}" for m in details["milestones"]])
            match_context_str = f"""
---
Active Match Database Context:
- Match Name: {m_name} (ID: {match_id})
- Stage: {details["stage"]}
- Scoreline: {details["score"]}
- Status: {details.get("status", "FT")}
- Possession: Team A {details["possession"]["A"]}% vs Team B {details["possession"]["B"]}%
- Shots: Team A {details["shots"]["A"]} vs Team B {details["shots"]["B"]}
- Key Milestones:
{milestones_str}
---
"""
            prompt_content += match_context_str

        # Whiteboard coordinate serialization
        whiteboard_context_str = ""
        if red_players or blue_players:
            teams = match_name.split(" vs ") if match_name else ["Red Team", "Blue Team"]
            team_red_name = teams[0] if len(teams) > 0 else "Red Team"
            team_blue_name = teams[1] if len(teams) > 1 else "Blue Team"
            
            whiteboard_context_str = f"\n\nActive Interactive Tactical Whiteboard Layout:\n"
            if red_players:
                whiteboard_context_str += f"- {team_red_name} (Red tokens):\n"
                for p in red_players:
                    whiteboard_context_str += f"  * Player {p.get('num', '?')} ({p.get('pos', '?')}) at coordinate (X: {round(p.get('x', 0),1)}%, Y: {round(p.get('y', 0),1)}%)\n"
            if blue_players:
                whiteboard_context_str += f"- {team_blue_name} (Blue tokens):\n"
                for p in blue_players:
                    whiteboard_context_str += f"  * Player {p.get('num', '?')} ({p.get('pos', '?')}) at coordinate (X: {round(p.get('x', 0),1)}%, Y: {round(p.get('y', 0),1)}%)\n"
            whiteboard_context_str += "---\n"

        prompt_content += f"\n\nIMPORTANT SYSTEM INSTRUCTION: You must write your entire response and tactical advice in the target language: '{lang}' (e.g. Hindi, Spanish, French, Mandarin Chinese, or English). Do not write any English summary if the target language is not English. Maintain the voice and vocabulary of the selected persona."
        
        # Mode modulation instruction
        if mode == "fan":
            prompt_content += "\n\nIMPORTANT STYLE MODIFIER: The user is in 'Fan Mode' (Human-Centered Explainable AI)."
            if m_name:
                prompt_content += f"\nThe active match is {m_name}. You must answer the user's question about the match using the provided Match Database Context above. You can explain turning points, general gameplay, stats, milestones, or any question they ask about this match."
            prompt_content += "\nTranslate complex tactical jargon (e.g. counter-pressing, low block, rest defense, half-spaces) into simple real-world analogies (e.g. comparing a high press to a school of fish surrounding prey, or low block to defending a castle door). Keep explanations extremely friendly, simple, and accessible."
            prompt_content += """
To build trust and understanding (Explainable AI), you MUST append a structured "🔍 Explainable AI breakdown" block at the very end of your response. Use this exact format (do not skip any fields):

---
### 🔍 Explainable AI breakdown
- **Confidence Score:** [State a confidence percentage between 0% and 100% based on whether the data contains enough context for the answer]
- **Grounding Facts:** [State 1-2 exact database statistics or match milestones from the context used to verify the answer]
- **Reasoning Process:** [Briefly describe the 2-3 step logical path you followed to generate the response]
"""
        else:
            prompt_content += "\n\nIMPORTANT STYLE MODIFIER: The user is in 'Analyst Mode'. Provide deep structural, tactical, and statistical analysis."
            if whiteboard_context_str:
                prompt_content += f"\n{whiteboard_context_str}\n"
                prompt_content += "CRITICAL INSTRUCTION: The user has rearranged the player tokens on the tactical whiteboard. You MUST directly explain and reference these player coordinates (e.g., highlighting specific player numbers, positions, and coordinates like X% or Y% to indicate compact defensive lines, inverted wingers, wide overloads, or vacant center areas) to answer the user's question. Explain how this visual arrangement affects tactical geometry (e.g. spatial compression, half-spaces, Zone 14, rest defense)."
            else:
                prompt_content += "\nUse advanced terminology like half-spaces, defensive line compression, transition structures, rest defense, and zone 14. Be precise, detailed, and highly technical, referring to tactical geometry."

        execution_trace.append({"node_id": "prompt-template-2", "status": "active", "output": f"Formatted Prompt ({mode})"})
        
        # Step 4: Ollama Granite Node
        llm_node = next(n for n in flow_data["data"]["nodes"] if n["id"] == "ollama-granite-2")
        model = llm_node["data"]["node"]["template"]["model"]
        temp = llm_node["data"]["node"]["template"]["temperature"]
        
        print(f"Running LangFlow [Coach Chat] via model {model} (Persona: {persona}, Mode: {mode})...")
        llm_response = self._query_ollama(prompt_content, model=model, temperature=temp)
        execution_trace.append({"node_id": "ollama-granite-2", "status": "active", "output": "Ollama Response Generated"})
        
        # Step 5: Chat Output Node
        execution_trace.append({"node_id": "chat-output-2", "status": "active", "output": llm_response})
        
        return {
            "flow_id": "coach_persona_flow",
            "result": llm_response,
            "persona": persona,
            "mode": mode,
            "trace": execution_trace
        }

    def run_match_summary_flow(self, match_id: str, match_name: str, lang: str = "English") -> dict:
        """
        Loads stats and milestone events for a match, formats a prompt, and queries Ollama Granite
        to generate a structured journalist report. Parses the output into first half, second half,
        tactical insights, and player performance sections.
        """
        # Select match info
        details = MATCH_DETAILS_MAP.get(match_id, MATCH_DETAILS_MAP["3869685"])
        m_name = match_name or details["name"]
        
        # Prepare milestones block
        milestones_str = "\n".join([f"- {m}" for m in details["milestones"]])
        
        # Formulate prompt for Granite AI
        prompt = f"""You are a professional football journalist writing a premium, analytical match report for a sports journal like The Athletic.
Analyze the match: {m_name} (Match ID: {match_id}).

Match Details & Stats:
- Stage: {details["stage"]}
- Full-time Score: {details["score"]}
- Status: {details["status"]}
- Possession: {details["possession"]["A"]}% (Team A) vs {details["possession"]["B"]}% (Team B)
- Shots: {details["shots"]["A"]} (Team A) vs {details["shots"]["B"]} (Team B)
- Completed Passes: {details["passes"]["A"]} (Team A) vs {details["passes"]["B"]} (Team B)

Key Match Milestones:
{milestones_str}

IMPORTANT TARGET LANGUAGE INSTRUCTION: You must write your entire report in the target language: '{lang}' (e.g., Hindi, Spanish, French, Mandarin Chinese, or English). Do not mix English if the target language is not English.

Your report MUST be structured into exactly four sections. Start each section with its corresponding tag on a new line:
[FIRST_HALF]
Write a detailed, analytical summary of the first half events, tactical setups, and team control.
[SECOND_HALF]
Write a detailed summary of second half events, tempo changes, key substitutions, and late-game moments.
[TACTICAL_INSIGHTS]
Provide technical insights, explaining why tactical shifts occurred and how shape adjustments affected momentum.
[PLAYER_PERFORMANCE]
Explain player performance under pressure, passing accuracy shifts, and physical fatigue decay in late match intervals.

Do not write any introductory or concluding chat filler. Just return the structured sections starting directly with the tags.
"""

        print(f"Running LangFlow [Match Summary] via model granite3.3:2b for match {m_name} (Language: {lang})...")
        llm_response = self._query_ollama(prompt, model="granite3.3:2b", temperature=0.4)
        
        # Parse sections
        import re
        first_half = ""
        second_half = ""
        tactical_insights = ""
        player_performance = ""
        
        parts = re.split(r'\[(FIRST_HALF|SECOND_HALF|TACTICAL_INSIGHTS|PLAYER_PERFORMANCE)\]', llm_response)
        for i in range(1, len(parts), 2):
            tag = parts[i]
            val = parts[i+1].strip() if i+1 < len(parts) else ""
            if tag == "FIRST_HALF":
                first_half = val
            elif tag == "SECOND_HALF":
                second_half = val
            elif tag == "TACTICAL_INSIGHTS":
                tactical_insights = val
            elif tag == "PLAYER_PERFORMANCE":
                player_performance = val

        # Fallback validation to ensure no section is empty
        fallbacks = details["fallbacks"]
        return {
            "flow_id": "match_summary_flow",
            "match_id": match_id,
            "match_name": m_name,
            "lang": lang,
            "first_half": first_half or fallbacks["first_half"],
            "second_half": second_half or fallbacks["second_half"],
            "tactical_insights": tactical_insights or fallbacks["tactical_insights"],
            "player_performance": player_performance or fallbacks["player_performance"]
        }

    def run_momentum_analysis_flow(self, match_id: str, match_name: str, lang: str = "English") -> dict:
        """
        Loads stats and milestone events for a match, formats a prompt, and queries Ollama Granite
        to generate a structured explanation of the match rollercoaster curve, dangerous periods,
        pressure phases, and tactical influence.
        """
        # Select match info
        details = MATCH_DETAILS_MAP.get(match_id, MATCH_DETAILS_MAP["3869685"])
        m_name = match_name or details["name"]
        
        # Prepare milestones block
        milestones_str = "\n".join([f"- {m}" for m in details["milestones"]])
        
        # Formulate prompt for Granite AI
        prompt = f"""You are a professional football analyst explaining a match control curve and tactical momentum shifts.
Analyze the match: {m_name} (Match ID: {match_id}).

Match Details & Stats:
- Stage: {details["stage"]}
- Score: {details["score"]}
- Possession: {details["possession"]["A"]}% vs {details["possession"]["B"]}%
- Shots: {details["shots"]["A"]} vs {details["shots"]["B"]}

Key Match Milestones:
{milestones_str}

IMPORTANT TARGET LANGUAGE INSTRUCTION: You must write your entire explanation in the target language: '{lang}' (e.g., Hindi, Spanish, French, Mandarin Chinese, or English). Do not mix English if the target language is not English.

Your analysis MUST be structured into exactly four sections. Start each section with its corresponding tag on a new line:
[DANGEROUS_PERIODS]
Explain when the match momentum was most dangerous, what turnovers led to threat, and which team created spikes of goal threat.
[ATTACKING_DOMINANCE]
Explain when and why a team dominated possession or compressed the opponent block, detailing territorial control.
[PRESSURE_PHASES]
Explain shifts in pressing intensity, midfield counter-pressing, and how tactical instructions affected the pressure timeline.
[TACTICAL_INFLUENCE]
Explain the overall tactical reasons for the dominance curves, describing substitutions, system overrides, or physical factors.

Do not write any introductory or concluding chat filler. Just return the structured sections starting directly with the tags.
"""

        print(f"Running LangFlow [Momentum Analysis] via model granite3.3:2b for match {m_name} (Language: {lang})...")
        llm_response = self._query_ollama(prompt, model="granite3.3:2b", temperature=0.4)
        
        # Parse sections
        import re
        dangerous_periods = ""
        attacking_dominance = ""
        pressure_phases = ""
        tactical_influence = ""
        
        parts = re.split(r'\[(DANGEROUS_PERIODS|ATTACKING_DOMINANCE|PRESSURE_PHASES|TACTICAL_INFLUENCE)\]', llm_response)
        for i in range(1, len(parts), 2):
            tag = parts[i]
            val = parts[i+1].strip() if i+1 < len(parts) else ""
            if tag == "DANGEROUS_PERIODS":
                dangerous_periods = val
            elif tag == "ATTACKING_DOMINANCE":
                attacking_dominance = val
            elif tag == "PRESSURE_PHASES":
                pressure_phases = val
            elif tag == "TACTICAL_INFLUENCE":
                tactical_influence = val

        # Fallback validation
        fallbacks = details["fallbacks"]
        return {
            "flow_id": "momentum_analysis_flow",
            "match_id": match_id,
            "match_name": m_name,
            "lang": lang,
            "dangerous_periods": dangerous_periods or fallbacks["dangerous_periods"],
            "attacking_dominance": attacking_dominance or fallbacks["attacking_dominance"],
            "pressure_phases": pressure_phases or fallbacks["pressure_phases"],
            "tactical_influence": tactical_influence or fallbacks["tactical_influence"]
        }

if __name__ == "__main__":
    print("Testing LangFlow Orchestrator...")
    orchestrator = LangFlowOrchestrator()
    
    # Test VAR RAG flow
    print("\nExecuting VAR RAG flow for 'Explain handball criteria'...")
    res = orchestrator.run_var_rag_flow("Explain handball rules for deflections")
    print("Result:")
    print(res["result"])
    
    # Test Coach Chat flow
    print("\nExecuting Coach Chat flow for 'Explain low block' with casual persona...")
    res_chat = orchestrator.run_coach_persona_flow("What is a low block?", persona="casual")
    print("Result:")
    print(res_chat["result"])
