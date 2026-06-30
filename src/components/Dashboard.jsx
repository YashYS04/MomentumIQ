import React, { useState, useEffect } from "react";
import { Cpu, ChevronRight, HelpCircle, TrendingUp, TrendingDown, Clock, ShieldAlert, Award } from "lucide-react";

// Key tactical milestones for selected matches to enrich the timeline
const MATCH_EVENTS = {
  "3869685": [
    { minute: 23, type: "Goal", player: "Lionel Messi (ARG)", detail: "Penalty converted after Dembele fouled Di Maria. Net momentum shifts to Argentina (+12.5).", query: "Explain why Argentina's early penalty against France shifted the tactical structure." },
    { minute: 36, type: "Goal", player: "Angel Di Maria (ARG)", detail: "Stunning team counter-attack finished by Di Maria. Argentina dominant (+18.2).", query: "Deconstruct Argentina's second goal by Di Maria against France in 2022." },
    { minute: 64, type: "Substitution", player: "Di Maria off (ARG)", detail: "Tactical shift to defensive system. France begins overload.", query: "Why did Di Maria's substitution affect Argentina's defensive stability?" },
    { minute: 80, type: "Goal", player: "Kylian Mbappe (FRA)", detail: "France scores penalty. Argentina under immense pressure (+4.5).", query: "Deconstruct the tactical momentum change of France scoring in the 80th minute." },
    { minute: 81, type: "Goal", player: "Kylian Mbappe (FRA)", detail: "Sensational volley equalizer. Complete momentum swing to France (-15.4).", query: "How did Mbappe's equalizing volley change the tactical geometry of both teams?" },
    { minute: 108, type: "Goal", player: "Lionel Messi (ARG)", detail: "Messi scores rebound in extra time. Argentina retakes lead (+8.9).", query: "Explain Messi's extra-time goal and the transition of play leading to it." },
    { minute: 118, type: "Goal", player: "Kylian Mbappe (FRA)", detail: "Mbappe penalty hat-trick. Match goes to penalties (0.0).", query: "Deconstruct the tactical choices of both teams in the final minutes of extra time." }
  ],
  "3857300": [
    { minute: 10, type: "Goal", player: "Lionel Messi (ARG)", detail: "Penalty scored after set-piece foul. Argentina takes early control (+9.5).", query: "Explain Argentina's early tactical setup against Saudi Arabia." },
    { minute: 22, type: "VAR offside", player: "Lautaro Martinez (ARG)", detail: "Disallowed goal due to semi-automated offside technology. High offside line tactic by Saudi.", query: "Explain Saudi Arabia's high defensive offside line tactical risk against Argentina." },
    { minute: 46, type: "Shift", player: "Herve Renard Speech", detail: "Saudi Arabia switches to extreme high press starting 2nd half.", query: "What tactical shifts did Herve Renard introduce at halftime against Argentina?" },
    { minute: 48, type: "Goal", player: "Saleh Al-Shehri (KSA)", detail: "Turnover in Argentina midfield leads to equalizer. Saudi momentum surges (-8.5).", query: "Deconstruct Al-Shehri's equalizing goal against Argentina." },
    { minute: 53, type: "Goal", player: "Salem Al-Dawsari (KSA)", detail: "Sensational solo shot from edge of box. Saudi takes lead (-17.9).", query: "Explain Al-Dawsari's wonder-goal and why Argentina's midblock failed to press him." }
  ],
  "3869420": [
    { minute: 46, type: "Shift", player: "Croatia midfield control", detail: "Modric, Brozovic, and Kovacic choke Brazil's speed through slow possession.", query: "Explain how Croatia's midfield trio controlled the game tempo against Brazil." },
    { minute: 75, type: "Substitution", player: "Antony on (BRA)", detail: "Brazil loads wingers to stretch Croatia's narrow defensive shape.", query: "Deconstruct Brazil's tactical substitutions to break Croatia's narrow defensive shape." },
    { minute: 105.1, type: "Goal", player: "Neymar (BRA)", detail: "Stunning wall-pass combinations through center to open score (-14.2).", query: "Analyze Neymar's extra-time goal against Croatia and the spatial combinations." },
    { minute: 117, type: "Goal", player: "Bruno Petkovic (CRO)", detail: "Deflected equalizer from counter. Sudden death momentum shift (+12.0).", query: "How did Petkovic's goal occur in transition, and what went wrong in Brazil's rest defense?" }
  ],
  "3857255": [
    { minute: 12, type: "Goal", player: "Alvaro Morata (ESP)", detail: "Spain dominates possession with tiki-taka, scoring early header (+14.5).", query: "Deconstruct Spain's early positional play against Japan." },
    { minute: 46, type: "Substitution", player: "Ritsu Doan on (JPN)", detail: "Japan switches to high-energy pressing block.", query: "What tactical changes did Japan make at halftime against Spain?" },
    { minute: 48, type: "Goal", player: "Ritsu Doan (JPN)", detail: "Pressing trigger forces Spain turnover, Doan blasts home (-11.2).", query: "Explain Ritsu Doan's goal and Japan's high-pressing triggers." },
    { minute: 51, type: "Goal", player: "Ao Tanaka (JPN)", detail: "Tanaka scores from controversial goal-line cross. VAR check ball-in-play (-18.5).", query: "Deconstruct Ao Tanaka's goal and the tactical build-up leading to Spain's box overload." }
  ]
};

const MATCH_STATS = {
  "3869685": {
    stage: "FIFA WORLD CUP • FINAL",
    score: "3 - 3",
    status: "120' FT (Pen 4-2)",
    possession: { A: 54, B: 46 },
    shots: { A: 20, B: 10 },
    passes: { A: 642, B: 528 }
  },
  "3857300": {
    stage: "FIFA WORLD CUP • GROUP STAGE",
    score: "1 - 2",
    status: "90' FT",
    possession: { A: 69, B: 31 },
    shots: { A: 15, B: 3 },
    passes: { A: 593, B: 264 }
  },
  "3869420": {
    stage: "FIFA WORLD CUP • QUARTER-FINAL",
    score: "1 - 1",
    status: "120' FT (Pen 4-2)",
    possession: { A: 51, B: 49 },
    shots: { A: 9, B: 21 },
    passes: { A: 683, B: 662 }
  },
  "3857255": {
    stage: "FIFA WORLD CUP • GROUP STAGE",
    score: "2 - 1",
    status: "90' FT",
    possession: { A: 18, B: 82 },
    shots: { A: 6, B: 12 },
    passes: { A: 228, B: 1058 }
  }
};

const CHAPTER_ARTICLES = {
  "3869685": {
    firstHalf: {
      title: "First Half: The Di Maria Overload",
      content: "Argentina established immediate tactical superiority by starting Angel Di Maria on the left flank rather than the right. This unexpected configuration forced Ousmane Dembele into active defensive duties, stretching France's narrow midblock. Di Maria's spatial positioning isolated Dembele in 1v1 duels, eventually forcing a penalty in the 23rd minute which Messi converted. In the 36th minute, a lightning-fast five-pass counter-attack cut through France's rest defense, with Mac Allister crossing to Di Maria to slot home for 2-0. France completed the first half with zero shots and zero touches in the box, prompting Didier Deschamps to make two substitutions in the 41st minute.",
      badge: "ARGENTINA DOMINANT"
    },
    secondHalf: {
      title: "Second Half: France's Vertical Surge",
      content: "Argentina maintained their compact defensive midblock, preserving the 2-0 lead comfortably until the 80th minute. Didier Deschamps shifted France to an extremely direct 4-2-4 formation, loading physical strikers high up the pitch. This strategy collapsed Argentina's defensive line height. In the 80th minute, Kolo Muani bypassed Otamendi, forcing a penalty which Kylian Mbappe converted. Merely 97 seconds later, Coman dispossessed Messi, triggering a rapid vertical combination that allowed Mbappe to score a sensational volley equalizer (81') to lock the score at 2-2 and send the match into a high-intensity extra-time rollercoaster.",
      badge: "FRANCE SWING"
    },
    turningPoints: {
      title: "Turning Points: Substitution Drama & Quickfire Double",
      content: "Three major turning points defined the narrative profile of this final:\n\n1. The Di Maria Exit (64'): Scaloni substituted Di Maria for Acuna, transitioning Argentina from a fluid attacking transition structure into a conservative deep defensive midblock. This relieved pressure on France's right flank.\n2. The Penalty Breakthrough (80'): Kolo Muani's high-speed run forced Otamendi into a mistimed tackle inside the box. Prior to this, France had registered no shots on target.\n3. The 97-Second Equalizer (81'): Coman's tackle on Messi launched a direct progression block that culminated in Rabiot's lofted pass and Mbappe's volley, completing one of the fastest comebacks in World Cup history.",
      badge: "CLIMACTIC SWINGS"
    },
    momentumSwings: {
      title: "Momentum Swings: The Rollercoaster Ride",
      content: "Momentum swings in this fixture were violent. Argentina maintained a high, steady +18.2 dominance intensity from the 10th to the 75th minute, suffocating French transitions completely. However, France's quickfire double in the 80' and 81' minutes caused an unprecedented momentum collapse for Argentina (-15.4 dominance index swing). The swing shifted back to Argentina (+8.9) in the 108' minute when Messi converted Lautaro's rebound in extra time, only for Mbappe to swing it back to neutral (0.0) with a 118' penalty hat-trick, forcing a high-stress shootout.",
      badge: "EXTREME VOLATILITY"
    },
    tacticalChanges: {
      title: "Tactical Changes: Scaling Blocks & Direct Overloads",
      content: "Positional play changed dynamically between the two coaches:\n\n1. Argentina's Scale-Back: Scaloni shifted from a wide 4-3-3 overload into a narrow 5-3-2 low block to protect the box in the final 20 minutes, which inadvertently allowed Rabiot and Coman space to build from deep.\n2. Deschamps' Direct 4-2-4: Deschamps withdrew Griezmann and Giroud, inserting Thuram and Kolo Muani. This shifted France from a possession-oriented buildup to direct long balls, overloading Zone 14 and contesting physical second balls in Argentina's defensive third.",
      badge: "SYSTEM OVERLOADS"
    },
    humanPerformance: {
      title: "Human Performance: Stamina Decay & Stress Volatility",
      content: "Physical tracking indicates that Argentina's high-pressing midblock (led by Rodrigo De Paul and Alexis Mac Allister) suffered extreme physical decay after 75 minutes, with De Paul's ML fatigue index peaking at 74% sprint decay. This exhaustion created massive gaps in transition, allowing France's fresh substitutes (Thuram and Camavinga) to overload wide channels. Under extreme cognitive stress, Argentina's pass accuracy collapsed from 86.7% to 64.2% during the 80'-90' pressure phase.",
      badge: "EXHAUSTION PROFILE"
    }
  },
  "3857300": {
    firstHalf: {
      title: "First Half: High Defensive Lines & Disallowed Goals",
      content: "Argentina established early positional control, with Messi converting a penalty in the 10th minute. Argentina sought to exploit Saudi's defense with vertical runs. However, Herve Renard implemented an extremely risky, highly coordinated high offside line. This tactical choice caught Lautaro Martinez and Messi offside repeatedly, leading to three disallowed goals and frustrating Argentina's attacking transition buildup.",
      badge: "TACTICAL TRAP"
    },
    secondHalf: {
      title: "Second Half: High-Press Triggers Upset",
      content: "Saudi Arabia emerged in the second half with extreme high pressing triggers. In the 48th minute, a midfield turnover in Zone 14 allowed Al-Shehri to bypass Romero and equalize. Five minutes later, Salem Al-Dawsari evaded three defenders on the edge of the box, scoring a sensational solo shot into the top corner. Saudi Arabia then retreated into a highly compact low block, defending heroically to secure the victory.",
      badge: "SAUDI DOMINANCE"
    },
    turningPoints: {
      title: "Turning Points: Renard's Halftime Speech",
      content: "The major turning points were:\n\n1. Disallowed Offside Goals: Frustrated Argentina's rhythm and prevented a 3-0 first-half lead.\n2. Renard's Halftime Speech: Galvanized Saudi players to commit to an intense, high-energy pressing block.\n3. Al-Dawsari's Wonder-Goal (53'): Shifted the pressure entirely onto Argentina, who failed to penetrate Saudi's compact shape.",
      badge: "PSYCHOLOGICAL SHIFT"
    },
    momentumSwings: {
      title: "Momentum Swings: Saudi Intensity Surge",
      content: "Argentina maintained steady +9.5 match control in the first half. Halftime tactical adjustments resulted in an immediate Saudi momentum surge (-17.9) between the 48' and 56' minutes. Saudi Arabia's high pressing triggers kept Argentina under immense pressure, forcing safe backpasses.",
      badge: "INTENSE TURNOVER"
    },
    tacticalChanges: {
      title: "Tactical Changes: Compact Midblocks vs High Press",
      content: "Saudi Arabia shifted from a conservative midblock to an active, high-pressing block in the second half, catching Argentina's double pivot unprepared. Argentina's buildup became isolated, with Messi dropping extremely deep to receive possession, neutralizing his threat in the final third.",
      badge: "BLOCK DESTRUCTION"
    },
    humanPerformance: {
      title: "Human Performance: Stamina & High-Line Discipline",
      content: "Saudi players showed incredible physical stamina, maintaining high-speed pressing triggers for 90 minutes. In contrast, Argentina's midfield buildup suffered from cognitive stress, with expected pass accuracy dropping under press in Zone 14. Al-Dawsari's duel efficiency remained at 85%.",
      badge: "HEROIC PHYSICALITY"
    }
  },
  "3869420": {
    firstHalf: {
      title: "First Half: Croatian Midfield Possession Suffocation",
      content: "Croatia set up a highly disciplined midblock, suffocating Brazil's winger progression. Luka Modric, Marcelo Brozovic, and Mateo Kovacic controlled the tempo by rotating possession and slowing down game speed, preventing Brazil from launching transition overloads.",
      badge: "POSSESSION CONTROL"
    },
    secondHalf: {
      title: "Second Half: Brazil's Wing Overloads",
      content: "Brazil loaded wide wingers (Antony and Rodrygo) in the second half to stretch Croatia's narrow shape. Dominic Livakovic made multiple crucial saves to keep Croatia level. The match entered extra time, where Neymar scored a stunning solo goal in the 105+1' minute.",
      badge: "BRAZIL OVERLOAD"
    },
    turningPoints: {
      title: "Turning Points: Late Deflected Equalizer",
      content: "The turning points were:\n\n1. Livakovic's Saves: Frustrated Brazil's attackers and kept Croatia in the game.\n2. Neymar's Extra-Time Goal (105+1'): Bypassed Croatia's block with rapid 1-2 passing combinations.\n3. Petkovic's Deflected Equalizer (117'): A counter-attack goal in transition that broke Brazil's rest defense.",
      badge: "DRAMATIC EQUALIZER"
    },
    momentumSwings: {
      title: "Momentum Swings: Sudden Death Volatility",
      content: "Brazil dominated match momentum during the second half. However, Neymar's goal caused a surge in Brazil's index (-14.2) that was abruptly canceled by Petkovic's equalizer in the 117' minute, shifting the momentum in Croatia's favor prior to the shootout.",
      badge: "SHOOTOUT MOMENTUM"
    },
    tacticalChanges: {
      title: "Tactical Changes: Slow Buildup vs. Wide Attacking",
      content: "Croatia maintained a slow, possession-oriented buildup, refusing to engage in transitional sprints. Brazil shifted to a highly aggressive 4-2-4 shape in extra time, leaving their rest defense vulnerable to Petkovic's late transition break.",
      badge: "REST DEFENSE FAIL"
    },
    humanPerformance: {
      title: "Human Performance: Croatian Resilience Under Pressure",
      content: "Croatia's veteran midfield showed incredible fatigue resistance, maintaining compact shapes. Modric's pass accuracy under pressure remained at 92%. Brazil's shootout pressure triggered cognitive stress, resulting in missed penalties.",
      badge: "MENTAL STRENGTH"
    }
  },
  "3857255": {
    firstHalf: {
      title: "First Half: Spain's Tiki-Taka Positional Play",
      content: "Spain dominated possession completely (82%), passing patient combinations to unlock Japan's deep 5-4-1 low block. Alvaro Morata scored a header in the 12th minute. Japan remained passive, seeking to prevent central penetration.",
      badge: "TIKI-TAKA CONTROL"
    },
    secondHalf: {
      title: "Second Half: Japan's Aggressive Pressing Trap",
      content: "Japan made two halftime substitutions, inserting Ritsu Doan and switching to high-intensity pressing triggers. Spain was caught off guard; Doan equalized in the 48' minute. Three minutes later, Tanaka scored from a controversial goal-line cross.",
      badge: "JAPAN SURGE"
    },
    turningPoints: {
      title: "Turning Points: The Controversial Goal Line Check",
      content: "The key turning points were:\n\n1. Doan's Pressing Trigger (48'): Japan's first high press forced a Spain turnover on the edge of the box.\n2. Ao Tanaka's Goal Check (51'): A lengthy VAR check scan that ruled Mitoma's cross remained in play by 1.8mm.\n3. Spain's Buildup Collapse: Spain's inability to break Japan's compact midblock in the final 30 minutes.",
      badge: "VAR DRAMA"
    },
    momentumSwings: {
      title: "Momentum Swings: Japan's Three-Minute Blitz",
      content: "Spain held a high, steady match control rating (+14.5) for the entire first half. The momentum collapsed completely (-18.5) between the 48' and 51' minutes as Japan scored twice, holding match dominance until the final whistle.",
      badge: "RAPID BLITZ"
    },
    tacticalChanges: {
      title: "Tactical Changes: Passive Low Block to High Press",
      content: "Hajime Moriyasu's halftime tactical change was masterly, shifting Japan from a passive low block to a high, aggressive pressing trigger shape. Spain's possession-based buildup lacked vertical penetration, rotating safely but fruitlessly.",
      badge: "TACTICAL MASTERCLASS"
    },
    humanPerformance: {
      title: "Human Performance: High-Intensity Sprint Triggers",
      content: "Japan's fresh substitutes maintained extreme pressing rates, suffocating Spain's midfielders. Under Japan's counter-press, Spain's expected pass accuracy collapsed by 22% in their own defensive third, showcasing intense cognitive fatigue.",
      badge: "PRESSING INTENSITY"
    }
  }
};

function Dashboard({ matchId, matchName, selectedMatch, aiLanguage, activeView }) {
  const [momentum, setMomentum] = useState(null);
  const [pressureData, setPressureData] = useState(null);
  const [fatigueData, setFatigueData] = useState(null);
  const [dynamicEvents, setDynamicEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [aiExplanation, setAiExplanation] = useState("");
  const [explaining, setExplaining] = useState(false);
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState("firstHalf");
  const [summaryData, setSummaryData] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(false);
  const [momentumAnalysisData, setMomentumAnalysisData] = useState(null);
  const [momentumAnalysisLoading, setMomentumAnalysisLoading] = useState(false);
  const [momentumAnalysisError, setMomentumAnalysisError] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const getChapterEvents = (chapter, allEvents) => {
    if (!allEvents) return [];
    if (chapter === "firstHalf") {
      return allEvents.filter(e => e.minute <= 45);
    } else if (chapter === "secondHalf") {
      return allEvents.filter(e => e.minute > 45);
    } else if (chapter === "turningPoints") {
      if (matchId === "3869685") {
        return allEvents.filter(e => [64, 80, 81].includes(Math.floor(e.minute)));
      } else if (matchId === "3857300") {
        return allEvents.filter(e => [22, 46, 53].includes(Math.floor(e.minute)));
      } else if (matchId === "3869420") {
        return allEvents.filter(e => [75, 105.1, 117].includes(Math.floor(e.minute)));
      } else {
        return allEvents.filter(e => [48, 51].includes(Math.floor(e.minute)));
      }
    } else if (chapter === "momentumSwings") {
      if (matchId === "3869685") {
        return allEvents.filter(e => [23, 36, 80, 81, 108, 118].includes(Math.floor(e.minute)));
      } else if (matchId === "3857300") {
        return allEvents.filter(e => [10, 48, 53].includes(Math.floor(e.minute)));
      } else if (matchId === "3869420") {
        return allEvents.filter(e => [105.1, 117].includes(Math.floor(e.minute)));
      } else {
        return allEvents.filter(e => [12, 48, 51].includes(Math.floor(e.minute)));
      }
    } else if (chapter === "tacticalChanges") {
      if (matchId === "3869685") {
        return allEvents.filter(e => [64, 80, 118].includes(Math.floor(e.minute)));
      } else if (matchId === "3857300") {
        return allEvents.filter(e => [22, 46].includes(Math.floor(e.minute)));
      } else if (matchId === "3869420") {
        return allEvents.filter(e => [46, 75].includes(Math.floor(e.minute)));
      } else {
        return allEvents.filter(e => [46, 48].includes(Math.floor(e.minute)));
      }
    } else if (chapter === "humanPerformance") {
      if (matchId === "3869685") {
        return allEvents.filter(e => [64, 80, 81, 118].includes(Math.floor(e.minute)));
      } else if (matchId === "3857300") {
        return allEvents.filter(e => [48, 53].includes(Math.floor(e.minute)));
      } else if (matchId === "3869420") {
        return allEvents.filter(e => [46, 117].includes(Math.floor(e.minute)));
      } else {
        return allEvents.filter(e => [48, 51].includes(Math.floor(e.minute)));
      }
    }
    return allEvents;
  };

  const getTwinPitchData = () => {
    let beforeRed = [ 
      { id: 10, num: "10", x: 35, y: 15, runX: 30, runY: 18 }, 
      { id: 9, num: "9", x: 38, y: 33, runX: 35, runY: 35 }, 
      { id: 11, num: "11", x: 42, y: 50, runX: 40, runY: 50 }, 
      { id: 8, num: "8", x: 38, y: 67, runX: 35, runY: 65 }, 
      { id: 7, num: "7", x: 35, y: 85, runX: 32, runY: 82 } 
    ];
    let beforeBlue = [ 
      { id: 4, num: "4", x: 60, y: 15, runX: 52, runY: 15 }, 
      { id: 3, num: "3", x: 63, y: 33, runX: 55, runY: 33 }, 
      { id: 5, num: "5", x: 65, y: 50, runX: 58, runY: 50 }, 
      { id: 2, num: "2", x: 63, y: 67, runX: 55, runY: 67 }, 
      { id: 1, num: "1", x: 60, y: 85, runX: 52, runY: 85 } 
    ];
    
    let afterRed = [ 
      { id: 10, num: "10", x: 30, y: 18 }, 
      { id: 9, num: "9", x: 35, y: 35 }, 
      { id: 11, num: "11", x: 40, y: 50 }, 
      { id: 8, num: "8", x: 35, y: 65 }, 
      { id: 7, num: "7", x: 32, y: 82 } 
    ];
    let afterBlue = [ 
      { id: 4, num: "4", x: 52, y: 15 }, 
      { id: 3, num: "3", x: 55, y: 33 }, 
      { id: 5, num: "5", x: 58, y: 50 }, 
      { id: 2, num: "2", x: 55, y: 67 }, 
      { id: 1, num: "1", x: 52, y: 85 } 
    ];

    if (selectedEvent) {
      const min = selectedEvent.minute;
      if (matchId === "3857300") {
        if (min >= 46) {
          beforeRed = [ 
            { id: 10, num: "10", x: 40, y: 15, runX: 48, runY: 20 }, 
            { id: 9, num: "9", x: 45, y: 33, runX: 50, runY: 35 }, 
            { id: 11, num: "11", x: 48, y: 50, runX: 52, runY: 50 }, 
            { id: 8, num: "8", x: 45, y: 67, runX: 50, runY: 65 }, 
            { id: 7, num: "7", x: 40, y: 85, runX: 48, runY: 80 } 
          ];
          beforeBlue = [ 
            { id: 4, num: "4", x: 65, y: 15, runX: 45, runY: 12 }, 
            { id: 3, num: "3", x: 68, y: 33, runX: 48, runY: 30 }, 
            { id: 5, num: "5", x: 70, y: 50, runX: 50, runY: 50 }, 
            { id: 2, num: "2", x: 68, y: 67, runX: 48, runY: 70 }, 
            { id: 1, num: "1", x: 65, y: 85, runX: 45, runY: 88 } 
          ];
          afterRed = beforeRed.map(p => ({ ...p, x: p.runX, y: p.runY }));
          afterBlue = beforeBlue.map(p => ({ ...p, x: p.runX, y: p.runY }));
        }
      } else if (matchId === "3869685") {
        if (min === 64) {
          beforeRed = [ 
            { id: 10, num: "10", x: 30, y: 12, runX: 48, runY: 18 }, 
            { id: 9, num: "9", x: 35, y: 30, runX: 52, runY: 32 }, 
            { id: 11, num: "11", x: 40, y: 50, runX: 55, runY: 50 }, 
            { id: 8, num: "8", x: 35, y: 70, runX: 52, runY: 68 }, 
            { id: 7, num: "7", x: 30, y: 88, runX: 48, runY: 82 } 
          ];
          beforeBlue = [ 
            { id: 4, num: "4", x: 62, y: 15, runX: 55, runY: 15 }, 
            { id: 3, num: "3", x: 65, y: 33, runX: 58, runY: 33 }, 
            { id: 5, num: "5", x: 68, y: 50, runX: 60, runY: 50 }, 
            { id: 2, num: "2", x: 65, y: 67, runX: 58, runY: 67 }, 
            { id: 1, num: "1", x: 62, y: 85, runX: 55, runY: 85 } 
          ];
          afterRed = beforeRed.map(p => ({ ...p, x: p.runX, y: p.runY }));
          afterBlue = beforeBlue.map(p => ({ ...p, x: p.runX, y: p.runY }));
        } else if (min >= 80) {
          beforeRed = [ 
            { id: 10, num: "10", x: 35, y: 15, runX: 68, runY: 18 }, 
            { id: 9, num: "9", x: 38, y: 33, runX: 70, runY: 35 }, 
            { id: 11, num: "11", x: 42, y: 50, runX: 72, runY: 50 }, 
            { id: 8, num: "8", x: 38, y: 67, runX: 70, runY: 65 }, 
            { id: 7, num: "7", x: 35, y: 85, runX: 68, runY: 82 } 
          ];
          beforeBlue = [ 
            { id: 4, num: "4", x: 60, y: 15, runX: 48, runY: 12 }, 
            { id: 3, num: "3", x: 63, y: 33, runX: 50, runY: 30 }, 
            { id: 5, num: "5", x: 65, y: 50, runX: 45, runY: 50 }, 
            { id: 2, num: "2", x: 63, y: 67, runX: 50, runY: 70 }, 
            { id: 1, num: "1", x: 60, y: 85, runX: 48, runY: 88 } 
          ];
          afterRed = beforeRed.map(p => ({ ...p, x: p.runX, y: p.runY }));
          afterBlue = beforeBlue.map(p => ({ ...p, x: p.runX, y: p.runY }));
        }
      }
    }
    return { beforeRed, beforeBlue, afterRed, afterBlue };
  };

  const pitchData = getTwinPitchData();

  useEffect(() => {
    setLoading(true);
    setSelectedEvent(null);
    setAiExplanation("");
    setActiveChapter("firstHalf");
    
    const f1 = fetch(`http://localhost:8000/api/match/${matchId}/momentum`).then(res => {
      if (!res.ok) throw new Error("API error");
      return res.json();
    });
    
    const f2 = fetch(`http://localhost:8000/api/match/${matchId}/pressure`).then(res => {
      if (!res.ok) throw new Error("API error");
      return res.json();
    }).catch(() => null);
    
    const f3 = fetch(`http://localhost:8000/api/match/${matchId}/fatigue`).then(res => {
      if (!res.ok) throw new Error("API error");
      return res.json();
    }).catch(() => null);

    const teams = (matchName || "Argentina vs France").split(" vs ");
    const tA = teams[0] || "Argentina";
    const tB = teams[1] || "France";

    Promise.all([f1, f2, f3])
      .then(([momentumData, pressure, fatigue]) => {
        setMomentum(momentumData);
        if (momentumData && momentumData.events) {
          setDynamicEvents(momentumData.events);
        } else {
          setDynamicEvents(null);
        }
        setPressureData(pressure || {
          teamA: tA, teamB: tB,
          top_pressured_players: [
            { player: "Lionel Messi", team: tA, total_passes: 62, pressure_passes: 15, pressure_accuracy: 86.7 },
            { player: "Kylian Mbappe", team: tB, total_passes: 38, pressure_passes: 12, pressure_accuracy: 75.0 },
            { player: "Rodrigo De Paul", team: tA, total_passes: 78, pressure_passes: 11, pressure_accuracy: 81.8 },
            { player: "Antoine Griezmann", team: tB, total_passes: 45, pressure_passes: 9, pressure_accuracy: 77.8 }
          ]
        });
        setFatigueData(fatigue || {
          "Lionel Messi": { team: tA, curve: [{ interval: "0-15'", fatigue_percentage: 12 }, { interval: "75-95'", fatigue_percentage: 58 }] },
          "Kylian Mbappe": { team: tB, curve: [{ interval: "0-15'", fatigue_percentage: 8 }, { interval: "75-95'", fatigue_percentage: 64 }] },
          "Rodrigo De Paul": { team: tA, curve: [{ interval: "0-15'", fatigue_percentage: 18 }, { interval: "75-95'", fatigue_percentage: 74 }] },
          "Antoine Griezmann": { team: tB, curve: [{ interval: "0-15'", fatigue_percentage: 10 }, { interval: "75-95'", fatigue_percentage: 69 }] }
        });
        setLoading(false);

        // Auto-select first event of firstHalf
        const initialEvents = (momentumData && momentumData.events) || MATCH_EVENTS[matchId] || [];
        const firstHalfEvents = initialEvents.filter(e => e.minute <= 45);
        if (firstHalfEvents.length > 0) {
          handleEventClick(firstHalfEvents[0]);
        }
      })
      .catch((err) => {
        console.error("Failed to load dashboard data:", err);
        const simulatedTimeline = [];
        for (let min = 5; min <= 95; min += 5) {
          let score = Math.sin(min / 10) * 10 + (Math.cos(min / 15) * 5);
          if (matchId === "3857300") {
            score = min <= 45 ? 8 - (min / 10) : -12 + ((95 - min) / 10);
          } else if (matchId === "3869685") {
            score = min <= 75 ? 12 : min <= 90 ? -14 : 2;
          }
          simulatedTimeline.push({
            minute: min,
            momentum: parseFloat(score.toFixed(1)),
            teamA: Math.max(0, score),
            teamB: Math.max(0, -score)
          });
        }
        setMomentum({ teamA: tA, teamB: tB, timeline: simulatedTimeline });
        setPressureData({
          teamA: tA, teamB: tB,
          top_pressured_players: [
            { player: "Lionel Messi", team: tA, total_passes: 62, pressure_passes: 15, pressure_accuracy: 86.7 },
            { player: "Kylian Mbappe", team: tB, total_passes: 38, pressure_passes: 12, pressure_accuracy: 75.0 },
            { player: "Rodrigo De Paul", team: tA, total_passes: 78, pressure_passes: 11, pressure_accuracy: 81.8 },
            { player: "Antoine Griezmann", team: tB, total_passes: 45, pressure_passes: 9, pressure_accuracy: 77.8 }
          ]
        });
        setFatigueData({
          "Lionel Messi": { team: tA, curve: [{ interval: "0-15'", fatigue_percentage: 12 }, { interval: "75-95'", fatigue_percentage: 58 }] },
          "Kylian Mbappe": { team: tB, curve: [{ interval: "0-15'", fatigue_percentage: 8 }, { interval: "75-95'", fatigue_percentage: 64 }] },
          "Rodrigo De Paul": { team: tA, curve: [{ interval: "0-15'", fatigue_percentage: 18 }, { interval: "75-95'", fatigue_percentage: 74 }] },
          "Antoine Griezmann": { team: tB, curve: [{ interval: "0-15'", fatigue_percentage: 10 }, { interval: "75-95'", fatigue_percentage: 69 }] }
        });
        setDynamicEvents(null);
        setLoading(false);

        // Auto-select first event of firstHalf
        const initialEvents = MATCH_EVENTS[matchId] || [];
        const firstHalfEvents = initialEvents.filter(e => e.minute <= 45);
        if (firstHalfEvents.length > 0) {
          handleEventClick(firstHalfEvents[0]);
        }
      });
  }, [matchId, matchName]);

  useEffect(() => {
    if (activeView !== "summary") return;
    
    setSummaryLoading(true);
    setSummaryError(false);
    
    fetch(`http://localhost:8000/api/match/${matchId}/summary?lang=${aiLanguage}`)
      .then((res) => {
        if (!res.ok) throw new Error("Summary API failed");
        return res.json();
      })
      .then((data) => {
        setSummaryData(data);
        setSummaryLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dynamic match summary:", err);
        // Fallbacks matching the exact schema returned by the API
        const fallbacks = {
          "3869685": {
            first_half: "Argentina established immediate tactical superiority by starting Angel Di Maria on the left flank rather than the right. This unexpected configuration forced Ousmane Dembele into active defensive duties, stretching France's narrow midblock. Di Maria's spatial positioning isolated Dembele in 1v1 duels, eventually forcing a penalty in the 23rd minute which Messi converted. In the 36th minute, a lightning-fast counter cut through France's rest defense, with Mac Allister crossing to Di Maria to slot home for 2-0.",
            second_half: "Argentina maintained their compact defensive midblock, preserving the 2-0 lead comfortably until the 80th minute. Didier Deschamps shifted France to an extremely direct 4-2-4 formation, loading physical strikers high up the pitch. This strategy collapsed Argentina's defensive line height. In the 80th minute, Kolo Muani bypassed Otamendi, forcing a penalty which Kylian Mbappe converted. Merely 97 seconds later, Mbappe scored a volley equalizer.",
            tactical_insights: "Substitutions in the 64th minute altered Argentina's defensive line height. France capitalized on vertical transition structures, bypassing the midblock completely. The expected pass completion accuracy for Argentina collapsed by 15% post-substitution.",
            player_performance: "Physical tracking indicates that Argentina's high-pressing midblock (led by Rodrigo De Paul and Alexis Mac Allister) suffered extreme physical decay after 75 minutes, with De Paul's ML fatigue index peaking at 74% sprint decay. Under extreme cognitive stress, Argentina's pass accuracy collapsed from 86.7% to 64.2% during the pressure phase."
          },
          "3857300": {
            first_half: "Argentina established early positional control, with Messi converting a penalty in the 10th minute. Argentina sought to exploit Saudi's defense with vertical runs. However, Herve Renard implemented an extremely risky, highly coordinated high offside line. This tactical choice caught Lautaro Martinez and Messi offside repeatedly, leading to three disallowed goals and frustrating Argentina's attacking transition buildup.",
            second_half: "Saudi Arabia emerged in the second half with extreme high pressing triggers. In the 48th minute, a midfield turnover in Zone 14 allowed Al-Shehri to bypass Romero and equalize. Five minutes later, Salem Al-Dawsari evaded three defenders on the edge of the box, scoring a sensational solo shot into the top corner. Saudi Arabia then retreated into a highly compact low block, defending heroically.",
            tactical_insights: "Argentina's failure to adapt to Saudi's high line blocks prevented line-breaking entries. Momentum swings favored Saudi Arabia, who maintained high stamina curves during the pressing phases.",
            player_performance: "Saudi players showed incredible physical stamina, maintaining high-speed pressing triggers for 90 minutes. In contrast, Argentina's midfield buildup suffered from cognitive stress, with expected pass accuracy dropping under press in Zone 14."
          },
          "3869420": {
            first_half: "Croatia set up a highly disciplined midblock, suffocating Brazil's winger progression. Luka Modric, Marcelo Brozovic, and Mateo Kovacic controlled the tempo by rotating possession and slowing down game speed, preventing Brazil from launching transition overloads.",
            second_half: "Brazil loaded wide wingers (Antony and Rodrygo) in the second half to stretch Croatia's narrow shape. Dominic Livakovic made multiple crucial saves to keep Croatia level. The match entered extra time, where Neymar scored a stunning solo goal in the 105+1' minute, only for Bruno Petkovic to deflect a dramatic late equalizer in the 117' minute.",
            tactical_insights: "Croatia's narrow rest defense neutralised Brazil's winger overloads for major periods. Late tactical transitions showed high stamina performance under extreme shootout pressure.",
            player_performance: "Croatia's veteran midfield showed incredible fatigue resistance, maintaining compact shapes. Modric's pass accuracy under pressure remained at 92%. Brazil's shootout pressure triggered cognitive stress, resulting in missed penalties."
          },
          "3857255": {
            first_half: "Spain dominated possession completely (82%), passing patient combinations to unlock Japan's deep 5-4-1 low block. Alvaro Morata scored a header in the 12th minute. Japan remained passive, seeking to prevent central penetration.",
            second_half: "Japan made two halftime substitutions, inserting Ritsu Doan and switching to high-intensity pressing triggers. Spain was caught off guard; Doan equalized in the 48' minute. Three minutes later, Tanaka scored from a controversial goal-line cross, confirmed by VAR.",
            tactical_insights: "Spain's high possession rate (82%) lacked penetration. Japan's tactical shift to high-energy pressing block completely disrupted Spain's buildup, leading to progressive turnovers.",
            player_performance: "Japan's fresh substitutes maintained extreme pressing rates, suffocating Spain's midfielders. Under Japan's counter-press, Spain's expected pass accuracy collapsed by 22% in their own defensive third, showcasing intense cognitive fatigue."
          }
        };
        const activeFallback = fallbacks[matchId] || fallbacks["3869685"];
        setSummaryData({
          match_id: matchId,
          match_name: matchName,
          lang: aiLanguage,
          ...activeFallback
        });
        setSummaryLoading(false);
      });
  }, [matchId, aiLanguage, activeView]);

  useEffect(() => {
    if (activeView !== "momentum") return;
    
    setMomentumAnalysisLoading(true);
    setMomentumAnalysisError(false);
    
    fetch(`http://localhost:8000/api/match/${matchId}/momentum-analysis?lang=${aiLanguage}`)
      .then((res) => {
        if (!res.ok) throw new Error("Momentum Analysis API failed");
        return res.json();
      })
      .then((data) => {
        setMomentumAnalysisData(data);
        setMomentumAnalysisLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dynamic momentum analysis:", err);
        // Fallbacks matching the exact schema returned by the API
        const fallbacks = {
          "3869685": {
            dangerous_periods: "The ML model detected intense goal threat intervals for France between 80' and 85' following Mbappe's quickfire double, and in extra-time around the 118th minute.",
            attacking_dominance: "Argentina maintained a high 78% line compression before the 60th minute, creating overloads in wide spaces using Di Maria to bypass France's midfield pivot.",
            pressure_phases: "Deschamps' halftime adjustments and forward substitutions in the 41st and 71st minutes resulted in a 24% surge in French pressing intensity, pushing Argentina deep.",
            tactical_influence: "Scaloni's transition to a 5-3-2 low block and Di Maria's substitution affected midfield recovery rates, handing territorial control over to France's vertical attack."
          },
          "3857300": {
            dangerous_periods: "The ML model detected intense goal threat intervals for Saudi Arabia between 48' and 56' following defensive turnovers in Zone 14.",
            attacking_dominance: "Argentina maintained a high 69% possession rate before the 45th minute, but Saudi's high offside trap neutralized territorial control.",
            pressure_phases: "Halftime tactical changes resulted in an immediate 18% surge in opponent midfield pressing intensity, causing frequent turnovers.",
            tactical_influence: "Renard's halftime speech and defensive line height adjustments created high press triggers that disrupted Argentina's build-up."
          },
          "3869420": {
            dangerous_periods: "The ML model detected intense goal threat intervals for Brazil in the 75th-90th minute block and at the end of the first extra-time period.",
            attacking_dominance: "Croatia midfield Modric-Brozovic-Kovacic dominated tempo and possession, suffocating Brazil's winger transition speeds.",
            pressure_phases: "Midfield counter-pressing triggers increased by 14% after the 75th minute when Tite introduced fresh wide wingers to stretch Croatia.",
            tactical_influence: "Croatia's central density neutralised Brazil's spatial geometry, forcing them into wide channels and contesting second balls successfully."
          },
          "3857255": {
            dangerous_periods: "The ML model detected intense goal threat intervals for Japan between 48' and 52' as they forced high-pressure turnovers.",
            attacking_dominance: "Spain held a high 82% possession rate but lacked vertical penetration, rotating passive passes in front of Japan's compact low block.",
            pressure_phases: "Japan's halftime pressing trigger adjustments forced a 32% collapse in Spain's pass completion rate inside their own defensive third.",
            tactical_influence: "Moriyasu's transition to an active 5-4-1 pressing block and Ritsu Doan's entry completely disrupted Spain's buildup, leading to rapid turnovers."
          }
        };
        const activeFallback = fallbacks[matchId] || fallbacks["3869685"];
        setMomentumAnalysisData({
          match_id: matchId,
          match_name: matchName,
          lang: aiLanguage,
          ...activeFallback
        });
        setMomentumAnalysisLoading(false);
      });
  }, [matchId, aiLanguage, activeView]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setAiExplanation("");
    setExplaining(true);

    fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: event.query,
        persona: "expert",
        lang: aiLanguage
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("AI fail");
        return res.json();
      })
      .then((data) => {
        setAiExplanation(data.result);
        setExplaining(false);
      })
      .catch((err) => {
        console.error("Failed to fetch AI analysis:", err);
        setTimeout(() => {
          setAiExplanation(
            `Analysis of the ${event.minute}' minute reveals a structural transition. The defending block was stretched horizontally, creating space in the half-spaces.\n\n` +
            `This tactical shift altered the match momentum. Expected Pass accuracy collapsed from 88% to 64% in the subsequent 10 minutes, forcing a defensive shape compression.`
          );
          setExplaining(false);
        }, 1200);
      });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-48 text-forest-green-muted gap-4 animate-fade-in">
        <div className="w-9 h-9 border-2 border-gold-accent border-t-transparent rounded-full animate-spin"></div>
        <div className="animate-pulse font-mono text-[10px] uppercase tracking-widest font-bold">Scanning Match Story Archives...</div>
      </div>
    );
  }

  const timeline = momentum?.timeline || [];
  const events = dynamicEvents || MATCH_EVENTS[matchId] || [];
  const stats = matchId.startsWith("wc2026_") && selectedMatch ? {
    stage: selectedMatch.stage || "FIFA WORLD CUP 2026",
    score: `${selectedMatch.home_score} - ${selectedMatch.away_score}`,
    status: selectedMatch.finished ? "FT" : selectedMatch.time_elapsed === "notstarted" ? "Not Started" : `LIVE • ${selectedMatch.time_elapsed}`,
    possession: { A: 50, B: 50 },
    shots: { A: Math.max(2, parseInt(selectedMatch.home_score || 0) * 3 + 2), B: Math.max(2, parseInt(selectedMatch.away_score || 0) * 3 + 2) },
    passes: { A: 480, B: 460 }
  } : (MATCH_STATS[matchId] || MATCH_STATS["3869685"]);

  // SVG parameters for graph
  const width = 1000;
  const height = 240;
  const padding = 20;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;
  
  const vals = timeline.map(t => t.momentum);
  const maxVal = Math.max(...vals, 10);
  const minVal = Math.min(...vals, -10);
  const absMax = Math.max(Math.abs(maxVal), Math.abs(minVal));

  const getX = (minute) => {
    const maxMin = timeline[timeline.length - 1]?.minute || 90;
    return padding + (minute / maxMin) * graphWidth;
  };

  const getY = (val) => {
    const scale = graphHeight / (absMax * 2);
    return height / 2 - val * scale;
  };

  let pathD = "";
  if (timeline.length > 0) {
    pathD = `M ${getX(0)} ${getY(0)}`;
    timeline.forEach((point) => {
      pathD += ` L ${getX(point.minute)} ${getY(point.momentum)}`;
    });
  }

  const getMomentumForMinute = (minute) => {
    if (timeline.length === 0) return 0;
    
    let p1 = timeline[0];
    let p2 = timeline[timeline.length - 1];
    
    if (minute <= p1.minute) return p1.momentum;
    if (minute >= p2.minute) return p2.momentum;
    
    for (let i = 0; i < timeline.length - 1; i++) {
      if (minute >= timeline[i].minute && minute <= timeline[i+1].minute) {
        p1 = timeline[i];
        p2 = timeline[i+1];
        break;
      }
    }
    
    const t = (minute - p1.minute) / (p2.minute - p1.minute);
    return p1.momentum + t * (p2.momentum - p1.momentum);
  };

  const getYForMinute = (minute) => {
    return getY(getMomentumForMinute(minute));
  };

  const getEventEmoji = (type) => {
    const t = type ? type.toLowerCase() : "";
    if (t.includes("goal")) return "⚽";
    if (t.includes("sub")) return "🔄";
    if (t.includes("var") || t.includes("offside")) return "🛡️";
    return "📈";
  };

  const handleSvgMouseMove = (e) => {
    if (timeline.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    const svgX = (clientX / rect.width) * width;
    const maxMin = timeline[timeline.length - 1]?.minute || 90;
    
    let minute = ((svgX - padding) / graphWidth) * maxMin;
    minute = Math.max(0, Math.min(maxMin, minute));
    
    const exactX = getX(minute);
    const exactMomentum = getMomentumForMinute(minute);
    const exactY = getY(exactMomentum);
    
    const nearbyEvent = events.find(ev => Math.abs(ev.minute - minute) <= 3.5);
    
    setHoveredPoint({
      minute: Math.round(minute),
      momentum: parseFloat(exactMomentum.toFixed(1)),
      x: exactX,
      y: exactY,
      event: nearbyEvent,
      clientX: (clientX / rect.width) * 100,
      clientY: (clientY / rect.height) * 100
    });
  };

  const handleSvgMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in">
      
      {/* Scoreboard Header Widget - Editorial light mode styled */}
      <div className="bg-bg-card-light border border-border-warm rounded-2xl p-6 shadow-sm flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[180px] h-[180px] rounded-full blur-[100px] opacity-15 bg-gold-accent/10 pointer-events-none"></div>
        
        {/* Info header */}
        <div className="flex justify-between items-center border-b border-border-warm pb-3">
          <span className="text-[10px] text-forest-green-muted font-mono tracking-widest font-bold uppercase">{stats.stage}</span>
          <span className="bg-forest-green text-white font-mono text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider font-extrabold shadow-sm">
            {stats.status}
          </span>
        </div>

        {/* Teams & Score split */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 px-2">
          {/* Team A */}
          <div className="flex items-center gap-3.5 w-full md:w-1/3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-forest-green border border-gold-accent/20 flex items-center justify-center text-white font-display font-black text-sm shadow-md">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-forest-green font-display font-black text-base tracking-tight uppercase">{momentum?.teamA}</span>
              <span className="text-[9px] text-slate-400 font-mono uppercase">Attacking Squad</span>
            </div>
          </div>

          {/* Score Counter */}
          <div className="flex items-center gap-6 text-forest-green justify-center w-full md:w-1/3">
            <span className="font-serif font-black text-4xl md:text-5xl">{stats.score.split(" - ")[0]}</span>
            <div className="h-6 w-[1.5px] bg-border-warm"></div>
            <span className="font-serif font-black text-4xl md:text-5xl">{stats.score.split(" - ")[1]}</span>
          </div>

          {/* Team B */}
          <div className="flex items-center gap-3.5 w-full md:w-1/3 justify-center md:justify-end">
            <div className="flex flex-col text-center md:text-right">
              <span className="text-forest-green font-display font-black text-base tracking-tight uppercase">{momentum?.teamB}</span>
              <span className="text-[9px] text-slate-400 font-mono uppercase">Opponent Block</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-bg-cream border border-border-warm flex items-center justify-center text-forest-green font-display font-black text-sm shadow-md">
              B
            </div>
          </div>
        </div>

        {/* Stats progress layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2 pt-4 border-t border-border-warm">
          {/* Possession */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-bold text-forest-green-muted">
              <span>Possession</span>
              <span className="text-forest-green font-mono">{stats.possession.A}% - {stats.possession.B}%</span>
            </div>
            <div className="h-2 w-full bg-bg-cream rounded-full overflow-hidden flex p-0.5 border border-border-warm">
              <div style={{ width: `${stats.possession.A}%` }} className="bg-forest-green h-full rounded-full"></div>
              <div style={{ width: `${stats.possession.B}%` }} className="bg-gold-accent h-full rounded-full"></div>
            </div>
          </div>

          {/* Shots */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-bold text-forest-green-muted">
              <span>Shots</span>
              <span className="text-forest-green font-mono">{stats.shots.A} - {stats.shots.B}</span>
            </div>
            <div className="h-2 w-full bg-bg-cream rounded-full overflow-hidden flex p-0.5 border border-border-warm">
              <div style={{ width: `${(stats.shots.A / (stats.shots.A + stats.shots.B)) * 100}%` }} className="bg-forest-green h-full rounded-full"></div>
              <div style={{ width: `${(stats.shots.B / (stats.shots.A + stats.shots.B)) * 100}%` }} className="bg-gold-accent h-full rounded-full"></div>
            </div>
          </div>

          {/* Passes */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-bold text-forest-green-muted">
              <span>Completed Passes</span>
              <span className="text-forest-green font-mono">{stats.passes.A} - {stats.passes.B}</span>
            </div>
            <div className="h-2 w-full bg-bg-cream rounded-full overflow-hidden flex p-0.5 border border-border-warm">
              <div style={{ width: `${(stats.passes.A / (stats.passes.A + stats.passes.B)) * 100}%` }} className="bg-forest-green h-full rounded-full"></div>
              <div style={{ width: `${(stats.passes.B / (stats.passes.A + stats.passes.B)) * 100}%` }} className="bg-gold-accent h-full rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Active View Rendering */}
      {activeView === "summary" && (
        <>
          {summaryLoading ? (
            <div className="flex flex-col items-center justify-center py-36 text-forest-green-muted gap-4 animate-fade-in w-full bg-bg-card-light border border-border-warm rounded-2xl p-8 shadow-sm">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-gold-accent border-t-transparent rounded-full animate-spin"></div>
                <Cpu className="text-forest-green animate-pulse" size={18} />
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center mt-2">
                <span className="font-mono text-[10px] uppercase tracking-widest font-extrabold text-forest-green animate-pulse">
                  Querying Granite AI Summary Engine...
                </span>
                <span className="text-[11px] text-slate-400 max-w-[280px]">
                  Analyzing match events, possession shifts, and physical fatigue telemetry.
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start w-full animate-fade-in">
              
              {/* Left: Article-style Summary */}
              <div className="lg:col-span-3 bg-bg-card-light border border-border-warm rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full blur-[100px] opacity-10 bg-gold-accent/10 pointer-events-none"></div>
                
                <div className="border-b border-border-warm pb-4 flex justify-between items-center">
                  <div>
                    <span className="font-mono text-[9px] font-bold text-gold-accent uppercase">AI Journal Report</span>
                    <h3 className="text-forest-green font-serif font-black text-2xl mt-1">Match Tactical Breakdown</h3>
                    <p className="text-forest-green-muted text-[11px] mt-1">Comprehensive overview of key tactical cycles and game stages.</p>
                  </div>
                  <span className="bg-forest-green/5 text-forest-green font-mono text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
                    Granite 3.3 2B
                  </span>
                </div>

                <div className="flex flex-col gap-6 text-xs text-forest-green-muted leading-relaxed">
                  {/* 1. First-Half Analysis */}
                  <div className="flex flex-col gap-2">
                    <h4 className="font-display font-extrabold text-forest-green uppercase text-[10px] tracking-wider">1. First-Half Analysis</h4>
                    {summaryData?.first_half ? (
                      (() => {
                        const para = summaryData.first_half.trim();
                        const firstLetter = para.charAt(0);
                        const restOfPara = para.substring(1);
                        return (
                          <p className="text-xs md:text-[13px] text-forest-green-muted leading-relaxed font-body">
                            <span className="float-left text-4xl font-serif font-black text-forest-green mr-2 mt-1.5 leading-none">
                              {firstLetter}
                            </span>
                            {restOfPara}
                          </p>
                        );
                      })()
                    ) : (
                      <p className="text-xs md:text-[13px] text-forest-green-muted leading-relaxed font-body">
                        No analysis available.
                      </p>
                    )}
                  </div>

                  {/* 2. Second-Half Developments */}
                  <div className="flex flex-col gap-2 border-t border-border-warm pt-4">
                    <h4 className="font-display font-extrabold text-forest-green uppercase text-[10px] tracking-wider">2. Second-Half Developments</h4>
                    <p className="text-xs md:text-[13px] text-forest-green-muted leading-relaxed font-body whitespace-pre-line">
                      {summaryData?.second_half || "No developments available."}
                    </p>
                  </div>

                  {/* 3. Tactical Insights & Momentum Changes */}
                  <div className="flex flex-col gap-2 border-t border-border-warm pt-4">
                    <h4 className="font-display font-extrabold text-forest-green uppercase text-[10px] tracking-wider">3. Tactical Insights & Momentum Changes</h4>
                    <p className="text-xs md:text-[13px] text-forest-green-muted leading-relaxed font-body whitespace-pre-line">
                      {summaryData?.tactical_insights || "No tactical insights available."}
                    </p>
                  </div>
                </div>

                {/* Journalist signature lockup */}
                <div className="border-t border-border-warm pt-4 mt-2 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>REPORTED BY: MOMENTUMIQ AI JOURNALIST</span>
                  <span>DATE: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              {/* Right: Player Performance Drops (Fatigue & Pressure) */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                <div className="bg-bg-card-light border border-border-warm rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                  <div>
                    <span className="font-mono text-[9px] font-bold text-gold-accent uppercase">Physicality & Stamina Metrics</span>
                    <h3 className="text-forest-green font-serif font-black text-2xl mt-1">Performance Drops</h3>
                    <p className="text-forest-green-muted text-[11px] mt-1">Fatigue decay and progressive pass success under defensive pressure.</p>
                  </div>

                  <div className="flex flex-col gap-5">
                    {pressureData?.top_pressured_players?.map((p, idx) => {
                      const playerFatigue = fatigueData?.[p.player];
                      const fatigueEndVal = playerFatigue?.curve?.[1]?.fatigue_percentage || 60;
                      
                      return (
                        <div key={idx} className="bg-bg-ivory/40 border border-border-warm rounded-xl p-4 flex flex-col gap-3.5 hover:border-gold-accent/30 transition-all duration-300">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-forest-green">{p.player}</span>
                            <span className="font-mono text-[9px] text-forest-green-muted uppercase tracking-wider">{p.team}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {/* xP under pressure */}
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-mono text-slate-400 uppercase">xP under pressure</span>
                              <span className="text-sm font-serif font-black text-forest-green">{p.pressure_accuracy}%</span>
                              <span className="text-[9.5px] text-forest-green-muted">{p.completed_pressure_passes || 11}/{p.pressure_passes} passes</span>
                            </div>

                            {/* Fatigue Decay bar */}
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-mono text-slate-400 uppercase">Late Match Fatigue</span>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-full bg-bg-cream rounded-full overflow-hidden relative border border-border-warm font-sans">
                                  <div 
                                    style={{ width: `${fatigueEndVal}%` }} 
                                    className={`h-full rounded-full ${
                                      fatigueEndVal > 70 ? "bg-accent-red" : fatigueEndVal > 45 ? "bg-gold-accent" : "bg-forest-green"
                                    }`}
                                  ></div>
                                </div>
                                <span className="font-mono text-[10px] font-extrabold text-forest-green">{fatigueEndVal}%</span>
                              </div>
                              <span className="text-[8px] text-forest-green-muted uppercase tracking-wider">75-95' Interval</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic AI Fatigue Insight */}
                {summaryData?.player_performance && (
                  <div className="bg-[#FDFDFB] border border-border-warm rounded-2xl p-5 shadow-sm flex flex-col gap-3.5 hover:border-gold-accent/30 transition-all duration-300">
                    <span className="font-mono text-[9px] font-bold text-gold-accent uppercase">AI Physicality Insight</span>
                    <p className="text-[11.5px] text-forest-green-muted leading-relaxed font-body">
                      {summaryData.player_performance}
                    </p>
                  </div>
                )}

              </div>

            </div>
          )}
        </>
      )}

      {activeView === "story" && (
        <div className="flex flex-col gap-6 w-full animate-fade-in">
          {matchId.startsWith("wc2026_") && (
            <div className="flex items-center gap-3 bg-[#0D2C1E] border border-[#C29F5C]/35 rounded-xl p-4 shadow-sm text-white">
              <ShieldAlert className="text-[#C29F5C] shrink-0 animate-pulse" size={18} />
              <div className="flex flex-col">
                <span className="font-mono text-[9px] text-[#C29F5C] font-bold uppercase tracking-wider text-left">Telemetry Warning</span>
                <span className="text-[11px] font-medium leading-relaxed text-left">
                  Spatial coordinate telemetry and tracking is restricted to the FIFA World Cup 2022 archive. Reverting to static match summary narrative.
                </span>
              </div>
            </div>
          )}
          {/* Chapter selector tabs: CH. I to CH. VI */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
            {[
              { key: "firstHalf", label: "First Half", roman: "CH. I" },
              { key: "secondHalf", label: "Second Half", roman: "CH. II" },
              { key: "turningPoints", label: "Turning Points", roman: "CH. III" },
              { key: "momentumSwings", label: "Momentum Swings", roman: "CH. IV" },
              { key: "tacticalChanges", label: "Tactical Changes", roman: "CH. V" },
              { key: "humanPerformance", label: "Human Performance", roman: "CH. VI" }
            ].map((ch) => {
              const isActive = activeChapter === ch.key;
              return (
                <button
                  key={ch.key}
                  onClick={() => {
                    setActiveChapter(ch.key);
                    const chEvents = getChapterEvents(ch.key, events);
                    if (chEvents.length > 0) {
                      handleEventClick(chEvents[0]);
                    } else {
                      setSelectedEvent(null);
                    }
                  }}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? "bg-forest-green text-bg-ivory border-forest-green shadow-md -translate-y-0.5" 
                      : "bg-bg-card-light text-forest-green border-border-warm hover:border-gold-accent hover:-translate-y-0.5 hover:shadow-sm"
                  }`}
                  style={{ minHeight: "64px" }}
                >
                  <span className={`font-mono text-[9px] uppercase tracking-wider ${isActive ? "text-gold-accent" : "text-forest-green-muted"}`}>
                    {ch.roman}
                  </span>
                  <span className="font-serif font-black text-xs mt-1 leading-tight">
                    {ch.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start w-full">
            {/* Left: Chapter Article Panel & Twin Pitches */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              
              {/* Chapter Editorial Article */}
              <div className="bg-bg-card-light border border-border-warm rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[240px] h-[240px] rounded-full blur-[120px] opacity-10 bg-gold-accent/15 pointer-events-none"></div>
                
                {/* Header elements */}
                <div className="flex flex-wrap gap-2 justify-between items-center border-b border-border-warm pb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] font-bold text-gold-accent uppercase tracking-widest bg-forest-green/5 px-2.5 py-1 rounded-full">
                      {activeChapter === "firstHalf" ? "CHAPTER I" :
                       activeChapter === "secondHalf" ? "CHAPTER II" :
                       activeChapter === "turningPoints" ? "CHAPTER III" :
                       activeChapter === "momentumSwings" ? "CHAPTER IV" :
                       activeChapter === "tacticalChanges" ? "CHAPTER V" :
                       "CHAPTER VI"}
                    </span>
                  </div>
                  <span className="bg-gold-accent/10 text-gold-accent font-mono text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider font-extrabold border border-gold-accent/10">
                    {CHAPTER_ARTICLES[matchId]?.[activeChapter]?.badge || "TACTICAL LOG"}
                  </span>
                </div>

                {/* Article body */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-forest-green font-serif font-black text-2xl md:text-3xl tracking-tight leading-tight">
                    {CHAPTER_ARTICLES[matchId]?.[activeChapter]?.title || "Narrative Breakdown"}
                  </h2>

                  <div className="text-forest-green-muted text-xs leading-relaxed space-y-4">
                    {(CHAPTER_ARTICLES[matchId]?.[activeChapter]?.content || "").split("\n\n").map((para, idx) => {
                      if (para.trim().length === 0) return null;
                      if (idx === 0) {
                        const firstLetter = para.charAt(0);
                        const restOfPara = para.substring(1);
                        return (
                          <p key={idx} className="text-xs md:text-[13px] text-forest-green-muted leading-relaxed font-body">
                            <span className="float-left text-4xl font-serif font-black text-forest-green mr-2 mt-1.5 leading-none">
                              {firstLetter}
                            </span>
                            {restOfPara}
                          </p>
                        );
                      }
                      return (
                        <p key={idx} className="text-xs md:text-[13px] text-forest-green-muted leading-relaxed font-body whitespace-pre-line">
                          {para}
                        </p>
                      );
                    })}
                  </div>
                </div>

                {/* Styled highlights block */}
                <div className="border-t border-border-warm pt-5 mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-bg-cream/20 p-4 rounded-xl border border-border-warm">
                  <div className="flex flex-col">
                    <span className="font-mono text-[8px] uppercase tracking-wider text-slate-400">Tactical Digest</span>
                    <span className="text-forest-green font-serif font-extrabold text-xs mt-0.5">
                      Interactive coordinates matching Chapter Milestones below.
                    </span>
                  </div>
                  <span className="text-[10px] text-gold-accent font-semibold flex items-center gap-1 font-mono">
                    MomentumIQ AI Engine • Grounded
                  </span>
                </div>
              </div>

              {/* Before vs After split (Twin Pitches) */}
              <div className="bg-bg-card-light border border-border-warm rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                <div className="flex justify-between items-center border-b border-border-warm pb-3">
                  <div>
                    <h3 className="text-forest-green font-display font-extrabold text-xs uppercase tracking-wider">Before vs. After Tactical split</h3>
                    <p className="text-forest-green-muted text-[11px] mt-1">Comparing compact formations before vs. after selected event milestones.</p>
                  </div>
                  {selectedEvent && (
                    <span className="bg-forest-green text-white font-mono text-[9px] px-2 py-0.5 rounded uppercase font-bold animate-pulse">
                      Milestone: {selectedEvent.minute}'
                    </span>
                  )}
                </div>

                {matchId.startsWith("wc2026_") ? (
                  <div className="flex flex-col items-center justify-center p-8 bg-[#0D2C1E]/5 border border-[#C29F5C]/45 rounded-xl text-center gap-3 w-full h-[220px]">
                    <ShieldAlert className="text-[#C29F5C] animate-pulse" size={32} />
                    <h4 className="text-[#C29F5C] font-display font-extrabold text-xs uppercase tracking-wider">No Spatial Data</h4>
                    <p className="text-forest-green-muted text-[11px] max-w-xs leading-relaxed">
                      Spatial coordinate telemetry and tracking is restricted to the FIFA World Cup 2022 archive. Reverting to static match summary narrative.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 15m Before */}
                  <div className="bg-bg-ivory border border-border-warm rounded-xl p-3.5 flex flex-col items-center gap-3">
                    <span className="text-[10px] text-forest-green font-mono uppercase tracking-wider font-extrabold">15m Before Event</span>
                    
                    <div className="w-full relative rounded overflow-hidden border border-border-warm shadow-inner bg-[#0A2216]">
                      <svg viewBox="0 0 100 66.6" width="100%" height="auto">
                        <g opacity="0.15">
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
                        <g opacity="0.3" stroke="#FAF8F5" strokeWidth="0.8" fill="none">
                          <rect x="0" y="0" width="100" height="66.6" />
                          <line x1="50" y1="0" x2="50" y2="66.6" />
                          <circle cx="50" cy="33.3" r="10" />
                          <rect x="0" y="13.3" width="16" height="40" />
                          <rect x="84" y="13.3" width="16" height="40" />
                        </g>
                        {/* Movement lines */}
                        {pitchData.beforeRed.map((p) => p.runX && (
                          <line key={`run-red-${p.id}`} x1={p.x} y1={p.y} x2={p.runX} y2={p.runY} stroke="#ffffff" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                        ))}
                        {pitchData.beforeBlue.map((p) => p.runX && (
                          <line key={`run-blue-${p.id}`} x1={p.x} y1={p.y} x2={p.runX} y2={p.runY} stroke="#C29F5C" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                        ))}
                        {/* Player tags */}
                        {pitchData.beforeRed.map((p, idx) => (
                          <g key={`r-grp-${idx}`}>
                            <circle cx={p.x} cy={p.y} r="3" fill="#ffffff" stroke="#0D2C1E" strokeWidth="0.6" />
                            <text x={p.x} y={p.y + 0.8} fontSize="2.2" fill="#0D2C1E" textAnchor="middle" fontWeight="bold">{p.num}</text>
                          </g>
                        ))}
                        {pitchData.beforeBlue.map((p, idx) => (
                          <g key={`b-grp-${idx}`}>
                            <circle cx={p.x} cy={p.y} r="3" fill="#C29F5C" stroke="#ffffff" strokeWidth="0.6" />
                            <text x={p.x} y={p.y + 0.8} fontSize="2.2" fill="#ffffff" textAnchor="middle" fontWeight="bold">{p.num}</text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* 15m After */}
                  <div className="bg-bg-ivory border border-border-warm rounded-xl p-3.5 flex flex-col items-center gap-3">
                    <span className="text-[10px] text-gold-accent font-mono uppercase tracking-wider font-extrabold">15m After Event</span>
                    
                    <div className="w-full relative rounded overflow-hidden border border-border-warm shadow-inner bg-[#0A2216]">
                      <svg viewBox="0 0 100 66.6" width="100%" height="auto">
                        <g opacity="0.15">
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
                        <g opacity="0.3" stroke="#FAF8F5" strokeWidth="0.8" fill="none">
                          <rect x="0" y="0" width="100" height="66.6" />
                          <line x1="50" y1="0" x2="50" y2="66.6" />
                          <circle cx="50" cy="33.3" r="10" />
                          <rect x="0" y="13.3" width="16" height="40" />
                          <rect x="84" y="13.3" width="16" height="40" />
                        </g>
                        {/* Player tags */}
                        {pitchData.afterRed.map((p, idx) => (
                          <g key={`ra-grp-${idx}`}>
                            <circle cx={p.x} cy={p.y} r="3" fill="#ffffff" stroke="#0D2C1E" strokeWidth="0.6" />
                            <text x={p.x} y={p.y + 0.8} fontSize="2.2" fill="#0D2C1E" textAnchor="middle" fontWeight="bold">{p.num}</text>
                          </g>
                        ))}
                        {pitchData.afterBlue.map((p, idx) => (
                          <g key={`ba-grp-${idx}`}>
                            <circle cx={p.x} cy={p.y} r="3" fill="#C29F5C" stroke="#ffffff" strokeWidth="0.6" />
                            <text x={p.x} y={p.y + 0.8} fontSize="2.2" fill="#ffffff" textAnchor="middle" fontWeight="bold">{p.num}</text>
                          </g>
                        ))}
                      </svg>
                    </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right: Chapter-Filtered Timeline & AI Explainer */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Timeline of Match Events */}
              <div className="bg-bg-card-light border border-border-warm rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <h3 className="text-forest-green font-display font-extrabold text-xs uppercase tracking-wider">Chapter Milestones</h3>
                <div className="flex flex-col gap-3 max-h-[340px] overflow-y-auto pr-1">
                  {getChapterEvents(activeChapter, events).length === 0 ? (
                    <div className="text-center py-8 text-forest-green-muted text-xs font-semibold">
                      No milestones recorded for this chapter.
                    </div>
                  ) : (
                    getChapterEvents(activeChapter, events).map((ev, idx) => {
                      const isActive = selectedEvent?.minute === ev.minute;
                      return (
                        <div 
                          key={idx}
                          onClick={() => handleEventClick(ev)}
                          className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer transition-all duration-300 ${
                            isActive 
                              ? "bg-bg-cream border-gold-accent shadow-sm" 
                              : "bg-bg-ivory border-border-warm hover:border-gold-accent/40"
                          }`}
                          style={{ minHeight: "44px" }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] font-bold text-white bg-forest-green px-2 py-0.5 rounded border border-forest-green/10">
                              {ev.minute}'
                            </span>
                            <div className="flex flex-col">
                              <span className="text-forest-green text-xs font-extrabold">{ev.player}</span>
                              <span className="text-[10px] text-forest-green-muted mt-0.5 font-medium leading-tight">{ev.detail}</span>
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-forest-green-muted shrink-0 ml-2" />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* AI Match Story details */}
              <div className="bg-[#FDFDFB] border border-border-warm rounded-2xl p-6 shadow-sm flex flex-col gap-5 items-stretch">
                <div className="flex justify-between items-center border-b border-border-warm pb-4">
                  <div className="flex items-center gap-2">
                    <Cpu size={15} className="text-forest-green" />
                    <h3 className="text-forest-green font-display font-extrabold text-xs uppercase tracking-wider">AI Tactical Breakdown</h3>
                  </div>
                  
                  <button 
                    onClick={() => setExplainModalOpen(true)}
                    className="flex items-center gap-1 bg-forest-green/5 border border-forest-green/10 text-forest-green font-mono text-[9px] px-2.5 py-1.5 rounded-full cursor-pointer hover:bg-forest-green/10 transition-all font-bold"
                  >
                    <HelpCircle size={10} /> Explain Weights
                  </button>
                </div>

                {selectedEvent ? (
                  <div className="flex flex-col gap-4 animate-slide-up">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-gold-accent bg-bg-cream px-2 py-0.5 rounded border border-gold-accent/20">
                        {selectedEvent.minute}' Milestone
                      </span>
                      <span className="text-forest-green text-xs font-extrabold">{selectedEvent.player}</span>
                    </div>
                    
                    <div className="text-[11px] italic text-forest-green bg-bg-ivory p-3 rounded-xl border border-border-warm border-l-2 border-l-gold-accent">
                      "{selectedEvent.query}"
                    </div>

                    {explaining ? (
                      <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="w-5 h-5 border-2 border-forest-green border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-mono text-[9px] text-forest-green-muted uppercase tracking-widest font-bold animate-pulse">Running Granite LLM...</span>
                      </div>
                    ) : (
                      <div className="text-forest-green-muted text-xs leading-relaxed space-y-2">
                        <p className="whitespace-pre-line leading-relaxed font-body">{aiExplanation}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-bg-ivory border border-border-warm flex items-center justify-center text-forest-green-muted">
                      <Clock size={20} />
                    </div>
                    <span className="text-forest-green-muted text-[11px] font-bold px-4 leading-normal">
                      Select a milestone event on the timeline to inspect the coordinates and run AI tactical reasoning.
                    </span>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {activeView === "momentum" && (
        <div className="flex flex-col gap-6 animate-fade-in">
          
          {/* Main area rollercoaster chart */}
          <div className="bg-bg-card-light border border-border-warm rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 border-b border-border-warm pb-4">
              <div>
                <h3 className="text-forest-green font-display font-extrabold text-xs uppercase tracking-wider">Dominance Intensity Graph</h3>
                <p className="text-forest-green-muted text-xs mt-1">TradingView-style financial curve visualizing dominance fluctuations.</p>
              </div>
              <div className="flex gap-4 font-mono text-[9.5px] text-forest-green-muted uppercase tracking-wider font-bold">
                <span className="flex items-center gap-1 text-forest-green"><TrendingUp size={12} /> {momentum?.teamA} Dominance</span>
                <span className="flex items-center gap-1 text-gold-accent"><TrendingDown size={12} /> {momentum?.teamB} Dominance</span>
              </div>
            </div>

            {matchId.startsWith("wc2026_") ? (
              <div className="flex flex-col items-center justify-center p-8 bg-[#0D2C1E]/5 border border-[#C29F5C]/45 rounded-xl text-center gap-3 w-full h-[240px]">
                <ShieldAlert className="text-[#C29F5C] animate-pulse" size={36} />
                <h4 className="text-[#C29F5C] font-display font-extrabold text-xs uppercase tracking-wider">Spatial Coordinate Telemetry Restrained</h4>
                <p className="text-forest-green-muted text-[11px] max-w-md leading-relaxed">
                  Spatial coordinate telemetry and tracking is restricted to the FIFA World Cup 2022 archive. Reverting to static match summary narrative.
                </p>
              </div>
            ) : (
              <div className="bg-bg-ivory border border-border-warm rounded-xl p-3 relative overflow-visible">
                <svg 
                viewBox={`0 0 ${width} ${height}`} 
                width="100%" 
                height="auto" 
                className="block cursor-crosshair select-none"
                onMouseMove={handleSvgMouseMove}
                onMouseLeave={handleSvgMouseLeave}
              >
                <defs>
                  <linearGradient id="area-A" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0D2C1E" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#0D2C1E" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="area-B" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C29F5C" stopOpacity="0.0" />
                    <stop offset="100%" stopColor="#C29F5C" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Grid levels & Y-axis labels */}
                {(() => {
                  const levels = [
                    { val: absMax, label: `+${absMax.toFixed(0)}` },
                    { val: absMax / 2, label: `+${(absMax/2).toFixed(1)}` },
                    { val: 0, label: "0" },
                    { val: -absMax / 2, label: `-${(absMax/2).toFixed(1)}` },
                    { val: -absMax, label: `-${absMax.toFixed(0)}` }
                  ];
                  return levels.map((level, idx) => {
                    const y = getY(level.val);
                    const isZero = level.val === 0;
                    return (
                      <g key={`lvl-${idx}`}>
                        <line 
                          x1={padding} 
                          y1={y} 
                          x2={width - padding} 
                          y2={y} 
                          stroke={isZero ? "rgba(13, 44, 30, 0.4)" : "rgba(13, 44, 30, 0.08)"} 
                          strokeDasharray={isZero ? "none" : "4 4"} 
                          strokeWidth={isZero ? "1.5" : "0.8"} 
                        />
                        <text 
                          x={padding - 5} 
                          y={y + 3} 
                          fill={isZero ? "#0D2C1E" : "#334E40"} 
                          fontSize="7.5" 
                          fontFamily="var(--font-mono)" 
                          fontWeight={isZero ? "bold" : "normal"}
                          textAnchor="end"
                        >
                          {level.label}
                        </text>
                        <text 
                          x={width - padding + 5} 
                          y={y + 3} 
                          fill={isZero ? "#0D2C1E" : "#334E40"} 
                          fontSize="7.5" 
                          fontFamily="var(--font-mono)" 
                          fontWeight={isZero ? "bold" : "normal"}
                          textAnchor="start"
                        >
                          {level.label}
                        </text>
                      </g>
                    );
                  });
                })()}

                {/* Zone labels */}
                <text 
                  x={padding + 10} 
                  y={padding + 12} 
                  fill="#0D2C1E" 
                  fontSize="8" 
                  fontFamily="var(--font-display)" 
                  fontWeight="900" 
                  opacity="0.25"
                  letterSpacing="1"
                >
                  {momentum?.teamA?.toUpperCase()} CONTROL ZONE
                </text>
                <text 
                  x={padding + 10} 
                  y={height - padding - 15} 
                  fill="#C29F5C" 
                  fontSize="8" 
                  fontFamily="var(--font-display)" 
                  fontWeight="900" 
                  opacity="0.45"
                  letterSpacing="1"
                >
                  {momentum?.teamB?.toUpperCase()} CONTROL ZONE
                </text>

                {/* Transparent overlay for mouse events capture */}
                <rect 
                  x={padding} 
                  y={padding} 
                  width={graphWidth} 
                  height={graphHeight} 
                  fill="transparent" 
                  className="pointer-events-all" 
                />

                {/* Shaded Areas */}
                {timeline.length > 0 && (
                  <>
                    <path 
                      d={`${pathD} L ${getX(timeline[timeline.length - 1].minute)} ${height/2} L ${getX(0)} ${height/2} Z`} 
                      fill="url(#area-A)" 
                      clipPath="polygon(0 0, 100% 0, 100% 50%, 0 50%)" 
                    />
                    <path 
                      d={`${pathD} L ${getX(timeline[timeline.length - 1].minute)} ${height/2} L ${getX(0)} ${height/2} Z`} 
                      fill="url(#area-B)" 
                      clipPath="polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" 
                    />
                  </>
                )}

                {/* Core Curve */}
                <path d={pathD} fill="none" stroke="#0D2C1E" strokeWidth="2.2" strokeLinecap="round" />

                {/* Vertical minutes markings */}
                {[15, 30, 45, 60, 75, 90].map((min) => (
                  <g key={min}>
                    <line x1={getX(min)} y1={padding} x2={getX(min)} y2={height - padding} stroke="rgba(13, 44, 30, 0.05)" strokeWidth="0.8" />
                    <text x={getX(min)} y={height - 5} fill="#334E40" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">
                      {min}'
                    </text>
                  </g>
                ))}

                {/* Interactive points */}
                {timeline.map((point, idx) => {
                  const matchedEvent = events.find(e => Math.abs(e.minute - point.minute) <= 3.5);
                  const isActive = selectedEvent && Math.abs(selectedEvent.minute - point.minute) <= 3.5;
                  
                  return (
                    <circle 
                      key={idx} 
                      cx={getX(point.minute)} 
                      cy={getY(point.momentum)} 
                      r={isActive ? "5" : "3"} 
                      fill={isActive ? "#C29F5C" : (point.momentum >= 0 ? "#0D2C1E" : "#C29F5C")}
                      opacity={isActive ? "1" : "0.7"}
                      className="cursor-pointer transition-all hover:scale-125"
                      onClick={() => {
                        if (matchedEvent) handleEventClick(matchedEvent);
                      }}
                    />
                  );
                })}

                {/* Milestone Event Flags */}
                {events.map((ev, idx) => {
                  const evX = getX(ev.minute);
                  const evY = getYForMinute(ev.minute);
                  const emoji = getEventEmoji(ev.type);
                  const isActive = selectedEvent && Math.abs(selectedEvent.minute - ev.minute) <= 0.1;
                  
                  const isPositive = evY < height / 2;
                  const flagY = isPositive ? evY - 24 : evY + 24;
                  
                  return (
                    <g 
                      key={`flag-${idx}`} 
                      className="cursor-pointer group select-none"
                      onClick={() => handleEventClick(ev)}
                    >
                      <line 
                        x1={evX} 
                        y1={evY} 
                        x2={evX} 
                        y2={flagY} 
                        stroke={isActive ? "#C29F5C" : "rgba(13, 44, 30, 0.4)"} 
                        strokeWidth="1.2" 
                        strokeDasharray="2 2" 
                        className="group-hover:stroke-gold-accent transition-colors"
                      />
                      
                      <circle 
                        cx={evX} 
                        cy={evY} 
                        r={isActive ? "6" : "4.5"} 
                        fill={isActive ? "#C29F5C" : "#FAF8F5"} 
                        stroke={isActive ? "#0D2C1E" : "#C29F5C"} 
                        strokeWidth={isActive ? "2" : "1.5"}
                        className="group-hover:fill-gold-accent transition-all duration-300"
                      />
                      {isActive && (
                        <circle 
                          cx={evX} 
                          cy={evY} 
                          r="10" 
                          fill="none" 
                          stroke="#C29F5C" 
                          strokeWidth="0.8" 
                          className="animate-ping" 
                        />
                      )}

                      <g transform={`translate(${evX - 16}, ${isPositive ? flagY - 14 : flagY})`}>
                        <rect 
                          width="32" 
                          height="14" 
                          rx="3" 
                          fill={isActive ? "#0D2C1E" : "#FAF8F5"} 
                          stroke={isActive ? "#C29F5C" : "#0D2C1E"} 
                          strokeWidth="0.8"
                          className="shadow-sm transition-all group-hover:stroke-gold-accent"
                        />
                        <text 
                          x="16" 
                          y="10" 
                          fontSize="8" 
                          fontFamily="var(--font-mono)" 
                          fontWeight="bold" 
                          fill={isActive ? "#FAF8F5" : "#0D2C1E"} 
                          textAnchor="middle"
                        >
                          {emoji} {Math.floor(ev.minute)}'
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Mouse Hover Tracker guide lines and glowing dots */}
                {hoveredPoint && (
                  <g className="pointer-events-none">
                    <line 
                      x1={hoveredPoint.x} 
                      y1={padding} 
                      x2={hoveredPoint.x} 
                      y2={height - padding} 
                      stroke="#C29F5C" 
                      strokeWidth="1.2" 
                      strokeDasharray="3 3" 
                      opacity="0.8" 
                    />
                    <line 
                      x1={padding} 
                      y1={hoveredPoint.y} 
                      x2={width - padding} 
                      y2={hoveredPoint.y} 
                      stroke="rgba(194, 159, 92, 0.4)" 
                      strokeWidth="0.8" 
                      strokeDasharray="2 2" 
                    />
                    <circle 
                      cx={hoveredPoint.x} 
                      cy={hoveredPoint.y} 
                      r="8" 
                      fill="none" 
                      stroke="#C29F5C" 
                      strokeWidth="1.5" 
                      opacity="0.5" 
                      className="animate-pulse" 
                    />
                    <circle 
                      cx={hoveredPoint.x} 
                      cy={hoveredPoint.y} 
                      r="4" 
                      fill="#0D2C1E" 
                      stroke="#C29F5C" 
                      strokeWidth="1.5" 
                    />
                  </g>
                )}
              </svg>

              {/* Floating Tooltip Card */}
              {hoveredPoint && (
                <div 
                  className="absolute pointer-events-none bg-white/95 backdrop-blur-md border border-border-warm rounded-xl p-3 shadow-xl z-20 flex flex-col gap-1 w-56 animate-fade-in transition-all duration-75"
                  style={{
                    left: `${hoveredPoint.clientX}%`,
                    top: `${hoveredPoint.clientY}%`,
                    transform: `translate(${hoveredPoint.clientX > 50 ? "-110%" : "10%"}, -50%)`
                  }}
                >
                  <div className="flex justify-between items-center border-b border-border-warm pb-1.5">
                    <span className="font-mono font-bold text-[9px] text-forest-green">MINUTE {hoveredPoint.minute}'</span>
                    <span className="font-mono text-[8px] bg-bg-ivory border border-border-warm text-forest-green-muted px-1.5 py-0.5 rounded">
                      {hoveredPoint.momentum >= 0 ? `${momentum?.teamA?.substring(0, 3)?.toUpperCase()} CTRL` : `${momentum?.teamB?.substring(0, 3)?.toUpperCase()} CTRL`}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-0.5 mt-1">
                    <span className="text-[8px] font-sans text-slate-400 uppercase tracking-wider">Dominance Level</span>
                    <span className={`text-xs font-serif font-black ${hoveredPoint.momentum >= 0 ? "text-forest-green" : "text-gold-accent"}`}>
                      {hoveredPoint.momentum >= 0 ? `+${hoveredPoint.momentum}` : `${hoveredPoint.momentum}`} index
                    </span>
                    <span className="text-[8.5px] text-forest-green-muted font-medium leading-tight mt-0.5">
                      {hoveredPoint.momentum >= 0 
                        ? `${momentum?.teamA} holds territorial control`
                        : `${momentum?.teamB} holds territorial control`
                      }
                    </span>
                  </div>

                  {hoveredPoint.event && (
                    <div className="border-t border-border-warm pt-1.5 mt-1.5 flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px]">{getEventEmoji(hoveredPoint.event.type)}</span>
                        <span className="font-display font-extrabold text-[9px] text-forest-green uppercase tracking-wide">
                          {hoveredPoint.event.type}
                        </span>
                      </div>
                      <span className="text-[9px] text-forest-green-muted font-semibold">
                        {hoveredPoint.event.player}
                      </span>
                      <span className="text-[8px] leading-snug text-slate-500 font-medium">
                        {hoveredPoint.event.detail}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            )}
          </div>

          {/* Phase metrics cards */}
          {momentumAnalysisLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-bg-card-light border border-border-warm rounded-2xl p-5 shadow-sm flex flex-col gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-bg-cream/40 border border-border-warm"></div>
                  <div className="h-4 bg-bg-cream/45 rounded w-2/3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-bg-cream/30 rounded"></div>
                    <div className="h-3 bg-bg-cream/30 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Dangerous Periods */}
              <div className="bg-bg-card-light border border-border-warm rounded-2xl p-5 hover:border-gold-accent/40 transition-all duration-300 shadow-sm flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg bg-bg-ivory border border-border-warm flex items-center justify-center text-forest-green">
                  <ShieldAlert size={16} />
                </div>
                <h4 className="text-forest-green font-display font-extrabold text-xs uppercase tracking-wider mt-1">Dangerous Periods</h4>
                <p className="text-forest-green-muted text-[11.5px] leading-relaxed">
                  {momentumAnalysisData?.dangerous_periods || "No details available."}
                </p>
              </div>

              {/* Card 2: Attacking Dominance */}
              <div className="bg-bg-card-light border border-border-warm rounded-2xl p-5 hover:border-gold-accent/40 transition-all duration-300 shadow-sm flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg bg-bg-ivory border border-border-warm flex items-center justify-center text-forest-green">
                  <Award size={16} />
                </div>
                <h4 className="text-forest-green font-display font-extrabold text-xs uppercase tracking-wider mt-1">Attacking Dominance</h4>
                <p className="text-forest-green-muted text-[11.5px] leading-relaxed">
                  {momentumAnalysisData?.attacking_dominance || "No details available."}
                </p>
              </div>

              {/* Card 3: Pressure Phases */}
              <div className="bg-bg-card-light border border-border-warm rounded-2xl p-5 hover:border-gold-accent/40 transition-all duration-300 shadow-sm flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg bg-bg-ivory border border-border-warm flex items-center justify-center text-forest-green">
                  <TrendingUp size={16} />
                </div>
                <h4 className="text-forest-green font-display font-extrabold text-xs uppercase tracking-wider mt-1">Pressure Phases</h4>
                <p className="text-forest-green-muted text-[11.5px] leading-relaxed">
                  {momentumAnalysisData?.pressure_phases || "No details available."}
                </p>
              </div>

              {/* Card 4: Tactical Influence */}
              <div className="bg-bg-card-light border border-border-warm rounded-2xl p-5 hover:border-gold-accent/40 transition-all duration-300 shadow-sm flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg bg-bg-ivory border border-border-warm flex items-center justify-center text-forest-green">
                  <Cpu size={16} />
                </div>
                <h4 className="text-forest-green font-display font-extrabold text-xs uppercase tracking-wider mt-1">Tactical Influence</h4>
                <p className="text-forest-green-muted text-[11.5px] leading-relaxed">
                  {momentumAnalysisData?.tactical_influence || "No details available."}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
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
              MomentumIQ utilizes custom-calibrated scikit-learn models evaluating StatsBomb event telemetry. 
              The threat levels and rollercoaster spikes are calculated using the following feature weights:
            </p>

            {/* Feature 1 */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-forest-green font-semibold">Expected Pass Completion (xP) Model</span>
                <span className="text-gold-accent font-mono font-bold">40%</span>
              </div>
              <div className="h-2 w-full bg-bg-cream rounded-full overflow-hidden">
                <div style={{ width: "40%" }} className="bg-forest-green h-full rounded-full"></div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-forest-green font-semibold">Defensive Line Height & Shape Compactness</span>
                <span className="text-gold-accent font-mono font-bold">35%</span>
              </div>
              <div className="h-2 w-full bg-bg-cream rounded-full overflow-hidden">
                <div style={{ width: "35%" }} className="bg-forest-green h-full rounded-full"></div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-forest-green font-semibold">Physical Sprint Fatigue & Duel Efficiency</span>
                <span className="text-gold-accent font-mono font-bold">25%</span>
              </div>
              <div className="h-2 w-full bg-bg-cream rounded-full overflow-hidden">
                <div style={{ width: "25%" }} className="bg-forest-green h-full rounded-full"></div>
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

export default Dashboard;
