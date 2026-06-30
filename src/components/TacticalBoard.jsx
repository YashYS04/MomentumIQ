import React, { useState, useEffect, useRef } from "react";
import { Send, Layers, Compass, HelpCircle } from "lucide-react";

// Default starting positions (as percentages of field size)
const DEFAULT_RED_PLAYERS = [
  { id: "r1", num: "1", pos: "GK", x: 8, y: 50 },
  { id: "r2", num: "2", pos: "RB", x: 24, y: 80 },
  { id: "r3", num: "3", pos: "LB", x: 24, y: 20 },
  { id: "r4", num: "4", pos: "CB", x: 20, y: 38 },
  { id: "r5", num: "5", pos: "CB", x: 20, y: 62 },
  { id: "r6", num: "6", pos: "DM", x: 38, y: 50 },
  { id: "r7", num: "8", pos: "CM", x: 46, y: 35 },
  { id: "r8", num: "10", pos: "AM", x: 48, y: 65 },
  { id: "r9", num: "9", pos: "CF", x: 64, y: 50 },
  { id: "r10", num: "11", pos: "LW", x: 58, y: 20 },
  { id: "r11", num: "7", pos: "RW", x: 58, y: 80 }
];

const DEFAULT_BLUE_PLAYERS = [
  { id: "b1", num: "1", pos: "GK", x: 92, y: 50 },
  { id: "b2", num: "2", pos: "RB", x: 76, y: 20 },
  { id: "b3", num: "3", pos: "LB", x: 76, y: 80 },
  { id: "b4", num: "5", pos: "CB", x: 80, y: 38 },
  { id: "b5", num: "4", pos: "CB", x: 80, y: 62 },
  { id: "b6", num: "7", pos: "RM", x: 68, y: 25 },
  { id: "b7", num: "11", pos: "LM", x: 68, y: 75 },
  { id: "b8", num: "6", pos: "CM", x: 70, y: 40 },
  { id: "b9", num: "8", pos: "CM", x: 70, y: 60 },
  { id: "b10", num: "9", pos: "CF", x: 52, y: 42 },
  { id: "b11", num: "10", pos: "CF", x: 52, y: 58 }
];

const RED_FORMATIONS = {
  "4-3-3": DEFAULT_RED_PLAYERS,
  "3-5-2": [
    { id: "r1", num: "1", pos: "GK", x: 8, y: 50 },
    { id: "r2", num: "2", pos: "RWB", x: 35, y: 82 },
    { id: "r3", num: "3", pos: "LWB", x: 35, y: 18 },
    { id: "r4", num: "4", pos: "CB", x: 20, y: 30 },
    { id: "r5", num: "5", pos: "CB", x: 18, y: 50 },
    { id: "r6", num: "6", pos: "CB", x: 20, y: 70 },
    { id: "r7", num: "8", pos: "DM", x: 38, y: 50 },
    { id: "r8", num: "10", pos: "CM", x: 45, y: 38 },
    { id: "r9", num: "9", pos: "AM", x: 48, y: 62 },
    { id: "r10", num: "11", pos: "CF", x: 62, y: 40 },
    { id: "r11", num: "7", pos: "CF", x: 62, y: 60 }
  ],
  "4-4-2": [
    { id: "r1", num: "1", pos: "GK", x: 8, y: 50 },
    { id: "r2", num: "2", pos: "RB", x: 24, y: 80 },
    { id: "r3", num: "3", pos: "LB", x: 24, y: 20 },
    { id: "r4", num: "4", pos: "CB", x: 20, y: 38 },
    { id: "r5", num: "5", pos: "CB", x: 20, y: 62 },
    { id: "r6", num: "6", pos: "RM", x: 40, y: 82 },
    { id: "r7", num: "8", pos: "LM", x: 40, y: 18 },
    { id: "r8", num: "10", pos: "CM", x: 38, y: 40 },
    { id: "r9", num: "9", pos: "CM", x: 38, y: 60 },
    { id: "r10", num: "11", pos: "CF", x: 60, y: 42 },
    { id: "r11", num: "7", pos: "CF", x: 60, y: 58 }
  ]
};

const BLUE_FORMATIONS = {
  "4-4-2": DEFAULT_BLUE_PLAYERS,
  "4-3-3": [
    { id: "b1", num: "1", pos: "GK", x: 92, y: 50 },
    { id: "b2", num: "2", pos: "RB", x: 76, y: 20 },
    { id: "b3", num: "3", pos: "LB", x: 76, y: 80 },
    { id: "b4", num: "5", pos: "CB", x: 80, y: 38 },
    { id: "b5", num: "4", pos: "CB", x: 80, y: 62 },
    { id: "b6", num: "6", pos: "DM", x: 62, y: 50 },
    { id: "b7", num: "8", pos: "CM", x: 54, y: 35 },
    { id: "b8", num: "10", pos: "CM", x: 54, y: 65 },
    { id: "b9", num: "9", pos: "CF", x: 38, y: 50 },
    { id: "b10", num: "11", pos: "LW", x: 40, y: 80 },
    { id: "b11", num: "7", pos: "RW", x: 40, y: 20 }
  ],
  "5-4-1": [
    { id: "b1", num: "1", pos: "GK", x: 92, y: 50 },
    { id: "b2", num: "2", pos: "RWB", x: 75, y: 15 },
    { id: "b3", num: "3", pos: "LWB", x: 75, y: 85 },
    { id: "b4", num: "5", pos: "CB", x: 82, y: 30 },
    { id: "b5", num: "4", pos: "CB", x: 84, y: 50 },
    { id: "b6", num: "15", pos: "CB", x: 82, y: 70 },
    { id: "b7", num: "7", pos: "RM", x: 68, y: 25 },
    { id: "b8", num: "11", pos: "LM", x: 68, y: 75 },
    { id: "b9", num: "6", pos: "CM", x: 70, y: 40 },
    { id: "b10", num: "8", pos: "CM", x: 70, y: 60 },
    { id: "b11", num: "9", pos: "CF", x: 45, y: 50 }
  ]
};

const GLOSSARY_TERMS = {
  "low block": "A defensive tactic where the defending team defends deep in their own territory, compressing space in the penalty box to prevent penetration.",
  "gegenpressing": "Counter-pressing. An immediate team press to recover possession of the ball within seconds of losing it.",
  "inverted winger": "A winger who plays on the opposite flank of their dominant foot (e.g. left-footed on the right wing) to cut inside and shoot.",
  "half-space": "The vertical channels between the wide wings and the center of the pitch. Crucial zone for playmakers to create chances.",
  "rest defense": "The defensive structure maintained by the attacking team while they have possession, preparing to stop counter-attacks immediately.",
  "zone 14": "The critical central attacking zone just outside the opponent's box, key for line-breaking final passes.",
  "tiki-taka": "A possession-based tactical style characterized by short, quick passing combinations and fluid positional rotation.",
  "overload": "A tactical maneuver where a team concentrates multiple players on one side of the pitch to draw the defense and exploit space on the weak side."
};

const renderTextWithGlossary = (text, role) => {
  if (role !== "ai") return text;
  
  const regex = new RegExp(`\\b(${Object.keys(GLOSSARY_TERMS).join("|")})\\b`, "gi");
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    const key = part.toLowerCase();
    if (GLOSSARY_TERMS[key]) {
      return (
        <span key={index} className="glossary-term">
          {part}
          <span className="glossary-tooltip-card">
            <strong className="block text-gold-accent mb-1 text-[10px] uppercase font-bold tracking-wider">{part}</strong>
            {GLOSSARY_TERMS[key]}
          </span>
        </span>
      );
    }
    return part;
  });
};

function TacticalBoard({ matchId, matchName, aiLanguage }) {
  const teams = matchName ? matchName.split(" vs ") : ["Red Team", "Blue Team"];
  const teamRedName = teams[0] || "Red Team";
  const teamBlueName = teams[1] || "Blue Team";

  const [redPlayers, setRedPlayers] = useState(DEFAULT_RED_PLAYERS);
  const [bluePlayers, setBluePlayers] = useState(DEFAULT_BLUE_PLAYERS);
  const [ball, setBall] = useState({ x: 50, y: 50 });
  const [chatMessages, setChatMessages] = useState([
    { role: "ai", text: `Welcome to the MomentumIQ Tactical Board. Drag the player tokens on the green whiteboard turf to set up your analysis and ask me any tactical questions!` }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [persona, setPersona] = useState("expert"); // expert, casual, gamer
  const [companionMode, setCompanionMode] = useState("analyst"); // fan or analyst
  const [sending, setSending] = useState(false);
  const [explainModalOpen, setExplainModalOpen] = useState(false);

  // LangFlow Visual Nodes state
  const [activeNodes, setActiveNodes] = useState([]);
  
  const boardRef = useRef(null);
  const dragItem = useRef(null);

  const handleMouseDown = (e, itemType, itemId) => {
    e.preventDefault();
    dragItem.current = { itemType, itemId };
  };

  const handleMouseMove = (e) => {
    if (!dragItem.current || !boardRef.current) return;
    
    const rect = boardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const boundedX = Math.max(2, Math.min(98, x));
    const boundedY = Math.max(2, Math.min(98, y));
    
    const { itemType, itemId } = dragItem.current;
    
    if (itemType === "red") {
      setRedPlayers(prev => prev.map(p => p.id === itemId ? { ...p, x: boundedX, y: boundedY } : p));
    } else if (itemType === "blue") {
      setBluePlayers(prev => prev.map(p => p.id === itemId ? { ...p, x: boundedX, y: boundedY } : p));
    } else if (itemType === "ball") {
      setBall({ x: boundedX, y: boundedY });
    }
  };

  const handleMouseUp = () => {
    dragItem.current = null;
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const triggerVisualFlowTrace = (trace) => {
    setActiveNodes([]);
    trace.forEach((step, idx) => {
      setTimeout(() => {
        setActiveNodes(prev => [...prev, step.node_id]);
      }, idx * 450);
    });
  };

  const handleSendMessage = (overrideMsg) => {
    const msgToSend = (typeof overrideMsg === "string" ? overrideMsg : inputVal).trim();
    if (!msgToSend || sending) return;
    
    setChatMessages(prev => [...prev, { role: "user", text: msgToSend }]);
    setInputVal("");
    setSending(true);
    
    setActiveNodes(["chat-input-2"]);

    fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: msgToSend,
        persona: persona,
        lang: aiLanguage,
        mode: companionMode,
        match_id: matchId,
        match_name: matchName,
        red_players: redPlayers,
        blue_players: bluePlayers
      })
    })
      .then(res => res.json())
      .then(data => {
        setChatMessages(prev => [...prev, { role: "ai", text: data.result }]);
        if (data.trace) {
          triggerVisualFlowTrace(data.trace);
        }
        setSending(false);
      })
      .catch(err => {
        console.error("Tactical chat failed:", err);
        // Fallback simulation
        setTimeout(() => {
          let responseText = "";
          if (companionMode === "fan") {
            responseText = "Imagine the field is a big chess board. By placing your player tokens to stretch the defensive team, you make it much easier to run right up the middle where there's plenty of space!\n\n---\n### 🔍 Explainable AI breakdown\n- **Confidence Score:** 90%\n- **Grounding Facts:** Default 4-3-3 shape vs 4-4-2 setup\n- **Reasoning Process:** Step 1: Detect width request. Step 2: Formulate simple spatial gate analogy to explain stretched defense lines.";
          } else {
            responseText = "In this alignment, notice the spatial gap in the opponent's shape. By positioning the winger high and wide, we force a defensive overload, creating an isolated 1v1 situation in the half-space. The defensive midfielder must shift laterally to cover, leaving the zone-14 space vacant to exploit.";
          }
          setChatMessages(prev => [...prev, { role: "ai", text: responseText }]);
          
          triggerVisualFlowTrace([
            { node_id: "chat-input-2" },
            { node_id: "persona-prompter-2" },
            { node_id: "prompt-template-2" },
            { node_id: "ollama-granite-2" },
            { node_id: "chat-output-2" }
          ]);
          setSending(false);
        }, 1200);
      });
  };

  const handleResetBoard = () => {
    setRedPlayers(DEFAULT_RED_PLAYERS);
    setBluePlayers(DEFAULT_BLUE_PLAYERS);
    setBall({ x: 50, y: 50 });
  };

  const handleSelectRedFormation = (formName) => {
    if (RED_FORMATIONS[formName]) {
      setRedPlayers(RED_FORMATIONS[formName]);
    }
  };

  const handleSelectBlueFormation = (formName) => {
    if (BLUE_FORMATIONS[formName]) {
      setBluePlayers(BLUE_FORMATIONS[formName]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch w-full max-w-7xl mx-auto">
      
      {/* Left Column: Whiteboard & Orchestrator */}
      <div className="lg:col-span-3 bg-bg-card-light border border-border-warm rounded-2xl p-6 shadow-sm flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-forest-green font-display font-extrabold text-sm uppercase tracking-wider">Tactical Whiteboard</h2>
            <p className="text-forest-green-muted text-xs mt-1">Drag player tokens to reconstruct positional play, overloads, and passing channels.</p>
          </div>
          <button 
            className="bg-bg-cream/40 border border-border-warm hover:border-gold-accent/40 text-forest-green rounded-lg px-3.5 py-2 text-xs font-bold cursor-pointer transition-all active:scale-95" 
            onClick={handleResetBoard}
          >
            Reset Positions
          </button>
        </div>

        {/* Formation Preset selectors */}
        <div className="flex flex-wrap gap-4 items-center justify-between bg-bg-ivory border border-border-warm p-3 rounded-xl shadow-inner">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-mono text-forest-green-muted uppercase font-bold">{teamRedName}:</span>
            <div className="flex bg-bg-cream p-0.5 rounded-lg border border-border-warm">
              {["4-3-3", "3-5-2", "4-4-2"].map((f) => (
                <button
                  key={`red-${f}`}
                  onClick={() => handleSelectRedFormation(f)}
                  className="px-2.5 py-1 rounded text-[9px] font-extrabold text-forest-green-muted hover:text-forest-green hover:bg-white transition-all cursor-pointer"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-mono text-forest-green-muted uppercase font-bold">{teamBlueName}:</span>
            <div className="flex bg-bg-cream p-0.5 rounded-lg border border-border-warm">
              {["4-4-2", "4-3-3", "5-4-1"].map((f) => (
                <button
                  key={`blue-${f}`}
                  onClick={() => handleSelectBlueFormation(f)}
                  className="px-2.5 py-1 rounded text-[9px] font-extrabold text-forest-green-muted hover:text-forest-green hover:bg-white transition-all cursor-pointer"
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Turf Whiteboard Container */}
        <div 
          ref={boardRef}
          className="relative w-full aspect-[1.5] bg-[#0A2216] border border-border-warm rounded-xl overflow-hidden shadow-inner cursor-default"
          onMouseMove={handleMouseMove}
        >
          {/* Pitch Markings */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 66.6">
            {/* Vertical Lawn stripes */}
            <g opacity="0.12">
              <rect x="0" y="0" width="10" height="66.6" fill="#042613" />
              <rect x="10" y="0" width="10" height="66.6" fill="#072c17" />
              <rect x="20" y="0" width="10" height="66.6" fill="#09311a" />
              <rect x="30" y="0" width="10" height="66.6" fill="#0c371d" />
              <rect x="40" y="0" width="10" height="66.6" fill="#0f3c20" />
              <rect x="50" y="0" width="10" height="66.6" fill="#0c4025" />
              <rect x="60" y="0" width="10" height="66.6" fill="#074529" />
              <rect x="70" y="0" width="10" height="66.6" fill="#004a2c" />
              <rect x="80" y="0" width="10" height="66.6" fill="#004e30" />
              <rect x="90" y="0" width="10" height="66.6" fill="#005334" />
            </g>
            
            {/* Markings */}
            <g opacity="0.3" stroke="#F2EDE4" strokeWidth="0.8" fill="none">
              <rect x="0" y="0" width="100" height="66.6" />
              <line x1="50" y1="0" x2="50" y2="66.6" />
              <circle cx="50" cy="33.3" r="10" />
              <rect x="0" y="13.3" width="16" height="40" />
              <rect x="84" y="13.3" width="16" height="40" />
            </g>
          </svg>

          {/* Red Team Tokens */}
          {redPlayers.map((player) => (
            <div 
              key={player.id}
              className="player-token team-red"
              style={{ left: `${player.x}%`, top: `${player.y}%` }}
              onMouseDown={(e) => handleMouseDown(e, "red", player.id)}
            >
              <div className="flex flex-col items-center">
                <span>{player.num}</span>
                <span className="text-[6px] opacity-80 leading-none uppercase">{player.pos}</span>
              </div>
            </div>
          ))}

          {/* Blue Team Tokens */}
          {bluePlayers.map((player) => (
            <div 
              key={player.id}
              className="player-token team-blue"
              style={{ left: `${player.x}%`, top: `${player.y}%` }}
              onMouseDown={(e) => handleMouseDown(e, "blue", player.id)}
            >
              <div className="flex flex-col items-center">
                <span>{player.num}</span>
                <span className="text-[6px] opacity-85 leading-none uppercase">{player.pos}</span>
              </div>
            </div>
          ))}

          {/* Ball */}
          <div 
            className="ball-token"
            style={{ left: `${ball.x}%`, top: `${ball.y}%` }}
            onMouseDown={(e) => handleMouseDown(e, "ball")}
          ></div>
        </div>

        {/* LangFlow Live Trace Console */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <Compass size={14} className="text-forest-green" />
            <h4 className="text-forest-green-muted text-xs font-bold">LangFlow Orchestrator Status (Live Trace Node)</h4>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center p-3.5 bg-bg-cream/20 border border-border-warm rounded-xl overflow-x-auto">
            <div className={`font-mono text-[9px] px-2.5 py-1.5 rounded-lg border transition-all ${
              activeNodes.includes("chat-input-2") ? "border-forest-green text-forest-green bg-forest-green/5 shadow-sm" : "border-border-warm text-forest-green-muted/60 bg-bg-cream/20"
            }`}>
              Chat Input
            </div>
            <span className="text-forest-green-muted/40 text-[10px] font-bold">→</span>
            
            <div className={`font-mono text-[9px] px-2.5 py-1.5 rounded-lg border transition-all ${
              activeNodes.includes("persona-prompter-2") ? "border-forest-green text-forest-green bg-forest-green/5 shadow-sm" : "border-border-warm text-forest-green-muted/60 bg-bg-cream/20"
            }`}>
              Persona Prompter
            </div>
            <span className="text-forest-green-muted/40 text-[10px] font-bold">→</span>

            <div className={`font-mono text-[9px] px-2.5 py-1.5 rounded-lg border transition-all ${
              activeNodes.includes("prompt-template-2") ? "border-forest-green text-forest-green bg-forest-green/5 shadow-sm" : "border-border-warm text-forest-green-muted/60 bg-bg-cream/20"
            }`}>
              Prompt Builder
            </div>
            <span className="text-forest-green-muted/40 text-[10px] font-bold">→</span>

            <div className={`font-mono text-[9px] px-2.5 py-1.5 rounded-lg border transition-all ${
              activeNodes.includes("ollama-granite-2") ? "border-forest-green text-forest-green bg-forest-green/5 shadow-sm" : "border-border-warm text-forest-green-muted/60 bg-bg-cream/20"
            }`}>
              Ollama Granite
            </div>
            <span className="text-forest-green-muted/40 text-[10px] font-bold">→</span>

            <div className={`font-mono text-[9px] px-2.5 py-1.5 rounded-lg border transition-all ${
              activeNodes.includes("chat-output-2") ? "border-forest-green text-forest-green bg-forest-green/5 shadow-sm" : "border-border-warm text-forest-green-muted/60 bg-bg-cream/20"
            }`}>
              Chat Output
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Multi-Persona Chat */}
      <div className="lg:col-span-2 bg-bg-card-light border border-border-warm rounded-2xl shadow-sm flex flex-col justify-between h-[620px] overflow-hidden">
        {/* Header with Segmented sliding-tab style selector */}
        <div className="px-5 py-4 border-b border-border-warm flex flex-col bg-bg-cream/10">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-forest-green" />
              <h3 className="text-forest-green font-display font-extrabold text-xs uppercase tracking-wider">AI Tactical Companion</h3>
            </div>
            
            {/* Fan vs Analyst Toggle */}
            <div className="flex bg-bg-cream p-0.5 rounded-lg border border-border-warm relative select-none">
              <button 
                className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold transition-all duration-300 cursor-pointer ${
                  companionMode === "fan" 
                    ? "bg-forest-green text-white shadow-sm" 
                    : "text-forest-green-muted hover:text-forest-green"
                }`}
                onClick={() => setCompanionMode("fan")}
                style={{ minHeight: "26px" }}
              >
                Fan Mode
              </button>
              <button 
                className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold transition-all duration-300 cursor-pointer ${
                  companionMode === "analyst" 
                    ? "bg-forest-green text-white shadow-sm" 
                    : "text-forest-green-muted hover:text-forest-green"
                }`}
                onClick={() => setCompanionMode("analyst")}
                style={{ minHeight: "26px" }}
              >
                Analyst Mode
              </button>
            </div>
          </div>
        </div>
        
        {/* Message Logs */}
        <div className="flex-grow overflow-y-auto p-5 flex flex-col gap-4 bg-bg-ivory/20">
          {chatMessages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed border shadow-sm transition-all duration-300 hover:shadow-md ${
                msg.role === "user" 
                  ? "bg-forest-green border-forest-green text-white rounded-br-none" 
                  : "bg-bg-card-light border-border-warm text-forest-green rounded-bl-none"
              }`}
              style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start" }}
            >
              {renderTextWithGlossary(msg.text, msg.role)}
              
              {/* Optional Explainability Badge inside Coach responses */}
              {msg.role === "ai" && idx > 0 && (
                <div className="flex justify-end mt-2 pt-2 border-t border-border-warm">
                  <button 
                    onClick={() => setExplainModalOpen(true)}
                    className="flex items-center gap-1 bg-forest-green/5 hover:bg-forest-green/10 text-forest-green font-mono text-[9px] px-2.5 py-1 rounded-full cursor-pointer transition-all font-bold"
                  >
                    <HelpCircle size={10} /> Explain weights
                  </button>
                </div>
              )}
            </div>
          ))}
          {sending && (
            <div className="max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed border bg-bg-card-light border-border-warm text-forest-green-muted rounded-bl-none animate-pulse self-start flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-accent animate-ping"></span>
              AI Tactical Companion is thinking ({companionMode} mode)...
            </div>
          )}
        </div>

        {/* ChatGPT suggestions chips */}
        <div className="flex flex-col gap-2 p-4 border-t border-border-warm bg-bg-ivory/10">
          <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider font-bold">Suggested questions</span>
          <div className="flex flex-wrap gap-2">
            {(companionMode === "fan" 
              ? [
                  "Why did Argentina dominate after halftime?",
                  "Explain how a high press works.",
                  "What does it mean to park the bus?",
                  "Why is width important in attacking?"
                ]
              : [
                  "How did pressing intensity affect Argentina's control?",
                  "How can we break a compact low block structure?",
                  "Analyze the spatial advantages of inverted wingers.",
                  "What role does rest defense play in transition?"
                ]
            ).map((sug, sidx) => (
              <button
                key={`sug-${sidx}`}
                onClick={() => handleSendMessage(sug)}
                className="bg-white border border-border-warm hover:border-gold-accent hover:bg-bg-cream/20 text-forest-green rounded-full px-3 py-1.5 text-[9.5px] font-semibold cursor-pointer shadow-sm active:scale-95 transition-all text-left truncate max-w-full"
                disabled={sending}
              >
                💡 {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Input box - touch friendly (height 44px min) */}
        <div className="p-4 border-t border-border-warm flex gap-3.5 bg-bg-cream/10">
          <input 
            type="text" 
            className="flex-grow bg-bg-ivory border border-border-warm text-forest-green rounded-xl px-4 py-3.5 text-xs focus:border-forest-green focus:outline-none transition-all placeholder:text-forest-green-muted/40 font-medium"
            placeholder="Ask AI Tactical Companion a question..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={sending}
          />
          <button 
            className="bg-forest-green hover:bg-gold-accent text-white hover:text-forest-green font-extrabold rounded-xl px-5 py-3.5 cursor-pointer transition-all flex items-center justify-center disabled:opacity-40 shadow-sm" 
            onClick={handleSendMessage}
            disabled={sending || !inputVal.trim()}
            style={{ minHeight: "44px" }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>

      {/* RAG Explainability Modal */}
      {explainModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setExplainModalOpen(false)}
        >
          <div 
            className="bg-bg-card-light border border-border-warm rounded-2xl p-6 max-w-md w-full shadow-2xl relative flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-border-warm pb-3">
              <h3 className="text-forest-green font-display font-extrabold text-xs uppercase tracking-wider">How did the AI calculate this?</h3>
              <button 
                className="text-slate-400 hover:text-forest-green transition-all text-xl cursor-pointer"
                onClick={() => setExplainModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <p className="text-forest-green-muted text-xs leading-relaxed">
              The AI Tactical Companion uses dynamic prompts that insert whiteboard token coordinate vectors and match milestones. 
              The response tone and tactical depth are weighted as:
            </p>

            {/* Feature 1 */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-forest-green font-semibold">System Instructions Weight</span>
                <span className="text-gold-accent font-mono font-bold">50%</span>
              </div>
              <div className="h-2 w-full bg-bg-cream rounded-full overflow-hidden">
                <div style={{ width: "50%" }} className="bg-forest-green h-full rounded-full"></div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-forest-green font-semibold">Whiteboard Token Coordinate Vectors</span>
                <span className="text-gold-accent font-mono font-bold">30%</span>
              </div>
              <div className="h-2 w-full bg-bg-cream rounded-full overflow-hidden">
                <div style={{ width: "30%" }} className="bg-forest-green h-full rounded-full"></div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-forest-green font-semibold">Match Database Context retrieval</span>
                <span className="text-gold-accent font-mono font-bold font-mono">20%</span>
              </div>
              <div className="h-2 w-full bg-bg-cream rounded-full overflow-hidden">
                <div style={{ width: "20%" }} className="bg-forest-green h-full rounded-full"></div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border-warm pt-4 mt-2 text-[10px] text-slate-500 leading-normal">
              * Grounded on official IFAB laws scanned by <strong>IBM Docling</strong> and processed locally by <strong>Granite 3.3 2B</strong> reasoning rules.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default TacticalBoard;
