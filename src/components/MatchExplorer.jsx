import React, { useState } from "react";
import { Globe, Calendar, ChevronRight, Trophy, Star, Settings, Award, Radio, CheckCircle2, ChevronDown } from "lucide-react";

// Score data and details for indexed matches to populate the Sofascore-style cards
const MATCH_DETAILS = {
  "3869685": { scoreA: "3", scoreB: "3", detailsA: "Messi 23'(P), 108', Di Maria 36'", detailsB: "Mbappe 80'(P), 81', 118'(P)", penalty: "FT (Pen 4-2)", status: "AET", xp: "83.4%" },
  "3857300": { scoreA: "1", scoreB: "2", detailsA: "Messi 10'(P)", detailsB: "Al-Shehri 48', Al-Dawsari 53'", penalty: "", status: "FT", xp: "79.1%" },
  "3869420": { scoreA: "1", scoreB: "1", detailsA: "Petkovic 117'", detailsB: "Neymar 105+1'", penalty: "FT (Pen 4-2)", status: "AET", xp: "81.8%" },
  "3857255": { scoreA: "2", scoreB: "1", detailsA: "Doan 48', Tanaka 51'", detailsB: "Morata 12'", penalty: "", status: "FT", xp: "74.6%" }
};

function MatchExplorer({ matches, selectedMatchId, onSelectMatch }) {
  const [selectedLeague, setSelectedLeague] = useState("wc"); // wc, ucl, pl
  const [selectedSeason, setSelectedSeason] = useState("2022"); // 2022, 2018, 2014, 2026
  const [active2026Tab, setActive2026Tab] = useState("completed"); // live, upcoming, completed
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);

  const seasonLabels = {
    "2022": "Winter 2022",
    "2026": "Summer 2026 (Live API)",
    "2018": "Summer 2018 (Archive)",
    "2014": "Summer 2014 (Archive)"
  };
  const selectedSeasonLabel = seasonLabels[selectedSeason] || selectedSeason;

  // Group matches by stage for an organized list
  const stages = [...new Set(matches.filter(m => !m.is_2026).map(m => m.stage))];

  return (
    <div className="flex flex-col gap-6 py-4 max-w-7xl mx-auto animate-fade-in text-forest-green">
      
      {/* Editorial Header */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs">
          <Globe size={13} className="text-gold-accent" />
          <span className="font-mono font-bold uppercase tracking-wider">Football League Database</span>
        </div>
        <h1 className="font-serif font-black text-3xl leading-tight">Match Explorer</h1>
        <p className="text-forest-green-muted text-xs leading-relaxed max-w-2xl font-medium">
          Browse fixtures across available football competitions. Select a match card to load its AI-generated stories, momentum analysis charts, and VAR deconstruction dashboards.
        </p>
      </section>

      {/* Two Column Layout (Left: Sidebar, Right: Match list) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Column: Competitions Sidebar & Seasons */}
        <div className="lg:col-span-1 bg-bg-card-light border border-border-warm rounded-2xl p-5 shadow-sm flex flex-col gap-5">
          {/* Season Select */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Calendar size={10} className="text-gold-accent" /> Select Season
            </span>
            <div className="relative">
              <button 
                onClick={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
                className="w-full flex items-center justify-between bg-bg-ivory border border-border-warm text-forest-green text-xs font-bold rounded-lg px-3 py-2.5 hover:border-gold-accent/40 transition-all cursor-pointer select-none"
              >
                <span>{selectedSeasonLabel}</span>
                <ChevronDown size={10} className={`ml-2 text-forest-green-muted transition-transform duration-200 ${seasonDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              
              {seasonDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40 cursor-default" onClick={() => setSeasonDropdownOpen(false)} />
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-border-warm rounded-xl shadow-lg z-50 py-1 overflow-hidden animate-fade-in">
                    {[
                      { value: "2022", label: "Winter 2022" },
                      { value: "2026", label: "Summer 2026 (Live API)" },
                      { value: "2018", label: "Summer 2018 (Archive)" },
                      { value: "2014", label: "Summer 2014 (Archive)" }
                    ].map((season) => (
                      <button
                        key={season.value}
                        onClick={() => {
                          setSelectedSeason(season.value);
                          setSeasonDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-all ${
                          selectedSeason === season.value 
                            ? "bg-forest-green text-white" 
                            : "text-forest-green hover:bg-forest-green/5"
                        }`}
                      >
                        {season.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="w-full h-[1px] bg-border-warm"></div>

          {/* Leagues List */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Competitions</span>
            
            <div className="flex flex-col gap-1.5">
              <button 
                onClick={() => setSelectedLeague("wc")}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                  selectedLeague === "wc" 
                    ? "bg-forest-green text-white shadow-sm" 
                    : "text-forest-green-muted hover:bg-forest-green/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Trophy size={14} className={selectedLeague === "wc" ? "text-gold-accent" : "text-forest-green-muted"} />
                  <span>FIFA World Cup</span>
                </div>
                {selectedLeague === "wc" && <span className="w-1.5 h-1.5 rounded-full bg-gold-accent animate-pulse"></span>}
              </button>

              <button 
                onClick={() => {}} 
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-slate-400 opacity-60 text-left cursor-not-allowed"
                disabled
              >
                <div className="flex items-center gap-2">
                  <Trophy size={14} />
                  <span>Champions League</span>
                </div>
                <span className="text-[7.5px] font-mono border border-slate-300 px-1 rounded uppercase">Soon</span>
              </button>

              <button 
                onClick={() => {}} 
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-slate-400 opacity-60 text-left cursor-not-allowed"
                disabled
              >
                <div className="flex items-center gap-2">
                  <Trophy size={14} />
                  <span>Premier League</span>
                </div>
                <span className="text-[7.5px] font-mono border border-slate-300 px-1 rounded uppercase">Soon</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Fixtures list grouped by Stage */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {selectedSeason === "2026" ? (
            <div className="flex flex-col gap-5">
              {/* 2026 Filter sub-tabs */}
              <div className="flex bg-bg-card-light border border-border-warm p-1 rounded-xl w-full sm:w-auto self-start shadow-sm z-10">
                <button 
                  onClick={() => setActive2026Tab("live")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                    active2026Tab === "live" 
                      ? "bg-forest-green text-white shadow-sm border border-forest-green" 
                      : "text-forest-green-muted hover:text-forest-green hover:bg-forest-green/5"
                  }`}
                  style={{ minHeight: "38px" }}
                >
                  <Radio size={13} className={active2026Tab === "live" ? "animate-pulse" : ""} />
                  Live Matches
                </button>
                <button 
                  onClick={() => setActive2026Tab("upcoming")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                    active2026Tab === "upcoming" 
                      ? "bg-forest-green text-white shadow-sm border border-forest-green" 
                      : "text-forest-green-muted hover:text-forest-green hover:bg-forest-green/5"
                  }`}
                  style={{ minHeight: "38px" }}
                >
                  <Calendar size={13} />
                  Upcoming Matches
                </button>
                <button 
                  onClick={() => setActive2026Tab("completed")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                    active2026Tab === "completed" 
                      ? "bg-forest-green text-white shadow-sm border border-forest-green" 
                      : "text-forest-green-muted hover:text-forest-green hover:bg-forest-green/5"
                  }`}
                  style={{ minHeight: "38px" }}
                >
                  <CheckCircle2 size={13} />
                  Completed Matches
                </button>
              </div>

              {/* 2026 List View */}
              <div className="flex flex-col gap-3.5">
                {(() => {
                  const matches2026 = matches.filter(m => m.is_2026);
                  let filtered = [];
                  if (active2026Tab === "live") {
                    filtered = matches2026.filter(m => !m.finished && m.time_elapsed !== "notstarted");
                  } else if (active2026Tab === "upcoming") {
                    filtered = matches2026.filter(m => !m.finished && m.time_elapsed === "notstarted");
                  } else {
                    filtered = matches2026.filter(m => m.finished);
                  }

                  if (filtered.length === 0) {
                    return (
                      <div className="bg-bg-card-light border border-border-warm rounded-2xl p-12 text-center flex flex-col items-center gap-3 shadow-sm">
                        <Trophy size={32} className="text-slate-300" />
                        <h4 className="font-display font-extrabold text-xs uppercase tracking-wider text-forest-green-muted">No matches active in this category</h4>
                      </div>
                    );
                  }

                  return filtered.map((match) => {
                    const isSelected = match.match_id === selectedMatchId;
                    const [teamA, teamB] = match.name.split(" vs ");
                    const isUpcoming = active2026Tab === "upcoming";
                    const isLive = active2026Tab === "live";

                    return (
                      <div 
                        key={match.match_id}
                        onClick={() => {
                          if (!isUpcoming) {
                            onSelectMatch(match.match_id);
                          }
                        }}
                        className={`bg-bg-card-light border rounded-xl p-5 hover:shadow-md cursor-pointer transition-all duration-300 hover:border-gold-accent/40 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 relative overflow-hidden ${
                          isSelected ? "border-gold-accent bg-bg-cream/10" : "border-border-warm"
                        } ${isUpcoming ? "cursor-default opacity-85 hover:border-border-warm" : ""}`}
                      >
                        {isSelected && (
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-gold-accent"></div>
                        )}

                        {/* Left: Teams and Scorers */}
                        <div className="flex-grow flex flex-col gap-2.5">
                          <div className="flex items-center gap-6">
                            {/* Teams */}
                            <div className="flex flex-col gap-2 min-w-[160px] sm:min-w-[200px]">
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-forest-green border border-gold-accent/20 flex items-center justify-center text-white font-display font-black text-[9px] shadow-sm">
                                  {teamA[0]}
                                </div>
                                <span className="text-xs font-bold text-forest-green">{teamA}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-bg-cream border border-border-warm flex items-center justify-center text-forest-green font-display font-black text-[9px] shadow-sm">
                                  {teamB[0]}
                                </div>
                                <span className="text-xs font-bold text-forest-green">{teamB}</span>
                              </div>
                            </div>

                            {/* Scores */}
                            {!isUpcoming && (
                              <div className="flex flex-col gap-2 font-serif font-black text-sm text-forest-green text-center min-w-[20px]">
                                <span>{match.home_score}</span>
                                <span>{match.away_score}</span>
                              </div>
                            )}

                            {/* Divider */}
                            {!isUpcoming && <div className="h-9 w-[1px] bg-border-warm hidden sm:block"></div>}

                            {/* Scorers */}
                            {!isUpcoming && (
                              <div className="flex-grow flex flex-col gap-2 text-[10px] text-forest-green-muted font-medium max-w-[280px]">
                                <span className="truncate">{match.home_scorers.join(", ") || "-"}</span>
                                <span className="truncate">{match.away_scorers.join(", ") || "-"}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Status and Action */}
                        <div className="flex sm:flex-col justify-between sm:justify-center items-end sm:items-end border-t sm:border-t-0 border-border-warm pt-3 sm:pt-0 gap-2 min-w-[130px]">
                          {/* Status label */}
                          <div className="flex items-center gap-1.5">
                            {isLive ? (
                              <span className="bg-accent-red/10 border border-accent-red/20 text-accent-red font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-accent-red animate-ping"></span>
                                LIVE {match.time_elapsed}
                              </span>
                            ) : isUpcoming ? (
                              <span className="text-[10px] font-mono text-gold-accent font-bold uppercase flex items-center gap-1">
                                <Calendar size={10} /> UPCOMING
                              </span>
                            ) : (
                                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">FT</span>
                              )}
                          </div>

                          {/* Date */}
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span className="text-slate-400 font-mono">Kickoff:</span>
                            <span className="font-mono font-bold text-forest-green">{match.local_date}</span>
                          </div>

                          {/* Explore link */}
                          {!isUpcoming && (
                            <span className="flex items-center gap-1 text-[10px] font-extrabold text-forest-green hover:text-gold-accent transition-all uppercase tracking-wider mt-1">
                              View AI story <ChevronRight size={12} className="text-forest-green-muted" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          ) : selectedSeason !== "2022" ? (
            <div className="bg-bg-card-light border border-border-warm rounded-2xl p-12 text-center flex flex-col items-center gap-3.5 shadow-sm">
              <Trophy size={36} className="text-slate-300" />
              <div className="flex flex-col gap-1">
                <h3 className="font-display font-extrabold text-sm uppercase tracking-wide text-forest-green">Historical Archive Mode</h3>
                <p className="text-forest-green-muted text-xs max-w-md mx-auto leading-relaxed">
                  Matches from the {selectedSeason} season are currently archived. Select the **Winter 2022** season in the sidebar to browse active, interactive matches.
                </p>
              </div>
            </div>
          ) : (
            stages.map((stage) => {
              const stageMatches = matches.filter(m => m.stage === stage);
              return (
                <div key={stage} className="flex flex-col gap-3">
                  {/* Stage Header */}
                  <div className="flex items-center gap-2 pb-2 border-b border-border-warm">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest-green"></span>
                    <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-forest-green-muted">
                      {stage} matches
                    </h3>
                  </div>
                  
                  {/* Fixtures list */}
                  <div className="flex flex-col gap-3.5">
                    {stageMatches.map((match) => {
                      const isSelected = match.match_id === selectedMatchId;
                      const [teamA, teamB] = match.name.split(" vs ");
                      const details = MATCH_DETAILS[match.match_id] || { scoreA: "-", scoreB: "-", penalty: "", status: "FT", xp: "80%" };
                      
                      return (
                        <div 
                          key={match.match_id}
                          onClick={() => onSelectMatch(match.match_id)}
                          className={`bg-bg-card-light border rounded-xl p-5 hover:shadow-md cursor-pointer transition-all duration-300 hover:border-gold-accent/40 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 relative overflow-hidden ${
                            isSelected ? "border-gold-accent bg-bg-cream/10" : "border-border-warm"
                          }`}
                        >
                          {/* Selection indicator line */}
                          {isSelected && (
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-gold-accent"></div>
                          )}

                          {/* Left: Teams, scoreline, and scorers details */}
                          <div className="flex-grow flex flex-col gap-2.5">
                            {/* Score Row */}
                            <div className="flex items-center gap-6">
                              {/* Teams lockup */}
                              <div className="flex flex-col gap-2 min-w-[160px] sm:min-w-[200px]">
                                <div className="flex items-center gap-3">
                                  <div className="w-5 h-5 rounded-full bg-forest-green border border-gold-accent/20 flex items-center justify-center text-white font-display font-black text-[9px] shadow-sm">
                                    {teamA[0]}
                                  </div>
                                  <span className="text-xs font-bold text-forest-green">{teamA}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="w-5 h-5 rounded-full bg-bg-cream border border-border-warm flex items-center justify-center text-forest-green font-display font-black text-[9px] shadow-sm">
                                    {teamB[0]}
                                  </div>
                                  <span className="text-xs font-bold text-forest-green">{teamB}</span>
                                </div>
                              </div>

                              {/* Scores column */}
                              <div className="flex flex-col gap-2 font-serif font-black text-sm text-forest-green text-center min-w-[20px]">
                                <span>{details.scoreA}</span>
                                <span>{details.scoreB}</span>
                              </div>

                              {/* Vertical divider */}
                              <div className="h-9 w-[1px] bg-border-warm hidden sm:block"></div>

                              {/* Scorers / details column */}
                              <div className="flex-grow flex flex-col gap-2 text-[10px] text-forest-green-muted font-medium max-w-[280px]">
                                <span className="truncate">{details.detailsA || "-"}</span>
                                <span className="truncate">{details.detailsB || "-"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Status, Win probability expected stats, and Action link */}
                          <div className="flex sm:flex-col justify-between sm:justify-center items-end sm:items-end border-t sm:border-t-0 border-border-warm pt-3 sm:pt-0 gap-2 min-w-[130px]">
                            {/* Status label */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{details.status}</span>
                              {details.penalty && (
                                <span className="bg-forest-green/5 border border-forest-green/10 text-forest-green font-mono text-[8px] font-extrabold px-1.5 py-0.5 rounded">
                                  {details.penalty.replace("FT ", "")}
                                </span>
                              )}
                            </div>

                            {/* expected pass accuracy model label */}
                            <div className="flex items-center gap-1.5 text-[10px]">
                              <span className="text-slate-400 font-mono">xP Accuracy:</span>
                              <span className="font-mono font-bold text-forest-green">{details.xp}</span>
                            </div>

                            {/* Explore button */}
                            <span className="flex items-center gap-1 text-[10px] font-extrabold text-forest-green hover:text-gold-accent transition-all uppercase tracking-wider mt-1">
                              View story <ChevronRight size={12} className="text-forest-green-muted" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}

export default MatchExplorer;
