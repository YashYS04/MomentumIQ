import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Home from "./components/Home";
import MatchExplorer from "./components/MatchExplorer";
import Dashboard from "./components/Dashboard";
import VarRoom from "./components/VarRoom";
import TacticalBoard from "./components/TacticalBoard";
import About from "./components/About";
import PressureMonitor from "./components/PressureMonitor";
import { LayoutDashboard, ShieldCheck, Layers, Home as HomeIcon, LineChart, Globe, HelpCircle, FileText, User } from "lucide-react";

function App() {
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [backendStatus, setBackendStatus] = useState("connecting"); // connecting, online, offline
  const [aiLanguage, setAiLanguage] = useState("English");

  useEffect(() => {
    // Fetch available World Cup matches from our FastAPI backend
    fetch("http://localhost:8000/api/matches")
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        setMatches(data);
        if (data.length > 0) {
          setSelectedMatchId(data[0].match_id); // Default to first match (Argentina vs France)
        }
        setBackendStatus("online");
      })
      .catch((err) => {
        console.error("Failed to connect to backend:", err);
        setBackendStatus("offline");
        // Fallback mock matches data in case backend is loading/offline during scaffolding
        const mockMatches = [
          { match_id: "3869685", name: "Argentina vs France", stage: "Final", desc: "The greatest final in history. Shootout drama." },
          { match_id: "3857300", name: "Argentina vs Saudi Arabia", stage: "Group Stage", desc: "One of the biggest upsets in World Cup history." },
          { match_id: "3869420", name: "Croatia vs Brazil", stage: "Quarter-Final", desc: "Croatia's resilience and mental pressure shootout." },
          { match_id: "3857255", name: "Japan vs Spain", stage: "Group Stage", desc: "Controversial VAR ball-out-of-play decision." }
        ];
        setMatches(mockMatches);
        setSelectedMatchId(mockMatches[0].match_id);
      });
  }, []);

  const handleMatchChange = (e) => {
    setSelectedMatchId(e.target.value);
  };

  const selectedMatch = matches.find(m => m.match_id === selectedMatchId) || {};

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 min-h-screen flex flex-col font-body">
      {/* Header component with Selector */}
      {activeTab !== "home" && (
        <Header 
          matches={matches} 
          selectedMatchId={selectedMatchId} 
          onMatchChange={handleMatchChange}
          backendStatus={backendStatus}
          aiLanguage={aiLanguage}
          onLanguageChange={(e) => setAiLanguage(e.target.value)}
          hideSelector={activeTab === "explorer" || activeTab === "about"}
          onLogoClick={() => setActiveTab("home")}
        />
      )}

      {activeTab !== "home" && (
        <nav className="flex flex-wrap gap-1 bg-bg-card-light border border-border-warm p-1 rounded-xl w-full md:w-auto self-start mb-8 shadow-sm z-10">
          
          <button 
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "explorer" 
                ? "bg-forest-green text-white shadow-sm border border-forest-green" 
                : "text-forest-green-muted hover:text-forest-green hover:bg-forest-green/5"
            }`}
            onClick={() => setActiveTab("explorer")}
            style={{ minHeight: "38px" }}
          >
            <Globe size={14} />
            Match Explorer
          </button>

          <button 
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "story" 
                ? "bg-forest-green text-white shadow-sm border border-forest-green" 
                : "text-forest-green-muted hover:text-forest-green hover:bg-forest-green/5"
            }`}
            onClick={() => setActiveTab("story")}
            style={{ minHeight: "38px" }}
          >
            <LayoutDashboard size={14} />
            Match Story
          </button>

          <button 
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "summary" 
                ? "bg-forest-green text-white shadow-sm border border-forest-green" 
                : "text-forest-green-muted hover:text-forest-green hover:bg-forest-green/5"
            }`}
            onClick={() => setActiveTab("summary")}
            style={{ minHeight: "38px" }}
          >
            <FileText size={14} />
            AI Match Summary
          </button>

          <button 
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "momentum" 
                ? "bg-forest-green text-white shadow-sm border border-forest-green" 
                : "text-forest-green-muted hover:text-forest-green hover:bg-forest-green/5"
            }`}
            onClick={() => setActiveTab("momentum")}
            style={{ minHeight: "38px" }}
          >
            <LineChart size={14} />
            Momentum Analysis
          </button>

          <button 
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "players" 
                ? "bg-forest-green text-white shadow-sm border border-forest-green" 
                : "text-forest-green-muted hover:text-forest-green hover:bg-forest-green/5"
            }`}
            onClick={() => setActiveTab("players")}
            style={{ minHeight: "38px" }}
          >
            <User size={14} />
            Player Analytics
          </button>

          <button 
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "var" 
                ? "bg-forest-green text-white shadow-sm border border-forest-green" 
                : "text-forest-green-muted hover:text-forest-green hover:bg-forest-green/5"
            }`}
            onClick={() => setActiveTab("var")}
            style={{ minHeight: "38px" }}
          >
            <ShieldCheck size={14} />
            VAR Explainer
          </button>

          <button 
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "companion" 
                ? "bg-forest-green text-white shadow-sm border border-forest-green" 
                : "text-forest-green-muted hover:text-forest-green hover:bg-forest-green/5"
            }`}
            onClick={() => setActiveTab("companion")}
            style={{ minHeight: "38px" }}
          >
            <Layers size={14} />
            AI Companion
          </button>

          <button 
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "about" 
                ? "bg-forest-green text-white shadow-sm border border-forest-green" 
                : "text-forest-green-muted hover:text-forest-green hover:bg-forest-green/5"
            }`}
            onClick={() => setActiveTab("about")}
            style={{ minHeight: "38px" }}
          >
            <HelpCircle size={14} />
            About
          </button>
        </nav>
      )}

      {/* Dynamic Tab Page Rendering with spring fade-in entry */}
      <main key={activeTab} className="animate-slide-up">
        {activeTab === "home" && (
          <Home 
            onEnterArena={() => setActiveTab("explorer")} 
            onSelectMatch={(id) => {
              setSelectedMatchId(id);
              setActiveTab("story");
            }}
          />
        )}
        {activeTab === "explorer" && (
          <MatchExplorer 
            matches={matches} 
            selectedMatchId={selectedMatchId} 
            onSelectMatch={(id) => {
              setSelectedMatchId(id);
              setActiveTab("story");
            }} 
          />
        )}
        {activeTab === "story" && (
          <Dashboard matchId={selectedMatchId} matchName={selectedMatch.name} selectedMatch={selectedMatch} aiLanguage={aiLanguage} activeView="story" />
        )}
        {activeTab === "summary" && (
          <Dashboard matchId={selectedMatchId} matchName={selectedMatch.name} selectedMatch={selectedMatch} aiLanguage={aiLanguage} activeView="summary" />
        )}
        {activeTab === "momentum" && (
          <Dashboard matchId={selectedMatchId} matchName={selectedMatch.name} selectedMatch={selectedMatch} aiLanguage={aiLanguage} activeView="momentum" />
        )}
        {activeTab === "players" && (
          <PressureMonitor matchId={selectedMatchId} matchName={selectedMatch.name} selectedMatch={selectedMatch} />
        )}
        {activeTab === "var" && (
          <VarRoom matchId={selectedMatchId} matchName={selectedMatch.name} selectedMatch={selectedMatch} aiLanguage={aiLanguage} />
        )}
        {activeTab === "companion" && (
          <TacticalBoard matchId={selectedMatchId} matchName={selectedMatch.name} aiLanguage={aiLanguage} />
        )}
        {activeTab === "about" && (
          <About />
        )}
      </main>
    </div>
  );
}

export default App;
