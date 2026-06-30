import React, { useState } from "react";
import { Radio, Globe, ChevronDown } from "lucide-react";

function Header({ matches, selectedMatchId, onMatchChange, backendStatus, aiLanguage, onLanguageChange, hideSelector, onLogoClick }) {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [matchDropdownOpen, setMatchDropdownOpen] = useState(false);

  const activeMatch = matches.find(m => m.match_id === selectedMatchId) || matches[0];
  const activeMatchLabel = activeMatch 
    ? `[${activeMatch.stage.replace("Stage", "").trim()}] ${activeMatch.name}`
    : "Select Match";

  return (
    <header className="flex flex-col md:flex-row justify-between items-center px-6 py-4.5 bg-bg-card-light border border-border-warm rounded-2xl gap-4 md:gap-0 relative mt-6 mb-6 shadow-sm">
      {/* Decorative top border in gold */}
      <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-forest-green/10 via-gold-accent to-forest-green/10"></div>

      {/* Brand logo & tagline */}
      <div 
        onClick={() => onLogoClick && onLogoClick()}
        className="flex items-center gap-3.5 self-start md:self-auto cursor-pointer hover:opacity-80 transition-all active:scale-98 select-none"
      >
        <div className="flex-shrink-0 w-[52px] h-[52px] flex items-center justify-center relative">
          <img 
            src="/logo.png" 
            alt="MomentumIQ Logo" 
            className="w-full h-full object-contain select-none"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-forest-green font-serif font-black text-xl tracking-tight leading-none">
            Momentum<span className="text-gold-accent font-display font-black tracking-normal">IQ</span>
          </h1>
          <span className="text-[9px] text-forest-green-muted font-mono tracking-[0.05em] uppercase mt-1.5 leading-none">
            Explaining Football, Intelligently
          </span>
        </div>
      </div>

      {/* Controls & API Indicator */}
      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
        {/* API connection indicator */}
        <div className="flex items-center gap-2 text-xs">
          <Radio 
            size={13} 
            className={backendStatus === "online" ? "animate-pulse" : ""} 
            style={{ 
              color: backendStatus === "online" ? "#0D2C1E" : 
                     backendStatus === "offline" ? "#ff3366" : "#C29F5C" 
            }} 
          />
          <span className="font-mono text-forest-green-muted uppercase tracking-wider text-[9px] font-bold">
            {backendStatus === "online" ? "Granite AI active" : 
             backendStatus === "offline" ? "Offline Cache" : "Syncing..."}
          </span>
        </div>

        {/* Match / Language Selectors */}
        {!hideSelector && (
          <div className="flex items-center gap-2.5">
            {/* AI Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center bg-bg-ivory border border-border-warm rounded-xl px-2.5 py-1.5 hover:border-gold-accent/40 transition-all text-forest-green text-xs font-bold cursor-pointer select-none"
              >
                <Globe size={12} className="text-forest-green-muted mr-1.5" />
                <span>{aiLanguage}</span>
                <ChevronDown size={10} className={`ml-2 text-forest-green-muted transition-transform duration-200 ${langDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              
              {langDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40 cursor-default" onClick={() => setLangDropdownOpen(false)} />
                  <div className="absolute left-0 mt-1.5 min-w-[140px] bg-white border border-border-warm rounded-xl shadow-lg z-50 py-1 overflow-hidden animate-fade-in">
                    {[
                      { value: "English", label: "English" },
                      { value: "Hindi", label: "हिन्दी (Hindi)" },
                      { value: "Spanish", label: "Español (Spanish)" },
                      { value: "French", label: "Français (French)" },
                      { value: "Chinese", label: "中文 (Chinese)" }
                    ].map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => {
                          onLanguageChange({ target: { value: lang.value } });
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-all ${
                          aiLanguage === lang.value 
                            ? "bg-forest-green text-white" 
                            : "text-forest-green hover:bg-forest-green/5"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Match Selector */}
            <div className="relative">
              <button 
                onClick={() => setMatchDropdownOpen(!matchDropdownOpen)}
                className="flex items-center bg-bg-ivory border border-border-warm rounded-xl px-2.5 py-1.5 hover:border-gold-accent/40 transition-all text-forest-green text-xs font-bold cursor-pointer select-none max-w-[200px] sm:max-w-[300px]"
              >
                <span className="truncate">{activeMatchLabel}</span>
                <ChevronDown size={10} className={`ml-2 flex-shrink-0 text-forest-green-muted transition-transform duration-200 ${matchDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              
              {matchDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40 cursor-default" onClick={() => setMatchDropdownOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-72 bg-white border border-border-warm rounded-xl shadow-lg z-50 py-1 overflow-y-auto max-h-64 animate-fade-in">
                    {matches.map((match) => (
                      <button
                        key={match.match_id}
                        onClick={() => {
                          onMatchChange({ target: { value: match.match_id } });
                          setMatchDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-all border-b border-border-warm/20 last:border-b-0 ${
                          selectedMatchId === match.match_id 
                            ? "bg-forest-green text-white" 
                            : "text-forest-green hover:bg-forest-green/5"
                        }`}
                      >
                        <span className="block font-mono text-[8px] opacity-75 uppercase tracking-wider">
                          {match.stage}
                        </span>
                        <span className="block mt-0.5 truncate">{match.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
