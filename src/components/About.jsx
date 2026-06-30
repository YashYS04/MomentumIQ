import React, { useState } from "react";
import { 
  Award, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  HeartPulse, 
  Sparkles, 
  Database, 
  Compass, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  ArrowRight,
  TrendingUp
} from "lucide-react";

function About() {
  const [activeTab, setActiveTab] = useState("story");

  // Custom preview graphics generator based on active feature tab
  const renderFeaturePreview = () => {
    switch (activeTab) {
      case "story":
        return (
          <div className="relative w-full h-44 bg-[#0D2C1E]/95 border border-border-warm rounded-2xl p-4 overflow-hidden flex flex-col justify-between shadow-inner transition-all duration-300">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="font-mono text-[8px] text-gold-accent font-bold uppercase tracking-widest">Chapter III — The Turning Point</span>
              <span className="font-mono text-[8px] text-white/40">Min 64'</span>
            </div>
            <div className="flex gap-3 items-start flex-grow pt-3.5">
              <span className="font-serif text-3xl font-extrabold text-gold-accent leading-none bg-white/5 border border-gold-accent/20 px-3.5 py-2.5 rounded-xl">A</span>
              <div className="flex flex-col gap-2 flex-grow">
                <div className="h-2 w-11/12 bg-white/20 rounded"></div>
                <div className="h-2 w-10/12 bg-white/15 rounded"></div>
                <div className="h-2 w-7/12 bg-white/10 rounded"></div>
              </div>
            </div>
            <div className="flex gap-1.5 justify-end items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-accent animate-ping"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-gold-accent"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-white/20"></span>
            </div>
          </div>
        );
      case "var":
        return (
          <div className="relative w-full h-44 bg-[#0D2C1E]/95 border border-border-warm rounded-2xl overflow-hidden flex items-center justify-center shadow-inner transition-all duration-300">
            {/* Goal Line pitch markings */}
            <div className="absolute inset-y-0 left-[35%] w-[2px] bg-white/25"></div>
            <div className="absolute inset-y-0 left-[35%] right-0 bg-[#0A2216]/50"></div>
            {/* Soccer Ball */}
            <div className="absolute left-[31.5%] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-700 shadow-md flex items-center justify-center">
              <div className="w-7 h-7 rounded-full border border-dashed border-slate-400"></div>
            </div>
            {/* Zoom Loupe Circle */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-gold-accent bg-[#FAF8F5]/95 shadow-xl overflow-hidden flex flex-col items-center justify-center">
              {/* Magnified line view */}
              <div className="absolute left-1/4 h-full w-[2px] bg-forest-green/20"></div>
              <div className="absolute left-1/4 h-full w-[4px] bg-gold-accent/40 -translate-x-1/2"></div>
              {/* Magnified ball */}
              <div className="w-12 h-12 rounded-full bg-white border border-slate-400 shadow flex items-center justify-center translate-x-2">
                <span className="text-[7px] font-mono font-bold text-forest-green">1.8mm</span>
              </div>
              <div className="absolute bottom-1.5 text-[6.5px] font-mono font-bold text-gold-accent uppercase tracking-widest">5x Zoom</div>
            </div>
          </div>
        );
      case "companion":
        return (
          <div className="relative w-full h-44 bg-[#0A2216] border border-border-warm rounded-2xl overflow-hidden shadow-inner flex items-center justify-center transition-all duration-300">
            {/* Mini Turf field markings */}
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/10"></div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/5"></div>
            {/* Player 1 */}
            <div className="absolute left-1/4 top-1/3 w-7 h-7 rounded-full bg-forest-green border border-gold-accent flex items-center justify-center text-white text-[9px] font-bold shadow-md">
              10
            </div>
            {/* Player 2 */}
            <div className="absolute right-1/4 top-[55%] w-7 h-7 rounded-full bg-white border border-border-warm flex items-center justify-center text-forest-green text-[9px] font-bold shadow-md">
              4
            </div>
            {/* Ball */}
            <div className="absolute left-[40%] top-1/2 w-2.5 h-2.5 rounded-full bg-gold-accent shadow-sm animate-pulse"></div>
            {/* Vector arrow SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 68 58 Q 110 85 142 80" fill="none" stroke="#C29F5C" strokeWidth="1" strokeDasharray="3,3" />
            </svg>
            <div className="absolute bottom-2 left-3 bg-[#FAF8F5]/10 border border-white/10 rounded px-1.5 py-0.5 text-[6.5px] font-mono text-white/70 uppercase">
              X: 48.0% Y: 65.0%
            </div>
          </div>
        );
      case "momentum":
        return (
          <div className="relative w-full h-44 bg-[#0D2C1E]/95 border border-border-warm rounded-2xl p-4 overflow-hidden flex flex-col justify-between shadow-inner transition-all duration-300">
            <div className="flex justify-between text-[7px] text-white/40 font-mono tracking-wider">
              <span>ARGENTINA</span>
              <span>FRANCE</span>
            </div>
            {/* Rollercoaster curve */}
            <div className="relative w-full h-16 flex items-center">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
                <path d="M 0 18 Q 15 5 25 8 T 50 15 T 75 25 T 100 10" fill="none" stroke="#C29F5C" strokeWidth="1.5" />
                <circle cx="25" cy="8" r="3.5" fill="#FFFFFF" stroke="#0D2C1E" strokeWidth="0.5" className="animate-ping" />
                <circle cx="25" cy="8" r="1.8" fill="#C29F5C" />
              </svg>
              {/* Tooltip mockup */}
              <div className="absolute left-[29%] top-[-8px] bg-white border border-border-warm rounded px-2 py-1 shadow-md flex flex-col gap-0.5 pointer-events-none animate-bounce">
                <span className="text-[6.5px] font-bold text-forest-green font-mono">Min 23' ⚽</span>
                <span className="text-[5.5px] text-slate-500 leading-none">Messi Penalty</span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gold-accent w-2/3"></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-12 py-6 max-w-5xl mx-auto animate-fade-in text-forest-green">
      
      {/* Editorial Header */}
      <section className="text-center max-w-3xl mx-auto flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 bg-forest-green/5 border border-forest-green/10 rounded-full px-4 py-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-accent animate-pulse"></span>
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest">Our Mission & Architecture</span>
        </div>
        
        <h1 className="font-serif font-black text-4xl md:text-5xl leading-tight">
          About Momentum<span className="text-gold-accent font-extrabold italic font-sans animate-pulse">IQ</span>
        </h1>
        
        <p className="text-forest-green-muted font-serif italic text-lg tracking-wide">
          "Explaining Football, Intelligently."
        </p>
        
        <div className="w-12 h-[1px] bg-gold-accent/40 my-2"></div>
        
        <p className="text-forest-green-muted text-sm leading-relaxed max-w-2xl">
          Most sports platforms tell you <strong>what</strong> happened during a match (raw scorelines and basic possession percentages). 
          MomentumIQ answers <strong>why</strong> it happened, using state-of-the-art machine learning models, semantic rule grounding, 
          and story-driven AI explanations to help fans understand football beyond the scoreboard.
        </p>
      </section>

      {/* Mission & Vision Section (Editorial Split) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-border-warm py-10">
        <div className="flex flex-col gap-3.5 pr-0 md:pr-6 border-r-0 md:border-r border-border-warm">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-gold-accent">I.</span>
            <h2 className="font-serif font-black text-xl md:text-2xl">Our Mission</h2>
          </div>
          <span className="font-mono text-[10px] text-gold-accent uppercase font-bold tracking-wider">Demystifying tactical complexity</span>
          <p className="text-forest-green-muted text-xs leading-relaxed">
            We believe statistics are only half the story. MomentumIQ was born out of a desire to translate cold, numerical sports event data into rich, intuitive human-centered narratives. By leveraging explainable AI, we bridge the gap between complex tactical geometry and the pure joy of the game, creating reports that fans can trust, learn from, and easily digest.
          </p>
        </div>

        <div className="flex flex-col gap-3.5 pl-0 md:pl-6">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-gold-accent">II.</span>
            <h2 className="font-serif font-black text-xl md:text-2xl">Our Vision</h2>
          </div>
          <span className="font-mono text-[10px] text-gold-accent uppercase font-bold tracking-wider">Democratizing advanced telemetry</span>
          <p className="text-forest-green-muted text-xs leading-relaxed">
            Advanced sports analysis has long been locked behind institutional paywalls and private club suites. We envision a future where high-fidelity spatial telemetry, expected completion rates, and cognitive fatigue models are accessible to every fan, journalist, and grassroots coach at global scale—running completely locally on standard devices.
          </p>
        </div>
      </section>

      {/* Interactive Features Explorer */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h2 className="font-display font-extrabold text-sm uppercase tracking-wider">Interactive Feature Explorer</h2>
          <p className="text-forest-green-muted text-xs">Click through the tabs below to explore what MomentumIQ does and see its visual models.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          {/* Tab Selector Sidebar */}
          <div className="lg:col-span-2 flex flex-row lg:flex-col gap-2.5 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0">
            {[
              { id: "story", label: "AI Match Story", desc: "Chronological narrative chapters.", icon: BookOpen },
              { id: "var", label: "VAR Rules explainer", desc: "Grounded referee rule verification.", icon: ShieldCheck },
              { id: "companion", label: "Tactical Whiteboard", desc: "Coordinates-based AI analysis.", icon: Layers },
              { id: "momentum", label: "Momentum Intensity", desc: "Interactive game flow curves.", icon: Activity }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-grow lg:flex-grow-0 flex items-center gap-3.5 p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-forest-green text-white border-forest-green shadow-md scale-[1.02]"
                      : "bg-bg-card-light hover:bg-bg-cream/40 border-border-warm text-forest-green hover:border-gold-accent/30"
                  }`}
                  style={{ minWidth: "180px" }}
                >
                  <div className={`p-2 rounded-lg ${activeTab === tab.id ? "bg-white/10" : "bg-bg-ivory border border-border-warm"}`}>
                    <TabIcon size={16} className={activeTab === tab.id ? "text-white" : "text-forest-green"} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider">{tab.label}</span>
                    <span className={`text-[9px] ${activeTab === tab.id ? "text-white/60" : "text-forest-green-muted"} mt-0.5`}>{tab.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display card */}
          <div className="lg:col-span-3 bg-bg-card-light border border-border-warm rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center">
            <div className="flex flex-col gap-4 flex-grow md:w-3/5">
              {activeTab === "story" && (
                <>
                  <span className="font-mono text-[9px] font-bold text-gold-accent uppercase tracking-widest">Feature Highlight</span>
                  <h3 className="font-serif font-black text-2xl">AI Match Story Engine</h3>
                  <p className="text-forest-green-muted text-xs leading-relaxed">
                    MomentumIQ converts thousands of match event vectors into structured, book-like narrative chapters. Drop-cap paragraphs, chronological milestone logs, and dual tactical pitches help you read the match story as a football chronicle rather than a dull list of actions.
                  </p>
                </>
              )}
              {activeTab === "var" && (
                <>
                  <span className="font-mono text-[9px] font-bold text-gold-accent uppercase tracking-widest">Feature Highlight</span>
                  <h3 className="font-serif font-black text-2xl">VAR & IFAB Laws Explainer</h3>
                  <p className="text-forest-green-muted text-xs leading-relaxed">
                    Our referee assistant explains controversial rules (like offsides, goal-line checks, and deflections). It reads official IFAB PDF law files, provides fan-friendly analogies, outputs SpeechSynthesis narration, and magnifies incident frames at 5x zoom.
                  </p>
                </>
              )}
              {activeTab === "companion" && (
                <>
                  <span className="font-mono text-[9px] font-bold text-gold-accent uppercase tracking-widest">Feature Highlight</span>
                  <h3 className="font-serif font-black text-2xl">AI Tactical Whiteboard</h3>
                  <p className="text-forest-green-muted text-xs leading-relaxed">
                    A fully interactive 11-a-side pitch board supporting custom squad presets. When you drag player tokens on the turf field, the AI Tactical Companion reads their actual grid coordinates and answers your questions based on the visual layout you designed.
                  </p>
                </>
              )}
              {activeTab === "momentum" && (
                <>
                  <span className="font-mono text-[9px] font-bold text-gold-accent uppercase tracking-widest">Feature Highlight</span>
                  <h3 className="font-serif font-black text-2xl">Momentum rollercoaster Graph</h3>
                  <p className="text-forest-green-muted text-xs leading-relaxed">
                    An interactive dominance infographic curve that visualizes the flow of control over the match timeline. Moving your mouse reveals a tracking guide and a floating tooltip summarizing control scores, events, and AI breakdowns for every minute.
                  </p>
                </>
              )}
              <div className="flex gap-2">
                <span className="h-1 bg-gold-accent/20 rounded-full flex-grow"></span>
                <span className="h-1 bg-gold-accent rounded-full w-6"></span>
              </div>
            </div>
            <div className="w-full md:w-2/5 flex-shrink-0">
              {renderFeaturePreview()}
            </div>
          </div>
        </div>
      </section>

      {/* AI Capabilities (RAG Pipeline Diagram) */}
      <section className="flex flex-col gap-6 bg-bg-card-light border border-border-warm rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-1 border-b border-border-warm pb-4">
          <h3 className="font-display font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
            <Cpu size={18} className="text-gold-accent animate-spin" style={{ animationDuration: "3s" }} /> AI Core Architecture: Explainable RAG
          </h3>
          <p className="text-forest-green-muted text-xs">How MomentumIQ transforms match telemetry logs into human-centered explanations.</p>
        </div>

        {/* CSS/SVG Flowchart */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-stretch relative">
          {[
            { step: "1", title: "Telemetry logs", desc: "StatsBomb coordinates & event vectors.", icon: Database },
            { step: "2", title: "Context RAG", desc: "IFAB Laws scanned by IBM Docling.", icon: ShieldCheck },
            { step: "3", title: "LangFlow", desc: "Dynamic prompt template building.", icon: Compass },
            { step: "4", title: "Granite LLM", desc: "Granite 3.3 2B local text processing.", icon: Cpu },
            { step: "5", title: "Explainable AI", desc: "Confidence score & reasoning paths.", icon: Sparkles }
          ].map((node, index) => {
            const NodeIcon = node.icon;
            return (
              <div key={node.step} className="relative flex flex-col gap-2.5 p-4 bg-bg-cream/25 border border-border-warm rounded-xl shadow-inner text-center items-center justify-between">
                {/* Connector Arrow for desktop */}
                {index < 4 && (
                  <div className="hidden sm:block absolute right-[-10px] top-1/2 -translate-y-1/2 z-10 text-gold-accent animate-pulse">
                    <ArrowRight size={14} />
                  </div>
                )}
                <div className="w-8 h-8 rounded-full bg-forest-green text-white font-mono text-xs font-black flex items-center justify-center shadow-sm">
                  {node.step}
                </div>
                <NodeIcon size={20} className="text-gold-accent mt-1" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide">{node.title}</span>
                  <span className="text-[8.5px] text-forest-green-muted leading-tight mt-1">{node.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Machine Learning Models */}
      <section className="bg-bg-card-light border border-border-warm rounded-2xl p-6 shadow-sm flex flex-col gap-6">
        <h3 className="font-display font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
          <Award size={18} className="text-gold-accent" /> Machine Learning Models
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2 border-l-2 border-l-gold-accent pl-4">
            <h4 className="font-mono text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp size={12} className="text-gold-accent" /> Momentum Model
            </h4>
            <p className="text-forest-green-muted text-[11px] leading-relaxed">
              Predicts live match control and dominance curves based on final-third entries, positional turnovers, and passing vectors.
            </p>
          </div>
          
          <div className="flex flex-col gap-2 border-l-2 border-l-gold-accent pl-4">
            <h4 className="font-mono text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <HeartPulse size={12} className="text-gold-accent" /> Fatigue Model
            </h4>
            <p className="text-forest-green-muted text-[11px] leading-relaxed">
              Identifies physical exhaustion rates using sprint frequency, positional decay, and 1v1 duel success drop-offs.
            </p>
          </div>

          <div className="flex flex-col gap-2 border-l-2 border-l-gold-accent pl-4">
            <h4 className="font-mono text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <Compass size={12} className="text-gold-accent" /> Tactical Shift Model
            </h4>
            <p className="text-forest-green-muted text-[11px] leading-relaxed">
              Maps positional average locations and overload channels to identify changes in block height and tactical adaptation.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}

export default About;
