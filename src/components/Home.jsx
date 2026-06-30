import React, { useState, useEffect } from "react";
import { Cpu, ShieldCheck, Activity, Award, ArrowRight, Radio, Calendar, CheckCircle2 } from "lucide-react";

function Home({ onEnterArena, onSelectMatch }) {
  const [bulletin, setBulletin] = useState(null);
  const [loadingBulletin, setLoadingBulletin] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/worldcup2026/bulletin")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        setBulletin(data);
        setLoadingBulletin(false);
      })
      .catch((err) => {
        console.error("Failed to load live bulletin:", err);
        setLoadingBulletin(false);
      });
  }, []);

  return (
    <div className="relative flex flex-col gap-16 py-6 md:py-12 overflow-hidden animate-fade-in">
      
      {/* Editorial Cover Header */}
      <section className="flex flex-col items-center text-center max-w-4xl mx-auto z-10 px-4">
        
        {/* Typographic crest badge */}
        <div className="flex items-center gap-2 bg-forest-green/5 border border-forest-green/10 rounded-full px-4 py-1.5 mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-accent animate-pulse"></span>
          <span className="font-mono text-[9px] font-bold text-forest-green uppercase tracking-widest">Football Intelligence Journal</span>
        </div>

        {/* Horizontal Lockup Logo (representing attached user suggestion) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 group transition-transform duration-500 hover:scale-[1.02]">
          {/* Premium Animated SVG Crest matching user logo visual and motion requirements */}
          {/* Premium Logo Crest representing MomentumIQ */}
          <div className="flex-shrink-0 w-[190px] h-[190px] flex items-center justify-center relative animate-pulse-slow">
            <img 
              src="/logo.png" 
              alt="MomentumIQ Logo" 
              className="w-full h-full object-contain select-none"
            />
          </div>

          {/* Right Text Lockup */}
          <div className="flex flex-col text-center sm:text-left">
            <h1 className="text-forest-green font-serif font-black text-5xl md:text-6xl lg:text-7xl tracking-tight leading-none">
              Momentum<span className="text-gold-accent font-extrabold italic font-sans">IQ</span>
            </h1>
            <span className="text-sm md:text-base text-forest-green-muted font-serif italic mt-3 tracking-wide leading-none border-t border-gold-accent/20 pt-3">
              Explaining Football, Intelligently.
            </span>
          </div>
        </div>

        <div className="w-24 h-[1.5px] bg-gold-accent/40 mb-8"></div>

        <p className="text-forest-green-muted font-body text-xs md:text-sm leading-relaxed max-w-2xl mb-8">
          MomentumIQ is a premium football intelligence companion built to translate the physical, 
          tactical, and psychological dynamics of matches into transparent, human-centered narratives. 
          Discover the story, explain tactical shifts, and review decisions grounded by official laws.
        </p>

        {/* Enter Arena button - touch optimized */}
        <button 
          className="inline-flex items-center gap-2.5 bg-forest-green hover:bg-gold-accent text-white hover:text-forest-green font-display font-extrabold text-xs tracking-wider uppercase px-7 py-4.5 rounded-lg shadow-md hover:shadow-gold-accent/20 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:translate-y-0" 
          onClick={onEnterArena}
        >
          Explore Analytical Deck <ArrowRight size={14} />
        </button>
      </section>

      {/* World Cup 2026 Live Bulletin */}
      {bulletin && (
        <section className="max-w-6xl mx-auto w-full px-4 z-10 animate-fade-in">
          <div className="w-full border-b border-border-warm pb-3 mb-6 flex justify-between items-center">
            <h2 className="text-forest-green font-display font-extrabold text-xs tracking-widest uppercase flex items-center gap-2">
              <Radio size={14} className="text-forest-green animate-pulse" /> FIFA World Cup 2026 Live Bulletin
            </h2>
            <span className="font-mono text-[9px] font-bold text-forest-green-muted uppercase tracking-wider bg-forest-green/5 border border-forest-green/10 px-2.5 py-1 rounded-full">
              Live API Feeds
            </span>
          </div>

          {/* Live matches section (only rendered if there are live matches active) */}
          {bulletin.live && bulletin.live.length > 0 && (
            <div className="mb-8">
              <h3 className="text-accent-red font-display font-extrabold text-xs tracking-widest uppercase mb-4 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-accent-red"></span> Live Now
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bulletin.live.map((match) => {
                  const [teamA, teamB] = match.name.split(" vs ");
                  return (
                    <div 
                      key={match.match_id}
                      className="bg-bg-card-light border border-forest-green rounded-2xl p-5 hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col justify-between hover:border-gold-accent/40"
                    >
                      {/* Header Tag */}
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-mono text-[9px] font-bold text-forest-green uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-red animate-ping"></span>
                          <span className="text-accent-red font-extrabold">LIVE • {match.time_elapsed}</span>
                        </span>
                        <span className="text-[8px] font-mono text-slate-400 font-bold uppercase">{match.stage.replace("Stage • ", "")}</span>
                      </div>

                      {/* Score block */}
                      <div className="flex flex-col gap-2 my-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-forest-green">{teamA}</span>
                          <span className="font-serif font-black text-sm text-forest-green">{match.home_score}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-forest-green">{teamB}</span>
                          <span className="font-serif font-black text-sm text-forest-green">{match.away_score}</span>
                        </div>
                      </div>

                      {/* Scorers */}
                      <div className="text-[9px] text-forest-green-muted/80 font-medium py-3 border-t border-border-warm flex flex-col gap-1">
                        {match.home_scorers.length > 0 && (
                          <div className="truncate">⚽ {match.home_scorers.join(", ")}</div>
                        )}
                        {match.away_scorers.length > 0 && (
                          <div className="truncate">⚽ {match.away_scorers.join(", ")}</div>
                        )}
                        {match.home_scorers.length === 0 && match.away_scorers.length === 0 && (
                          <div className="text-slate-400 italic">No goals yet</div>
                        )}
                      </div>

                      {/* Action button */}
                      <button 
                        onClick={() => onSelectMatch && onSelectMatch(match.match_id)}
                        className="w-full mt-3 bg-forest-green hover:bg-gold-accent text-white hover:text-forest-green text-[10px] font-extrabold py-2.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        Analyze Live Play
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming matches section */}
          {bulletin.upcoming && bulletin.upcoming.length > 0 && (
            <div>
              <h3 className="text-gold-accent font-display font-extrabold text-xs tracking-widest uppercase mb-4 flex items-center gap-1.5">
                <Calendar size={13} /> Upcoming Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bulletin.upcoming.map((match) => {
                  const [teamA, teamB] = match.name.split(" vs ");
                  return (
                    <div 
                      key={match.match_id}
                      className="bg-bg-card-light border border-border-warm rounded-2xl p-5 hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:border-gold-accent/40"
                    >
                      {/* Header Tag */}
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-mono text-[9px] font-bold text-gold-accent uppercase flex items-center gap-1">
                          <Calendar size={10} /> UPCOMING
                        </span>
                        <span className="text-[8px] font-mono text-slate-400 font-bold uppercase">{match.stage.replace("Stage • ", "")}</span>
                      </div>

                      {/* Teams block */}
                      <div className="flex flex-col gap-2 my-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-forest-green">{teamA}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-forest-green">{teamB}</span>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="text-[9px] text-forest-green-muted/80 font-bold py-3 border-t border-border-warm flex flex-col gap-1">
                        <div className="text-forest-green uppercase font-mono">Date: {match.local_date}</div>
                        <div className="text-slate-400 font-mono italic">Kickoff schedules pending broadcast</div>
                      </div>

                      {/* Action button */}
                      <button 
                        onClick={() => onSelectMatch && onSelectMatch(match.match_id)}
                        className="w-full mt-3 bg-bg-cream border border-border-warm hover:border-gold-accent/40 text-forest-green text-[10px] font-extrabold py-2.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        Pre-Match Tactical Setup
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* If both live and upcoming lists are empty, show a fallback message */}
          {(!bulletin.live || bulletin.live.length === 0) && (!bulletin.upcoming || bulletin.upcoming.length === 0) && (
            <div className="bg-bg-card-light border border-border-warm rounded-2xl p-12 text-center flex flex-col items-center gap-3.5 shadow-sm">
              <Calendar size={36} className="text-slate-300 animate-pulse" />
              <h3 className="font-display font-extrabold text-sm uppercase tracking-wide text-forest-green">No matches scheduled</h3>
              <p className="text-forest-green-muted text-xs max-w-md mx-auto leading-relaxed">
                There are currently no active live or upcoming matches scheduled for this matchday.
              </p>
            </div>
          )}
        </section>
      )}

      {/* Featured Match Explorer Cards */}
      <section className="max-w-6xl mx-auto w-full px-4 z-10">
        <h2 className="text-forest-green font-display font-extrabold text-xs tracking-widest uppercase mb-6 text-center">
          Featured World Cup Matches
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-bg-card-light border border-border-warm rounded-xl p-5 hover:border-gold-accent/40 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md" onClick={onEnterArena}>
            <span className="font-mono text-[9px] font-bold text-gold-accent uppercase">Final Match</span>
            <h3 className="text-forest-green font-display font-bold text-sm mt-1">Argentina vs France</h3>
            <p className="text-slate-400 text-[11px] mt-2">The greatest final in history. Penalty drama, tactical switches, and Mbappe hat-trick.</p>
          </div>
          
          <div className="bg-bg-card-light border border-border-warm rounded-xl p-5 hover:border-gold-accent/40 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md" onClick={onEnterArena}>
            <span className="font-mono text-[9px] font-bold text-gold-accent uppercase">Group Stage</span>
            <h3 className="text-forest-green font-display font-bold text-sm mt-1">Argentina vs Saudi Arabia</h3>
            <p className="text-slate-400 text-[11px] mt-2">One of the biggest upsets. High defensive line block risk vs midfield turnovers.</p>
          </div>

          <div className="bg-bg-card-light border border-border-warm rounded-xl p-5 hover:border-gold-accent/40 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md" onClick={onEnterArena}>
            <span className="font-mono text-[9px] font-bold text-gold-accent uppercase">Quarter-Final</span>
            <h3 className="text-forest-green font-display font-bold text-sm mt-1">Croatia vs Brazil</h3>
            <p className="text-slate-400 text-[11px] mt-2">Resilience and midfield control tempo. Neymar combination vs shootout pressure.</p>
          </div>

          <div className="bg-bg-card-light border border-border-warm rounded-xl p-5 hover:border-gold-accent/40 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md" onClick={onEnterArena}>
            <span className="font-mono text-[9px] font-bold text-gold-accent uppercase">Group Stage</span>
            <h3 className="text-forest-green font-display font-bold text-sm mt-1">Japan vs Spain</h3>
            <p className="text-slate-400 text-[11px] mt-2">Controversial ball out of play review, high energy pressing triggers vs tiki-taka.</p>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="z-10 px-4">
        <h2 className="text-forest-green font-display font-extrabold text-center text-xs tracking-widest uppercase mb-8">
          Core Analytical Capabilities
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Pillar 1 */}
          <div className="bg-bg-card-light border border-border-warm rounded-2xl p-6 md:p-8 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300 hover:border-gold-accent/30">
            <div className="w-11 h-11 rounded-xl bg-bg-ivory border border-border-warm flex items-center justify-center text-forest-green">
              <Activity size={20} />
            </div>
            <h3 className="text-forest-green font-display font-extrabold text-sm">Match Story & Momentum</h3>
            <p className="text-forest-green-muted text-xs leading-relaxed">
              Narrative chronological timeline cards documenting first half, second half, and turning points. 
              Interactive area charts map team dominance and pressure phases.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-bg-card-light border border-border-warm rounded-2xl p-6 md:p-8 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300 hover:border-gold-accent/30">
            <div className="w-11 h-11 rounded-xl bg-bg-ivory border border-border-warm flex items-center justify-center text-forest-green">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-forest-green font-display font-extrabold text-sm">VAR Deconstructor</h3>
            <p className="text-forest-green-muted text-xs leading-relaxed">
              Explore controversial decisions grounded by official IFAB Laws of the Game. 
              Reviews spatial geometry models and joint skeletal coordinates.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-bg-card-light border border-border-warm rounded-2xl p-6 md:p-8 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300 hover:border-gold-accent/30">
            <div className="w-11 h-11 rounded-xl bg-bg-ivory border border-border-warm flex items-center justify-center text-forest-green">
              <Award size={20} />
            </div>
            <h3 className="text-forest-green font-display font-extrabold text-sm">Player Analytics & Fatigue</h3>
            <p className="text-forest-green-muted text-xs leading-relaxed">
              Scouting database grids detailing player pressure metrics and vertical indicators for sprint decay curves 
              calculated by ML regressions.
            </p>
          </div>
        </div>
      </section>

      {/* Integration Banner */}
      <section className="bg-bg-card-light border border-border-warm rounded-2xl p-6 md:p-8 max-w-6xl mx-auto shadow-sm z-10 mx-4 hover:border-gold-accent/30 transition-all duration-300">
        <div className="flex items-center gap-3 border-b border-border-warm pb-4 mb-4">
          <Cpu size={18} className="text-forest-green" />
          <h3 className="text-forest-green font-display font-extrabold text-sm uppercase tracking-wider">IBM & Open Source Integration</h3>
        </div>
        
        <p className="text-forest-green-muted text-xs leading-relaxed mb-6">
          MomentumIQ leverages advanced semantic parser pipelines and reasoning LLMs to ground RAG insights:
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-bg-ivory border border-border-warm p-3 rounded-xl flex flex-col gap-1 hover:border-gold-accent/30 transition-all">
            <span className="text-forest-green font-mono font-bold text-[10.5px] leading-tight">IBM Granite 3.3 2B</span>
            <span className="text-slate-400 text-[9px]">Local Reasoning Model</span>
          </div>
          <div className="bg-bg-ivory border border-border-warm p-3 rounded-xl flex flex-col gap-1 hover:border-gold-accent/30 transition-all">
            <span className="text-forest-green font-mono font-bold text-[10.5px] leading-tight">IBM Docling</span>
            <span className="text-slate-400 text-[9px]">IFAB Rule Document Parser</span>
          </div>
          <div className="bg-bg-ivory border border-border-warm p-3 rounded-xl flex flex-col gap-1 hover:border-gold-accent/30 transition-all">
            <span className="text-forest-green font-mono font-bold text-[10.5px] leading-tight">LangFlow</span>
            <span className="text-slate-400 text-[9px]">Orchestration Engine</span>
          </div>
          <div className="bg-bg-ivory border border-border-warm p-3 rounded-xl flex flex-col gap-1 hover:border-gold-accent/30 transition-all">
            <span className="text-forest-green font-mono font-bold text-[10.5px] leading-tight">Context Forge</span>
            <span className="text-slate-400 text-[9px]">Local Tool Registry</span>
          </div>
          <div className="bg-bg-ivory border border-border-warm p-3 rounded-xl flex flex-col gap-1 hover:border-gold-accent/30 transition-all">
            <span className="text-forest-green font-mono font-bold text-[10.5px] leading-tight">scikit-learn</span>
            <span className="text-slate-400 text-[9px]">Pass Success ML Engine</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
