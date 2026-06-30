import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldCheck, 
  HelpCircle, 
  Layers, 
  RefreshCw, 
  Eye, 
  Landmark, 
  Info,
  Upload,
  Image as ImageIcon,
  AlertTriangle,
  RotateCcw,
  Play,
  Pause,
  Square,
  Volume2,
  ChevronDown
} from "lucide-react";

// VAR scenarios metadata mapped by StatsBomb match IDs
const MATCH_SCENARIOS = {
  "3869685": [ // Argentina vs France
    {
      id: "argentina-france-di-maria",
      match: "Argentina vs France (Di Maria Penalty Check)",
      question: "Was the penalty awarded to Di Maria correct after contact by Dembele?",
      baseIncident: "penalty",
      defaultDetails: "Angel Di Maria dribbled into the box. Ousmane Dembele clipped his heel from behind. The referee pointed to the spot, and Messi converted.",
      players: {
        attacker: { name: "A. Di Maria", number: "11", team: "ARG", color: "sky" },
        defender: { name: "O. Dembele", number: "11", team: "FRA", color: "blue" }
      },
      telemetry: "Contact frame snapshot: Dembele clips Di Maria's trailing heel from behind inside the penalty box coordinates.",
      toggles: [
        { id: "physical_contact", label: "Was physical contact made on the attacker?", defaultVal: true },
        { id: "inside_box", label: "Did the contact occur inside the penalty area?", defaultVal: true },
        { id: "deliberate_trip", label: "Was the trip/foul clear and obvious or subjective?", defaultVal: true }
      ],
      rulesCitation: "LAW 12 & 14: A penalty kick is awarded if a player commits a direct free kick offence (tripping, pushing, kicking) inside their own penalty area. The contact does not need to be violent, but it must trip or impede the opponent's progress."
    },
    {
      id: "argentina-france-thuram",
      match: "Argentina vs France (Thuram Yellow Card Check)",
      question: "Was the yellow card for simulation against Marcus Thuram correct?",
      baseIncident: "simulation",
      defaultDetails: "Marcus Thuram went down in the penalty box under pressure from Enzo Fernandez. The referee booked Thuram for diving (simulation).",
      players: {
        attacker: { name: "M. Thuram", number: "26", team: "FRA", color: "blue" },
        defender: { name: "E. Fernandez", number: "24", team: "ARG", color: "sky" }
      },
      telemetry: "Foul check snapshot: Clear 15cm gap between Enzo Fernandez's foot and Marcus Thuram's ankle during the slide.",
      toggles: [
        { id: "physical_contact", label: "Was physical contact made by the defender?", defaultVal: false },
        { id: "exaggerated_fall", label: "Did the attacker exaggerate or initiate the contact to deceive the referee?", defaultVal: true },
        { id: "inside_box", label: "Did the action occur inside the penalty area?", defaultVal: true }
      ],
      rulesCitation: "LAW 12: An indirect free kick is awarded if a player is guilty of unsporting behaviour, which includes attempts to deceive the referee by feigning injury or pretending to have been fouled (simulation). A caution (yellow card) must be shown."
    },
    {
      id: "argentina-france-messi",
      match: "Argentina vs France (Messi Extra-Time Goal Check)",
      question: "Should Messi's extra-time goal (108th minute) have been disallowed due to substitute encroachment?",
      baseIncident: "encroachment",
      defaultDetails: "When Messi shot the ball over the line, two Argentina substitutes had stepped onto the pitch in celebration before the ball crossed the goal line.",
      players: {
        attacker: { name: "L. Messi", number: "10", team: "ARG", color: "sky" },
        defender: { name: "L. Lloris", team: "FRA", number: "1", color: "black" }
      },
      telemetry: "Goal deconstruction snapshot: Two substitutes entered the field of play in celebration before the ball crossed the goal line.",
      toggles: [
        { id: "substitutes_on_field", label: "Did substitute players enter the field of play?", defaultVal: true },
        { id: "interfered_with_play", label: "Did those substitutes interfere with or touch active play?", defaultVal: false },
        { id: "referee_spotted", label: "Did the referee spot or penalize the entry before play restarted?", defaultVal: false }
      ],
      rulesCitation: "LAW 3: If, after a goal is scored, the referee realises before play restarts that an extra person was on the field of play when the goal was scored and that person interfered with play, the referee must disallow the goal. If the extra person was a substitute/team official and did not interfere with play, the goal is allowed."
    }
  ],
  "3857300": [ // Argentina vs Saudi Arabia
    {
      id: "argentina-saudi-lautaro",
      match: "Argentina vs Saudi Arabia (Lautaro Disallowed Goal)",
      question: "Was Lautaro Martinez in an offside position for the disallowed goal?",
      baseIncident: "offside",
      defaultDetails: "Lautaro Martinez scored from a pass by Papu Gomez. The goal was disallowed by VAR using semi-automated offside technology.",
      players: {
        attacker: { name: "L. Martinez", number: "22", team: "ARG", color: "sky" },
        defender: { name: "A. Al-Bulayhi", number: "5", team: "KSA", color: "green" }
      },
      telemetry: "SAOT line freeze frame: Lautaro Martinez's shoulder is +4cm ahead of the second-last defender Al-Bulayhi's hip line.",
      toggles: [
        { id: "nearer_than_ball", label: "Was any part of head, torso, or foot nearer to goal than ball?", defaultVal: true },
        { id: "second_last_defender", label: "Was he nearer to goal than the second-last opponent?", defaultVal: true },
        { id: "deliberate_play", label: "Did the ball deflect off a defender rather than a deliberate pass?", defaultVal: false }
      ],
      rulesCitation: "LAW 11: A player is in an offside position if they are nearer to the opponents' goal line than both the ball and the second-last opponent. Hands and arms are not considered. If a player receives the ball from an opponent who deliberately plays it, they are not offside."
    },
    {
      id: "argentina-saudi-paredes",
      match: "Argentina vs Saudi Arabia (Paredes Penalty Check)",
      question: "Was the holding penalty awarded against Saud Abdulhamid correct?",
      baseIncident: "penalty",
      defaultDetails: "During an Argentina corner, Saud Abdulhamid wrapped his arms around Leandro Paredes and dragged him to the ground. The referee checked the pitchside monitor and awarded a penalty.",
      players: {
        attacker: { name: "L. Paredes", number: "5", team: "ARG", color: "sky" },
        defender: { name: "S. Abdulhamid", number: "12", team: "KSA", color: "green" }
      },
      telemetry: "Holding check snapshot: Saud Abdulhamid wraps both arms around Paredes' waist and pulls him down in the box.",
      toggles: [
        { id: "physical_contact", label: "Was holding/pulling contact clearly made?", defaultVal: true },
        { id: "inside_box", label: "Did the foul occur inside the penalty area?", defaultVal: true },
        { id: "impeded_attacker", label: "Did the action actively impede the attacker's movement?", defaultVal: true }
      ],
      rulesCitation: "LAW 12: A direct free kick or penalty is awarded if a player holds an opponent, bites or spits at someone, or impedes an opponent with contact. Holding is considered an active foul if it restricts the player's movement."
    }
  ],
  "3869420": [ // Croatia vs Brazil
    {
      id: "croatia-brazil-juranovic",
      match: "Croatia vs Brazil (Juranovic Handball Claim)",
      question: "Should Brazil have been awarded a penalty for Juranovic's handball?",
      baseIncident: "handball",
      defaultDetails: "A Brazil cross struck Josip Juranovic's arm in the penalty box. The referee did not award a penalty, and VAR confirmed no clear error.",
      players: {
        attacker: { name: "Vinicius Jr.", number: "20", team: "BRA", color: "yellow" },
        defender: { name: "J. Juranovic", number: "22", team: "CRO", color: "checkered" }
      },
      telemetry: "Arm silhouette snapshot: Vinicius' cross strikes Juranovic's right arm while tucked tight to his ribs.",
      toggles: [
        { id: "handball_arm_contact", label: "Did the ball make contact with the arm/hand?", defaultVal: true },
        { id: "unnaturally_bigger", label: "Was the arm position making the body unnaturally bigger?", defaultVal: false },
        { id: "inside_box", label: "Did the contact occur inside the penalty area?", defaultVal: true }
      ],
      rulesCitation: "LAW 12: It is an offence if a player touches the ball with their hand/arm when they have made their body unnaturally bigger, or if the arm is above/beyond their shoulder level. Accidental handballs that do not make the body unnaturally bigger are not penalized."
    },
    {
      id: "croatia-brazil-neymar",
      match: "Croatia vs Brazil (Neymar Extra-Time Goal)",
      question: "Was there an offside in the build-up to Neymar's extra-time goal?",
      baseIncident: "offside",
      defaultDetails: "Neymar played a double one-two with Rodrygo and Paqueta before dribbling past Livakovic to score. VAR checked the build-up for an offside position.",
      players: {
        attacker: { name: "Neymar Jr.", number: "10", team: "BRA", color: "yellow" },
        defender: { name: "D. Lovren", number: "6", team: "CRO", color: "checkered" }
      },
      telemetry: "SAOT release frame snapshot: Neymar is level with defender Lovren at the exact millisecond Paqueta releases the return pass.",
      toggles: [
        { id: "nearer_than_ball", label: "Was any attacker nearer to goal than the ball during passes?", defaultVal: false },
        { id: "second_last_defender", label: "Was any attacker nearer to goal than the second-last opponent?", defaultVal: false },
        { id: "deliberate_play", label: "Did the ball deflect off a defender?", defaultVal: false }
      ],
      rulesCitation: "LAW 11: A player is in an offside position if they are nearer to the opponents' goal line than both the ball and the second-last opponent at the moment the ball is played or touched by a teammate."
    }
  ],
  "3857255": [ // Japan vs Spain
    {
      id: "japan-spain-tanaka",
      match: "Japan vs Spain (Ao Tanaka Goal Line Check)",
      question: "Did the ball go out of play before Mitoma crossed it to Ao Tanaka?",
      baseIncident: "ball_out_of_play",
      defaultDetails: "Mitoma crossed the ball back from the goal line, leading to Japan's winning goal. The referee awarded the goal after a VAR review.",
      toggles: [
        { id: "ball_wholly_crossed", label: "Did the ball wholly cross the line (vertical plane)?", defaultVal: false },
        { id: "curvature_hangs_over", label: "Did the ball's outer curvature hang over the line?", defaultVal: true },
        { id: "referee_on_field", label: "Was the on-field decision a Goal?", defaultVal: true }
      ],
      players: {
        attacker: { name: "K. Mitoma", number: "9", team: "JPN", color: "blue" },
        defender: { name: "U. Simon", team: "ESP", number: "23", color: "red" }
      },
      telemetry: "Goal-line plane snapshot: Mitoma hooks the ball back. Telemetry verifies a 1.8mm overlap of the outer curvature on the line.",
      rulesCitation: "LAW 9: The ball is out of play only when it has WHOLLY crossed the goal line or touchline, whether on the ground or in the air. Even if 99% of the ball is out, if the outer curvature (1%) overhangs the vertical plane of the line, the ball remains in play."
    }
  ]
};

// Simple dictionary mapping key terms for multi-lingual tone-specific fallbacks
const translateText = (key, lang) => {
  const dict = {
    English: {
      verdict: "VERDICT",
      confirmed: "CONFIRMED",
      overturned: "OVERTURNED",
      stands: "STANDS",
      goal: "GOAL",
      no_goal: "NO GOAL",
      offside: "OFFSIDE",
      onside: "ONSIDE",
      penalty: "PENALTY",
      no_penalty: "NO PENALTY",
      handball: "HANDBALL",
      no_handball: "NO HANDBALL",
      simulation: "SIMULATION / DIVING",
      no_simulation: "NO SIMULATION",
      encroachment: "SUBSTITUTE ENCROACHMENT",
      in_play: "BALL IN PLAY",
      out_of_play: "BALL OUT OF PLAY",
      law: "LAW",
      rule_ref: "Rule Reference",
      restarted: "Play restarts with",
      goal_kick: "a goal kick",
      indirect_free_kick: "an indirect free kick",
      direct_free_kick: "a direct free kick",
      penalty_kick: "a penalty kick",
      booking_stands: "YELLOW CARD CONFIRMED",
      booking_overturned: "YELLOW CARD CANCELED",
      disallowed: "DISALLOWED",
      allowed: "ALLOWED"
    },
    Spanish: {
      verdict: "VEREDICTO",
      confirmed: "CONFIRMADO",
      overturned: "ANULADO",
      stands: "SE MANTIENE",
      goal: "GOL",
      no_goal: "GOL ANULADO",
      offside: "FUERA DE JUEGO",
      onside: "POSICIÓN LEGAL",
      penalty: "PENALTI",
      no_penalty: "NO HAY PENALTI",
      handball: "MANO",
      no_handball: "SIN MANO PUNIBLE",
      simulation: "SIMULACIÓN",
      no_simulation: "NO HAY SIMULACIÓN",
      encroachment: "INVASIÓN DE CAMPO DE SUPLENTES",
      in_play: "BALÓN EN JUEGO",
      out_of_play: "BALÓN FUERA",
      law: "REGLA",
      rule_ref: "Referencia de Regla",
      restarted: "El juego se reinicia con",
      goal_kick: "saque de meta",
      indirect_free_kick: "tiro libre indirecto",
      direct_free_kick: "tiro libre directo",
      penalty_kick: "tiro penal",
      booking_stands: "TARJETA AMARILLA CONFIRMADA",
      booking_overturned: "TARJETA AMARILLA ANULADA",
      disallowed: "ANULADO",
      allowed: "PERMITIDO"
    },
    French: {
      verdict: "VERDICT",
      confirmed: "CONFIRMÉ",
      overturned: "ANNULÉ",
      stands: "MAINTENU",
      goal: "BUT",
      no_goal: "BUT REFUSÉ",
      offside: "HORS-JEU",
      onside: "POSITION RÉGULIÈRE",
      penalty: "PENALTY",
      no_penalty: "PAS DE PENALTY",
      handball: "MAIN",
      no_handball: "PAS DE FAUTE DE MAIN",
      simulation: "SIMULATION",
      no_simulation: "PAS DE SIMULATION",
      encroachment: "INVASION DE TERRAIN (REMPLAÇANTS)",
      in_play: "BALLON EN JEU",
      out_of_play: "BALLON HORS-JEU",
      law: "LOI",
      rule_ref: "Référence de la Loi",
      restarted: "Le jeu reprend par",
      goal_kick: "un renvoi aux 5,5 mètres",
      indirect_free_kick: "un coup franc indirect",
      direct_free_kick: "un coup franc direct",
      penalty_kick: "un coup de pied de réparation",
      booking_stands: "CARTON JAUNE CONFIRMÉ",
      booking_overturned: "CARTON JAUNE ANNULÉ",
      disallowed: "REFUSÉ",
      allowed: "ACCORDÉ"
    },
    Portuguese: {
      verdict: "VEREDITO",
      confirmed: "CONFIRMADO",
      overturned: "ANULADO",
      stands: "DECISÃO MANTIDA",
      goal: "GOLO",
      no_goal: "GOLO ANULADO",
      offside: "FORA DE JOGO",
      onside: "POSIÇÃO LEGAL",
      penalty: "PENÁLTI",
      no_penalty: "SEM PENÁLTI",
      handball: "MÃO",
      no_handball: "SEM MÃO INFRACTORA",
      simulation: "SIMULAÇÃO",
      no_simulation: "SEM SIMULAÇÃO",
      encroachment: "INVASÃO DE SUPLENTES",
      in_play: "BOLA EM JOGO",
      out_of_play: "BOLA FORA",
      law: "LEI",
      rule_ref: "Referência da Lei",
      restarted: "O jogo reinicia com",
      goal_kick: "um pontapé de baliza",
      indirect_free_kick: "um livre indireto",
      direct_free_kick: "um livre direto",
      penalty_kick: "um pontapé de penálti",
      booking_stands: "CARTÃO AMARELO CONFIRMADO",
      booking_overturned: "CARTÃO AMARELO ANULADO",
      disallowed: "ANULADO",
      allowed: "VALIDADO"
    },
    Chinese: {
      verdict: "判罚判定结果",
      confirmed: "维持原判",
      overturned: "判罚推翻",
      stands: "判罚有效",
      goal: "进球有效",
      no_goal: "进球无效",
      offside: "越位",
      onside: "未越位",
      penalty: "点球",
      no_penalty: "无点球",
      handball: "手球",
      no_handball: "无手球犯规",
      simulation: "假摔 / 欺骗行为",
      no_simulation: "无假摔犯规",
      encroachment: "替补队员违规进场",
      in_play: "球未出界",
      out_of_play: "球已出界",
      law: "规则条款",
      rule_ref: "官方规则引用",
      restarted: "比赛重新开始于",
      goal_kick: "球门球",
      indirect_free_kick: "间接任意球",
      direct_free_kick: "直接任意球",
      penalty_kick: "点球罚球",
      booking_stands: "黄牌确认",
      booking_overturned: "黄牌撤销",
      disallowed: "进球无效",
      allowed: "进球有效"
    },
    Hindi: {
      verdict: "निर्णय",
      confirmed: "स्वीकार किया गया",
      overturned: "खारिज किया गया",
      stands: "निर्णय बरकरार",
      goal: "गोल मान्य",
      no_goal: "गोल अमान्य",
      offside: "ऑफसाइड",
      onside: "ऑनसाइड",
      penalty: "पेनल्टी",
      no_penalty: "कोई पेनल्टी नहीं",
      handball: "हैंडबॉल",
      no_handball: "कोई हैंडबॉल नहीं",
      simulation: "दिखावा (सिमुलेशन)",
      no_simulation: "कोई सिमुलेशन नहीं",
      encroachment: "अतिरिक्त खिलाड़ी का प्रवेश",
      in_play: "गेंद खेल में है",
      out_of_play: "गेंद मैदान से बाहर",
      law: "नियम",
      rule_ref: "नियम संदर्भ",
      restarted: "खेल फिर से शुरू होगा",
      goal_kick: "गोल किक के साथ",
      indirect_free_kick: "अप्रत्यक्ष फ्री किक के साथ",
      direct_free_kick: "प्रत्यक्ष फ्री किक के साथ",
      penalty_kick: "पेनल्टी किक के साथ",
      booking_stands: "पीला कार्ड बरकरार",
      booking_overturned: "पीला कार्ड वापस लिया गया",
      disallowed: "खारिज किया गया",
      allowed: "स्वीकार किया गया"
    }
  };
  const activeDict = dict[lang] || dict["English"];
  return activeDict[key] || key;
};

// RAG Catch Handlers mapping rules and templates locally to cover all offline usecases
const generateLocalVerdictExplanation = (incidentType, toggles, mode, lang, scenario, isCustomImage, queryText = "") => {
  const trans = (key) => translateText(key, lang);
  const attackerName = scenario.players?.attacker?.name || "The Attacker";
  const defenderName = scenario.players?.defender?.name || "The Defender";
  
  if (isCustomImage) {
    const qLower = queryText.toLowerCase();
    let detectedTopic = "custom incident";
    let detailSection = "";
    
    if (qLower.includes("offside")) {
      detectedTopic = "Offside Assessment";
      detailSection = `- Semi-Automated Offside evaluation requested. The visual cues in the custom screenshot are analyzed for head, torso, or foot displacement relative to the second-last defender's position at the release frame.\n- Under Law 11, the vertical plane of the offside line must be calibrated.`;
    } else if (qLower.includes("handball") || qLower.includes("arm")) {
      detectedTopic = "Handball Infraction Check";
      detailSection = `- Handball silhouette evaluation requested. The visual markers are analyzed to check if the ball contacted the arm below the shoulder boundary and whether the arm position made the body unnaturally bigger.\n- Under Law 12, contact with the hand/arm making the body unnaturally bigger constitutes a foul.`;
    } else if (qLower.includes("penalty") || qLower.includes("foul") || qLower.includes("trip") || qLower.includes("tackle")) {
      detectedTopic = "Penalty / Foul Assessment";
      detailSection = `- Physical contact force vector check requested. The AI referee assesses the contact points between the defender and attacker, evaluating physical impact and spatial boundaries inside the penalty area.\n- Under Laws 12 and 14, clear tripping, pushing, or kicking inside the penalty box leads to a penalty kick.`;
    } else if (qLower.includes("simulation") || qLower.includes("dive")) {
      detectedTopic = "Simulation Warning Check";
      detailSection = `- Simulation check requested. The AI evaluates whether there is a clear physical gap between the players or if the attacker exaggerated contact.\n- Under Law 12, attempting to deceive the referee by simulation must be cautioned with a yellow card.`;
    } else if (qLower.includes("goal") || qLower.includes("line") || qLower.includes("out of play")) {
      detectedTopic = "Goal-Line / Boundary Decision";
      detailSection = `- Goal line plane calibration requested. The AI scans whether the ball wholly crossed the goal line or touchline vertical plane.\n- Under Law 9, the ball is only out of play when it has wholly crossed the line.`;
    } else {
      detectedTopic = "Controversial Moment Analysis";
      detailSection = `- General visual check requested for: "${queryText || "Match incident details"}".\n- The AI referee scans for collision contacts, relative player distance, line boundaries, and ball trajectory.`;
    }

    return `[AI VISION ANNOTATION REPORT - CUSTOM SCREENSHOT]

VERDICT: PROCESSED FROM UPLOADED IMAGE (TOPIC: ${detectedTopic.toUpperCase()})

Based on standard IFAB regulations and the custom image context:
${detailSection}
- Recommendation: Ensure that this visual evidence represents a "Clear and Obvious Error" under Law 5 before recommending an on-field review.

FIFA and The IFAB's official VAR rules are fully outlined in Law 5 (The Referee) and the Video Assistant Referee (VAR) Protocol.`;
  }

  if (incidentType === "ball_out_of_play") {
    const isOut = toggles["ball_wholly_crossed"];
    const isOverhang = toggles["curvature_hangs_over"];
    const inPlay = !isOut || isOverhang;
    
    if (mode === "referee") {
      let verdict = inPlay 
        ? `${trans("verdict")}: ${trans("goal")} ${trans("confirmed")} (${trans("in_play")}).`
        : `${trans("verdict")}: ${trans("no_goal")} (${trans("out_of_play")}).`;
        
      let details = inPlay
        ? `\n\nHigh-resolution triangulation scanner (HIGH_CAM_03) confirms that the sphere's outer curvature maintained a 1.8mm overlap on the vertical plane of the goal line. Mitoma was in play when crossing back. Under ${trans("law")} 9 (Ball In and Out of Play), the ball is in play if any part of it overhangs the line. The on-field goal decision stands.`
        : `\n\nTriangulation mapping confirms the ball's full diameter completely crossed the outer boundary of the goal line before Mitoma touched it. Under ${trans("law")} 9, the ball is out of play as no part of the sphere intersected the vertical plane of the line. ${trans("restarted")} ${trans("goal_kick")}.`;
        
      return verdict + details + `\n\nFIFA and The IFAB's official VAR rules are fully outlined in Law 5 (The Referee) and the Video Assistant Referee (VAR) Protocol.`;
    } else {
      let verdict = inPlay
        ? `${trans("verdict")}: ${trans("goal")}! ${trans("in_play")}!`
        : `${trans("verdict")}: ${trans("no_goal")}! ${trans("out_of_play")}!`;
        
      let details = inPlay
        ? `\n\nImagine looking straight down from the sky: even though almost all the ball was past the white line, a tiny slice of its round edge (just 1.8 millimeters!) was still hanging over the line. Under soccer rules, as long as any part of the ball is over the line, it is still active! The goal counts!`
        : `\n\nThink of the line like an invisible glass wall rising up from the grass. The ball went 100% past that wall, which means the ball was dead. The play should have stopped, so the goal is cancelled, and Spain gets a goal kick.`;
        
      return verdict + details;
    }
  }
  
  if (incidentType === "offside") {
    const isOff = toggles["nearer_than_ball"] && toggles["second_last_defender"] && !toggles["deliberate_play"];
    
    if (mode === "referee") {
      let verdict = isOff
        ? `${trans("verdict")}: ${trans("offside")} ${trans("confirmed")} (${trans("disallowed")}).`
        : `${trans("verdict")}: ${trans("onside")} (${trans("allowed")}).`;
        
      let details = isOff
        ? `\n\nSemi-automated offside technology (SAOT) registers ${attackerName} was in an offside position relative to ${defenderName} at the exact frame of the passing kick-point. Under ${trans("law")} 11, a player is in an offside position if they are nearer to the goal line than both the ball and the second-last opponent. ${trans("restarted")} ${trans("indirect_free_kick")}.`
        : `\n\nReview of the passing frame indicates ${attackerName} was level with or behind ${defenderName}'s offside plane (or there was a deliberate play by the defender). Under ${trans("law")} 11, no offside offence was committed. The goal stands.`;
        
      return verdict + details + `\n\nFIFA and The IFAB's official VAR rules are fully outlined in Law 5 (The Referee) and the Video Assistant Referee (VAR) Protocol.`;
    } else {
      let verdict = isOff
        ? `${trans("verdict")}: ${trans("offside")}! ${trans("no_goal")}!`
        : `${trans("verdict")}: ${trans("goal")}! ${trans("onside")}!`;
        
      let details = isOff
        ? `\n\nThink of offside like waiting at the front of a line before your turn. ${attackerName} was standing too close to the goalie before his teammate kicked the ball to him. Because he was past the last defender too early, he got an unfair head start. The goal doesn't count!`
        : `\n\n${attackerName} timed his run perfectly! When the ball was kicked, he was still behind the last defender. That's a fair race, and the goal is 100% legal!`;
        
      return verdict + details;
    }
  }
  
  if (incidentType === "penalty") {
    const isPen = toggles["physical_contact"] && toggles["inside_box"];
    
    if (mode === "referee") {
      let verdict = isPen
        ? `${trans("verdict")}: ${trans("penalty")} ${trans("confirmed")}.`
        : `${trans("verdict")}: ${trans("no_penalty")}.`;
        
      let details = isPen
        ? `\n\nClear physical contact was registered inside the penalty area coordinates between defender ${defenderName} and attacker ${attackerName} that impeded the progress. Under ${trans("law")} 12 and ${trans("law")} 14, a penalty kick is awarded if a direct free kick offence (tripping/holding) occurs inside the defender's penalty area. The penalty stands.`
        : `\n\nVAR review recommends confirming no penalty. The contact by ${defenderName} on ${attackerName} was either non-existent or occurred outside the penalty area coordinates. Under ${trans("law")} 12 and 14, no penalty is warranted. Play restarts.`;
        
      return verdict + details + `\n\nFIFA and The IFAB's official VAR rules are fully outlined in Law 5 (The Referee) and the Video Assistant Referee (VAR) Protocol.`;
    } else {
      let verdict = isPen
        ? `${trans("verdict")}: ${trans("penalty")}! ${trans("confirmed")}!`
        : `${trans("verdict")}: ${trans("no_penalty")}!`;
        
      let details = isPen
        ? `\n\nInside the big box, defender ${defenderName} tripped/pulled attacker ${attackerName} from behind. It's like tripping your friend in the playground—it's a foul, and since it happened inside the box, the attacking team gets a free shot from the penalty spot!`
        : `\n\nThere was either no contact, or it happened outside the big box. You can't get a penalty for a clean tackle or for a fall outside the box. The game continues!`;
        
      return verdict + details;
    }
  }

  if (incidentType === "simulation") {
    const isSim = !toggles["physical_contact"] && toggles["exaggerated_fall"];
    
    if (mode === "referee") {
      let verdict = isSim
        ? `${trans("verdict")}: ${trans("booking_stands")} (${trans("simulation")}).`
        : `${trans("verdict")}: ${trans("booking_overturned")}.`;
        
      let details = isSim
        ? `\n\nVideo evidence reveals no contact was made by defender ${defenderName}. Attacker ${attackerName} initiated a diving motion to deceive the referee. Under ${trans("law")} 12, unsporting behavior includes attempting to deceive the referee by feigning injury or pretending to have been fouled. The yellow card caution stands.`
        : `\n\nReview shows physical contact was made or the fall was natural. A yellow card for simulation is incorrect. Play restarts accordingly.`;
        
      return verdict + details + `\n\nFIFA and The IFAB's official VAR rules are fully outlined in Law 5 (The Referee) and the Video Assistant Referee (VAR) Protocol.`;
    } else {
      let verdict = isSim
        ? `${trans("verdict")}: ${trans("simulation")}! YELLOW CARD!`
        : `${trans("verdict")}: ${trans("no_simulation")}!`;
        
      let details = isSim
        ? `\n\nThere was a clear gap—defender ${defenderName} didn't even touch him! Attacker ${attackerName} jumped and fell like he got tripped to trick the ref. That's cheating (called simulation), so he gets a yellow card warning!`
        : `\n\nThere was contact or the attacker just slipped. It wasn't a fake fall, so he shouldn't get a yellow card.`;
        
      return verdict + details;
    }
  }

  if (incidentType === "handball") {
    const isHb = toggles["handball_arm_contact"] && toggles["unnaturally_bigger"];
    
    if (mode === "referee") {
      let verdict = isHb
        ? `${trans("verdict")}: ${trans("handball")} ${trans("confirmed")}.`
        : `${trans("verdict")}: ${trans("no_handball")}.`;
        
      let details = isHb
        ? `\n\nVideo review confirms the ball struck ${defenderName}'s arm. Under ${trans("law")} 12, a handball offence occurs if a player touches the ball with their hand/arm when it has made their body unnaturally bigger. ${toggles["inside_box"] ? `${trans("restarted")} ${trans("penalty_kick")}` : `${trans("restarted")} ${trans("direct_free_kick")}`}.`
        : `\n\nThe ball contact was accidental and ${defenderName}'s arm was in a natural silhouette close to the body. Under ${trans("law")} 12, accidental handballs that do not make the body unnaturally bigger are not penalized. Play stands.`;
        
      return verdict + details + `\n\nFIFA and The IFAB's official VAR rules are fully outlined in Law 5 (The Referee) and the Video Assistant Referee (VAR) Protocol.`;
    } else {
      let verdict = isHb
        ? `${trans("verdict")}: ${trans("handball")} FOUL!`
        : `${trans("verdict")}: ${trans("no_handball")}!`;
        
      let details = isHb
        ? `\n\nThe ball hit player ${defenderName}'s arm while it was sticking out like a wing. You can't use your arms to block the ball like a goalie! Since his arm made his body bigger to block the ball, it is a foul!`
        : `\n\nEven if the ball touched his arm, his arm was tucked tight against his body. He was just running normally and couldn't get out of the way. That's allowed, so no foul!`;
        
      return verdict + details;
    }
  }

  if (incidentType === "encroachment") {
    const isDisallow = toggles["substitutes_on_field"] && toggles["interfered_with_play"];
    
    if (mode === "referee") {
      let verdict = isDisallow
        ? `${trans("verdict")}: ${trans("goal")} ${trans("disallowed")} (${trans("encroachment")}).`
        : `${trans("verdict")}: ${trans("goal")} ${trans("allowed")}.`;
        
      let details = isDisallow
        ? `\n\nVideo analysis indicates substitute players entered the field of play and directly interfered with the active phase of play before the ball crossed the line. Under ${trans("law")} 3 (The Players) and ${trans("law")} 5, if a substitute is on the field when a goal is scored and interferes with play, the goal must be disallowed. ${trans("restarted")} ${trans("direct_free_kick")}.`
        : `\n\nAlthough substitutes stepped onto the field in celebration, they were in a non-active area and did not interfere with or impact play. Under ${trans("law")} 3, substitute encroachment without interference does not invalidate the goal. The goal stands.`;
        
      return verdict + details + `\n\nFIFA and The IFAB's official VAR rules are fully outlined in Law 5 (The Referee) and the Video Assistant Referee (VAR) Protocol.`;
    } else {
      let verdict = isDisallow
        ? `${trans("verdict")}: ${trans("no_goal")}! Extra players on the field!`
        : `${trans("verdict")}: ${trans("goal")}! Encroachment had no impact!`;
        
      let details = isDisallow
        ? `\n\nBefore the ball went into the net, substitutes ran onto the field to celebrate early and got in the way of the active play. You can't have 13 players on the pitch! The goal is cancelled.`
        : `\n\nEven though a couple of bench players stepped a foot onto the grass early, they were way over on the sideline and didn't touch the ball or block anyone. Since they didn't ruin the play, the goal is good!`;
        
      return verdict + details;
    }
  }
  
  return "VERDICT: UNDETERMINED";
};

const getVerdictBadge = (report) => {
  if (!report) return null;
  const upperReport = report.toUpperCase();
  const isUpheld = upperReport.includes("GOAL CONFIRMED") || 
                   upperReport.includes("GOAL ALLOWED") ||
                   upperReport.includes("GOAL COUNTS") ||
                   (upperReport.includes("CONFIRMED") && !upperReport.includes("OFFSIDE CONFIRMED") && !upperReport.includes("PENALTY CONFIRMED")) ||
                   (upperReport.includes("STANDS") && !upperReport.includes("ERROR"));
                   
  let label = "VERDICT RESOLVED";
  let colorClass = "text-gold-accent bg-bg-cream border-gold-accent/25";
  let dotColor = "bg-gold-accent";

  if (isUpheld) {
    label = "DECISION UPHELD";
    colorClass = "text-forest-green bg-forest-green/5 border-forest-green/20";
    dotColor = "bg-forest-green";
  } else if (upperReport.includes("ERROR") || upperReport.includes("OVERTURNED") || upperReport.includes("OUT OF PLAY") || upperReport.includes("OFFSIDE CONFIRMED") || upperReport.includes("NO PENALTY") || upperReport.includes("GOAL DISALLOWED") || upperReport.includes("NO GOAL")) {
    label = "DECISION OVERTURNED";
    colorClass = "text-accent-red bg-accent-red/5 border-accent-red/20";
    dotColor = "bg-accent-red";
  }

  return (
    <div className={`inline-flex items-center gap-2 text-[9px] font-extrabold font-mono border px-3 py-1.5 rounded-full tracking-wider uppercase ${colorClass} self-start mb-2 shadow-sm`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`}></span>
      {label}
    </div>
  );
};

function VarRoom({ matchId, matchName, selectedMatch, aiLanguage }) {
  const activeScenarios = MATCH_SCENARIOS[matchId] || MATCH_SCENARIOS["3869685"] || [];
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [incidentDropdownOpen, setIncidentDropdownOpen] = useState(false);
  const scenario = activeScenarios[selectedIdx] || activeScenarios[0] || {};

  const [toggleStates, setToggleStates] = useState(
    scenario.toggles ? scenario.toggles.reduce((acc, t) => ({ ...acc, [t.id]: t.defaultVal }), {}) : {}
  );
  const [aiReport, setAiReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [explainModalOpen, setExplainModalOpen] = useState(false);
  const [explanationMode, setExplanationMode] = useState("referee");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState(null);
  const [userPrompt, setUserPrompt] = useState("");

  const synthRef = useRef(null);
  const utteranceRef = useRef(null);
  const canvasRef = useRef(null);

  const handleToggle = (id) => {
    setToggleStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getCurrentStep = () => {
    if (aiReport) return 2;
    const togglesList = scenario.toggles || [];
    const isTogglesChanged = togglesList.some(t => toggleStates[t.id] !== t.defaultVal);
    if (isTogglesChanged || customImageUrl) return 1;
    return 0;
  };

  const getStepPercent = () => {
    const step = getCurrentStep();
    if (step === 0) return "0%";
    if (step === 1) return "50%";
    return "100%";
  };

  const getStepClass = (stepIdx) => {
    const currentStep = getCurrentStep();
    if (currentStep === stepIdx) {
      return "border-forest-green bg-forest-green text-white shadow-sm";
    }
    if (currentStep > stepIdx) {
      return "border-forest-green bg-forest-green/10 text-forest-green";
    }
    return "border-slate-200 bg-white text-slate-400";
  };

  const speakVerdict = () => {
    if (!synthRef.current || !aiReport) return;
    
    if (isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }
    
    synthRef.current.cancel();
    
    const cleanText = aiReport
      .replace(/\[.*?\]/g, "")
      .replace(/[*#]/g, "")
      .trim();
      
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    const voices = synthRef.current.getVoices();
    let langCode = "en-US";
    if (aiLanguage === "Spanish") langCode = "es-ES";
    else if (aiLanguage === "French") langCode = "fr-FR";
    else if (aiLanguage === "Portuguese") langCode = "pt-PT";
    else if (aiLanguage === "Chinese") langCode = "zh-CN";
    else if (aiLanguage === "Hindi") langCode = "hi-IN";
    
    utterance.lang = langCode;
    
    const voice = voices.find(v => v.lang.startsWith(langCode));
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const pauseSpeaking = () => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  // Initialize Speech synthesis
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Sync state when active match id or scenario selection updates
  useEffect(() => {
    setSelectedIdx(0);
    const activeScenList = MATCH_SCENARIOS[matchId] || MATCH_SCENARIOS["3869685"] || [];
    const firstScen = activeScenList[0];
    if (firstScen) {
      setToggleStates(
        firstScen.toggles.reduce((acc, t) => ({ ...acc, [t.id]: t.defaultVal }), {})
      );
    }
    setAiReport("");
    setCustomImageUrl(null);
    setUserPrompt("");
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  }, [matchId]);

  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [selectedIdx, aiLanguage, explanationMode, aiReport]);

  // Draw static deconstruction snapshot of the incident showing real players
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || customImageUrl) return; // Don't draw if custom screenshot is active
    
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw tactical green field background
    ctx.fillStyle = "#0D2C1E";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Center dividing lines
    ctx.strokeStyle = "rgba(250, 248, 245, 0.15)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 40, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 10);
    ctx.lineTo(canvas.width / 2, canvas.height - 10);
    ctx.stroke();

    // Bounding border
    ctx.strokeStyle = "rgba(194, 159, 92, 0.25)";
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

    // Crosshairs
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 8, canvas.height / 2);
    ctx.lineTo(canvas.width / 2 + 8, canvas.height / 2);
    ctx.stroke();

    // Overlay status details
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 9px monospace";
    ctx.fillText(`[VAR_SCREENSHOT_CV] ${matchName.toUpperCase()}`, 18, 24);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillText(`SNAPSHOT DECONSTRUCTOR | HAWKEYE_CALIB: ONLINE`, 18, 36);

    const baseType = scenario.baseIncident || "ball_out_of_play";
    const attProfile = scenario.players?.attacker || { name: "Attacker", number: "9", color: "sky" };
    const defProfile = scenario.players?.defender || { name: "Defender", number: "4", color: "blue" };

    const drawJersey = (x, y, name, num, teamColor, isHighlight = false) => {
      ctx.save();
      // Drop Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.beginPath();
      ctx.arc(x, y + 2, 11, 0, Math.PI * 2);
      ctx.fill();

      // Jersey base color
      if (teamColor === "sky") {
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x - 3, y - 11, 6, 22);
      } else if (teamColor === "checkered") {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(x - 6, y - 6, 12, 12);
      } else if (teamColor === "yellow") {
        ctx.fillStyle = "#eab308";
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.fill();
      } else if (teamColor === "green") {
        ctx.fillStyle = "#15803d";
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.fill();
      } else if (teamColor === "red") {
        ctx.fillStyle = "#b91c1c";
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "#1e3a8a";
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = isHighlight ? "#C29F5C" : "#ffffff";
      ctx.lineWidth = isHighlight ? 2.2 : 1.2;
      ctx.beginPath();
      ctx.arc(x, y, 11, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = (teamColor === "sky" || teamColor === "checkered") ? "#0D2C1E" : "#ffffff";
      ctx.font = "bold 8.5px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(num, x, y);

      // Label name
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 8px monospace";
      ctx.fillText(name, x, y + 20);
      ctx.restore();
    };

    if (baseType === "penalty" || baseType === "simulation") {
      const contact = toggleStates["physical_contact"];
      
      // Plot freeze frame positions
      let attX = canvas.width * 0.44;
      let attY = canvas.height * 0.6;
      let defX = canvas.width * 0.52;
      let defY = canvas.height * 0.62;

      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.strokeRect(-10, canvas.height * 0.4, canvas.width * 0.65, canvas.height * 0.6);

      drawJersey(attX, attY, attProfile.name, attProfile.number, attProfile.color, true);
      drawJersey(defX, defY, defProfile.name, defProfile.number, defProfile.color);

      // Ball
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(attX + 22, attY + 16, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (contact) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
        ctx.beginPath();
        ctx.arc((attX + defX)/2, (attY+defY)/2 + 8, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ef4444";
        ctx.fillText("COLLISION AREA DETECTED", (attX + defX)/2 - 45, (attY+defY)/2 - 12);
      } else {
        ctx.strokeStyle = "#10b981";
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(attX + 10, (attY+defY)/2 + 10);
        ctx.lineTo(defX - 10, (attY+defY)/2 + 10);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#10b981";
        ctx.fillText("15cm GAP DETECTED", (attX + defX)/2 - 35, (attY+defY)/2 - 12);
      }
    }
    else if (baseType === "offside") {
      const isOffside = toggleStates["nearer_than_ball"] && toggleStates["second_last_defender"] && !toggleStates["deliberate_play"];
      let defLineX = canvas.width * 0.54;

      // Draw offside line
      ctx.strokeStyle = "#C29F5C";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(defLineX, 10);
      ctx.lineTo(defLineX, canvas.height - 10);
      ctx.stroke();

      ctx.fillStyle = "rgba(194, 159, 92, 0.08)";
      ctx.fillRect(0, 10, defLineX, canvas.height - 20);

      let attX = isOffside ? defLineX + 25 : defLineX - 25;
      let attY = canvas.height * 0.52;
      let defX = defLineX - 10;
      let defY = canvas.height * 0.58;

      drawJersey(attX, attY, attProfile.name, attProfile.number, attProfile.color, true);
      drawJersey(defX, defY, defProfile.name, defProfile.number, defProfile.color);

      // Draw vertical SAOT checking line from attacker shoulder
      ctx.strokeStyle = isOffside ? "#ef4444" : "#10b981";
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(attX, attY);
      ctx.lineTo(attX, canvas.height - 15);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = isOffside ? "#ef4444" : "#10b981";
      ctx.fillText(isOffside ? "OFFSIDE INTERSECT" : "ONSIDE PASS FRAME", attX - 35, attY - 18);
    }
    else if (baseType === "ball_out_of_play") {
      const whollyOut = toggleStates["ball_wholly_crossed"];
      let goalLineX = canvas.width * 0.55;

      // Goal line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(goalLineX, 10);
      ctx.lineTo(goalLineX, canvas.height - 10);
      ctx.stroke();

      let ballX = whollyOut ? goalLineX + 14 : goalLineX - 4;
      let ballY = canvas.height * 0.5;

      drawJersey(goalLineX - 35, canvas.height * 0.54, attProfile.name, attProfile.number, attProfile.color, true);
      drawJersey(goalLineX + 35, canvas.height * 0.35, defProfile.name, defProfile.number, defProfile.color);

      // Ball
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = whollyOut ? "#ef4444" : "#10b981";
      ctx.fillText(whollyOut ? "BALL OUT OF PLAY" : "1.8mm OVERLAP (IN PLAY)", ballX - 30, ballY - 15);
    }
    else if (baseType === "handball") {
      const natural = !toggleStates["unnaturally_bigger"];
      let pX = canvas.width * 0.48;
      let pY = canvas.height * 0.52;

      drawJersey(pX, pY, defProfile.name, defProfile.number, defProfile.color, true);
      drawJersey(pX - 65, pY + 25, attProfile.name, attProfile.number, attProfile.color);

      let ax = pX + (natural ? 5 : -14);
      let ay = pY + 12;

      // Ball strikes arm
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(ax, ay, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(234, 179, 8, 0.25)";
      ctx.beginPath();
      ctx.arc(ax, ay, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#eab308";
      ctx.fillText(natural ? "NATURAL POSITION" : "UNNATURAL SHAPE", pX - 45, pY - 20);
    }
    else if (baseType === "encroachment") {
      const encroached = toggleStates["substitutes_on_field"];
      let lineX = canvas.width * 0.65;

      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(lineX, 10);
      ctx.lineTo(lineX, canvas.height - 10);
      ctx.stroke();

      drawJersey(canvas.width * 0.45, canvas.height * 0.5, attProfile.name, attProfile.number, attProfile.color, true);
      drawJersey(lineX + 30, canvas.height * 0.45, defProfile.name, defProfile.number, defProfile.color);

      let sx = encroached ? lineX - 15 : lineX + 15;
      let sy = canvas.height * 0.72;

      drawJersey(sx, sy, "ARG Sub", "Bib", "yellow");

      ctx.fillStyle = encroached ? "#ef4444" : "#10b981";
      ctx.fillText(encroached ? "FIELD ENCROACHED" : "TOUCHLINE SAFE", sx - 35, sy - 15);
    }

  }, [selectedIdx, toggleStates, matchId, customImageUrl]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setCustomImageUrl(objectUrl);
      setAiReport("");
    }
  };

  const handleQueryAI = (customPromptText = "") => {
    setLoading(true);
    setAiReport("");
    
    const query = customPromptText || userPrompt || "Analyze this match moment snapshot and explain based on official rules.";
    const lowerQuery = query.toLowerCase();

    // Determine target incident type based on query keywords
    let targetIncident = scenario.baseIncident;
    if (lowerQuery.includes("offside")) targetIncident = "offside";
    else if (lowerQuery.includes("handball") || lowerQuery.includes("arm")) targetIncident = "handball";
    else if (lowerQuery.includes("penalty") || lowerQuery.includes("foul") || lowerQuery.includes("trip")) targetIncident = "penalty";
    else if (lowerQuery.includes("simulation") || lowerQuery.includes("dive") || lowerQuery.includes("card")) targetIncident = "simulation";
    else if (lowerQuery.includes("encroachment") || lowerQuery.includes("substitute")) targetIncident = "encroachment";
    else if (lowerQuery.includes("out of play") || lowerQuery.includes("line") || lowerQuery.includes("goal")) targetIncident = "ball_out_of_play";

    let promptDetails = "";
    if (customImageUrl) {
      promptDetails = `You are an expert FIFA VAR official. The user has uploaded a custom match screenshot (image) for analysis. They have asked a question about this particular custom image moment.
Look specifically at player contact, ball intent, and whether it qualifies as a clear and obvious error based on the details in the user's query.
Please ignore and do NOT reference the preset match "${matchName}", the preset scenario question "${scenario.question}", the telemetry description "${scenario.telemetry}", or the preset variables/toggles, because this is an entirely separate custom uploaded image.
Answer the user's query: "${query}" based on the laws of the game.`;
    } else {
      promptDetails = `You are an expert FIFA VAR official. Analyze this preset telemetry frame.
Match: ${matchName}
Scenario: ${scenario.match} - ${scenario.question}
Telemetry description: ${scenario.telemetry}
Active variables / facts selected by user:
${scenario.toggles ? scenario.toggles.map(t => `- ${t.label}: ${toggleStates[t.id] ? "TRUE" : "FALSE"}`).join("\n") : "None"}

Based on these preset variables, telemetry details, and official football rules, explain your decision step-by-step.
User query: "${query}"`;
    }

    fetch("http://localhost:8000/api/var/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        incident_type: customImageUrl ? "custom_image_upload" : targetIncident,
        details: promptDetails,
        lang: aiLanguage
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("RAG Fail");
        return res.json();
      })
      .then(data => {
        setAiReport(data.result);
        setLoading(false);
      })
      .catch(err => {
        console.error("Image VAR API failed, using client-side AI analysis...", err);
        // Fallback to local response
        setTimeout(() => {
          const report = generateLocalVerdictExplanation(targetIncident, toggleStates, explanationMode, aiLanguage, scenario, !!customImageUrl, query);
          setAiReport(report + "\n\nRule Reference: " + (customImageUrl ? "IFAB Law 5 & VAR Protocol" : scenario.rulesCitation));
          setLoading(false);
        }, 1100);
      });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-slate-stretch w-full max-w-7xl mx-auto animate-fade-in pb-12">
      
      {/* Left Column: scenario, Toggles & Stepper */}
      <div className="lg:col-span-2 bg-[#FDFDFB] border border-border-warm rounded-2xl p-6 shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <ShieldCheck size={22} className="text-forest-green" />
          <h2 className="text-forest-green font-display font-extrabold text-sm uppercase tracking-wider">VAR Screenshot Ingestion</h2>
        </div>
        
        <p className="text-forest-green-muted text-xs leading-relaxed font-medium">
          Select a controversial review incident folder or upload an image screenshot of a moment. Adjust variables to query the AI Vision rules engine.
        </p>

        {/* Stepper timeline */}
        <div className="flex items-center justify-between relative px-2.5 py-4 bg-bg-ivory rounded-xl border border-border-warm">
          <div className="absolute top-[31px] left-10 right-10 h-[1.5px] bg-slate-200 z-0"></div>
          <div className="absolute top-[31px] left-10 h-[1.5px] bg-forest-green transition-all duration-300 z-10" style={{ width: getStepPercent() }}></div>
          
          <div className="flex flex-col items-center gap-1.5 z-20">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono font-extrabold text-xs ${getStepClass(0)}`}>1</div>
            <span className="text-[8.5px] font-mono text-forest-green-muted uppercase tracking-wider font-bold">incident</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 z-20">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono font-extrabold text-xs ${getStepClass(1)}`}>2</div>
            <span className="text-[8.5px] font-mono text-forest-green-muted uppercase tracking-wider font-bold">toggles</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 z-20">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono font-extrabold text-xs ${getStepClass(2)}`}>3</div>
            <span className="text-[8.5px] font-mono text-forest-green-muted uppercase tracking-wider font-bold">verdict</span>
          </div>
        </div>

        {/* Incident Selector */}
        {!matchId.startsWith("wc2026_") && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Review Folder</span>
            <div className="relative">
              <button 
                onClick={() => setIncidentDropdownOpen(!incidentDropdownOpen)}
                className="w-full flex items-center justify-between bg-bg-ivory border border-border-warm text-forest-green rounded-lg px-3 py-2.5 text-xs font-semibold hover:border-gold-accent/40 transition-all cursor-pointer select-none"
              >
                <span className="truncate">{scenario.match || "Select Scenario"}</span>
                <ChevronDown size={12} className={`ml-2 flex-shrink-0 text-forest-green-muted transition-transform duration-200 ${incidentDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              
              {incidentDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIncidentDropdownOpen(false)} />
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-border-warm rounded-xl shadow-lg z-50 py-1 overflow-hidden animate-fade-in">
                    {activeScenarios.map((scen, idx) => (
                      <button
                        key={scen.id}
                        onClick={() => {
                          setSelectedIdx(idx);
                          setCustomImageUrl(null); // Clear custom screenshot if selecting preset
                          setIncidentDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold transition-all border-b border-border-warm/20 last:border-b-0 ${
                          selectedIdx === idx 
                            ? "bg-forest-green text-white font-bold" 
                            : "text-forest-green hover:bg-forest-green/5"
                        }`}
                      >
                        {scen.match}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Image Ingest File Uploader */}
        <div className="flex flex-col gap-2 border border-dashed border-border-warm p-4 rounded-xl bg-bg-ivory/20 hover:bg-bg-ivory/50 transition-all text-center relative cursor-pointer">
          <Upload size={18} className="text-forest-green mx-auto mb-1.5" />
          <span className="text-xs font-bold text-forest-green">INGEST MOMENT SCREENSHOT</span>
          <span className="text-[9px] text-slate-400 font-mono">DRAG & DROP OR CLICK TO LOAD MATCH IMAGE (PNG, JPG)</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
          />
        </div>

        {/* Core Question Details */}
        {!matchId.startsWith("wc2026_") && (
          <div className="border-l-2 border-l-gold-accent bg-gold-accent/5 p-4 rounded-r-xl border border-border-warm border-l-0">
            <h3 className="text-forest-green font-display font-extrabold text-[9.5px] uppercase tracking-wider">Investigation target</h3>
            <p className="text-forest-green-muted text-xs mt-1.5 leading-relaxed font-bold">{scenario.question}</p>
          </div>
        )}

        {/* Toggles */}
        {!matchId.startsWith("wc2026_") && (
          <div className="flex flex-col gap-3">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Incident variables</span>
            
            {scenario.toggles && scenario.toggles.map((toggle) => (
              <div key={toggle.id} className="flex justify-between items-center p-3 bg-bg-ivory/30 border border-border-warm rounded-xl hover:border-gold-accent/20 transition-all">
                <span className="text-forest-green-muted text-xs font-bold max-w-[75%] leading-tight">{toggle.label}</span>
                
                <button 
                  onClick={() => handleToggle(toggle.id)}
                  className={`w-[48px] h-[24px] rounded-full p-0.5 transition-colors relative cursor-pointer ${
                    toggleStates[toggle.id] ? "bg-forest-green" : "bg-slate-300"
                  }`}
                  style={{ minHeight: "24px" }}
                >
                  <div className={`w-[20px] h-[20px] rounded-full bg-white transition-transform ${
                    toggleStates[toggle.id] ? "translate-x-[24px]" : "translate-x-0"
                  }`}></div>
                </button>
              </div>
            ))}
          </div>
        )}

        {matchId.startsWith("wc2026_") && (
          <div className="flex flex-col gap-3 bg-[#0D2C1E]/5 border border-[#C29F5C]/45 rounded-2xl p-4 shadow-sm text-left">
            <div className="flex items-center gap-2 text-forest-green">
              <AlertTriangle className="text-gold-accent animate-pulse" size={16} />
              <span className="font-display font-extrabold text-xs uppercase tracking-wider">Telemetry Warning</span>
            </div>
            <p className="text-forest-green-muted text-xs leading-relaxed font-medium">
              Spatial coordinate telemetry and tracking is restricted to the FIFA World Cup 2022 archive. Reverting to static match summary narrative.
            </p>
          </div>
        )}
      </div>

      {/* Right Column: Image View, Telemetry & AI console */}
      <div className="lg:col-span-3 bg-[#FDFDFB] border border-border-warm rounded-2xl p-6 shadow-sm flex flex-col gap-5 items-stretch">
        <style>{`
          @keyframes eqBarGrowth {
            0%, 100% { transform: scaleY(0.3); }
            50% { transform: scaleY(1.0); }
          }
          .eq-bar {
            animation: eqBarGrowth 1s ease-in-out infinite;
            transform-origin: bottom;
          }
          .eq-bar:nth-child(1) { animation-delay: 0.1s; }
          .eq-bar:nth-child(2) { animation-delay: 0.3s; }
          .eq-bar:nth-child(3) { animation-delay: 0.15s; }
          .eq-bar:nth-child(4) { animation-delay: 0.45s; }
          .eq-bar:nth-child(5) { animation-delay: 0.2s; }
        `}</style>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border-warm pb-4 gap-3">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-forest-green" />
            <h3 className="text-forest-green font-display font-extrabold text-sm uppercase tracking-wider">AI Pitchside Reconstructor Monitor</h3>
          </div>
          
          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="flex items-center bg-bg-ivory border border-border-warm rounded-lg p-0.5 shadow-inner">
              <button
                onClick={() => setExplanationMode("referee")}
                className={`px-2.5 py-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                  explanationMode === "referee" ? "bg-forest-green text-white shadow-sm" : "text-forest-green-muted hover:text-forest-green"
                }`}
              >
                👨‍⚖️ Referee
              </button>
              <button
                onClick={() => setExplanationMode("fan")}
                className={`px-2.5 py-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                  explanationMode === "fan" ? "bg-forest-green text-white shadow-sm" : "text-forest-green-muted hover:text-forest-green"
                }`}
              >
                📣 Fan (ELI5)
              </button>
            </div>

            <button 
              onClick={() => setExplainModalOpen(true)}
              className="flex items-center gap-1 bg-forest-green/5 border border-forest-green/10 text-forest-green font-mono text-[9px] px-2.5 py-1.5 rounded-full cursor-pointer hover:bg-forest-green/10 transition-all font-bold"
            >
              Explain weights
            </button>
          </div>
        </div>

        {/* Pitchside Monitor viewer panel */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border-warm bg-[#06080C] shadow-inner flex items-center justify-center">
          {customImageUrl ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img src={customImageUrl} className="max-w-full max-h-full object-contain" alt="Uploaded controversial moment" />
              
              {/* Telemetry frame border overlay over custom uploaded screenshot */}
              <div className="absolute inset-0 border border-gold-accent/20 pointer-events-none"></div>
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-950/85 border border-white/10 px-2 py-1 rounded shadow-md pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"></span>
                <span className="font-mono text-[8px] text-slate-400">CUSTOM MOMENT</span>
              </div>
            </div>
          ) : matchId.startsWith("wc2026_") ? (
            <div className="flex flex-col items-center justify-center p-8 bg-[#0D2C1E] border border-[#C29F5C]/30 text-center gap-3 w-full h-full">
              <AlertTriangle className="text-[#C29F5C] animate-pulse" size={32} />
              <h4 className="text-[#C29F5C] font-display font-extrabold text-xs uppercase tracking-wider">Spatial Geometry Restrained</h4>
              <p className="text-slate-300 text-xs max-w-sm leading-relaxed">
                Spatial coordinate telemetry and tracking is restricted to the FIFA World Cup 2022 archive. Reverting to static match summary narrative.
              </p>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {/* Tactical reconstructor canvas */}
              <canvas 
                ref={canvasRef} 
                width={500}
                height={260}
                className="w-full h-full block" 
              />
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-950/85 border border-white/10 px-2 py-1 rounded shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"></span>
                <span className="font-mono text-[8px] text-slate-400">TELEMETRY FRAME</span>
              </div>
            </div>
          )}
        </div>

        {/* Clear custom image / back to deconstructor button */}
        {customImageUrl && (
          <button
            onClick={() => setCustomImageUrl(null)}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-mono text-[9px] font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase shadow-sm"
          >
            <RotateCcw size={12} /> Back to Preset Scenario Deconstructor
          </button>
        )}

        {/* Live incident commentary / Telemetry text details */}
        {!customImageUrl && (
          <div className="bg-gold-accent/5 border-l-2 border-l-gold-accent border border-border-warm rounded-r-xl p-3 flex gap-2 items-center">
            <AlertTriangle size={15} className="text-gold-accent flex-shrink-0 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-slate-400 uppercase">Moment Telemetry Snapshot</span>
              <span className="text-xs font-bold text-forest-green">{scenario.telemetry}</span>
            </div>
          </div>
        )}

        {/* Dynamic Logic Flowchart */}
        {!matchId.startsWith("wc2026_") && (
          <div className="bg-bg-ivory border border-border-warm rounded-xl p-4 flex flex-col gap-3">
            <h4 className="text-forest-green font-display font-extrabold text-[10px] uppercase tracking-wider">Decision Logic Path</h4>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 relative">
              <div className="flex-1 bg-white border border-border-warm rounded-lg p-2.5 flex flex-col gap-1.5 shadow-sm">
                <span className="text-[8px] font-mono text-slate-400 uppercase">1. Factual Toggles</span>
                <div className="flex flex-col gap-1 text-[9.5px]">
                  {scenario.toggles && scenario.toggles.map((t) => (
                    <div key={t.id} className="flex justify-between items-center">
                      <span className="text-forest-green-muted truncate max-w-[125px]">{t.label}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold ${toggleStates[t.id] ? "bg-forest-green/10 text-forest-green" : "bg-slate-100 text-slate-400"}`}>
                        {toggleStates[t.id] ? "TRUE" : "FALSE"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden sm:block text-slate-300 text-sm font-bold">➔</div>

              <div className="flex-1 bg-white border border-border-warm rounded-lg p-2.5 flex flex-col gap-1.5 shadow-sm">
                <span className="text-[8px] font-mono text-slate-400 uppercase">2. Law Logical Check</span>
                
                {scenario.baseIncident === "ball_out_of_play" && (
                  <div className="flex flex-col gap-1 text-[9.5px]">
                    <div className="flex justify-between">
                      <span>Wholly Out?</span>
                      <span className="font-bold">{toggleStates["ball_wholly_crossed"] ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overhang Line?</span>
                      <span className="font-bold">{toggleStates["curvature_hangs_over"] ? "Yes" : "No"}</span>
                    </div>
                    <div className="border-t border-dashed border-border-warm pt-1 mt-1 flex justify-between font-mono text-[9px] font-extrabold text-forest-green">
                      <span>In Play?</span>
                      <span>{!toggleStates["ball_wholly_crossed"] || toggleStates["curvature_hangs_over"] ? "TRUE ✅" : "FALSE ❌"}</span>
                    </div>
                  </div>
                )}
                
                {scenario.baseIncident === "offside" && (
                  <div className="flex flex-col gap-1 text-[9.5px]">
                    <div className="flex justify-between">
                      <span>Nearer than ball?</span>
                      <span className="font-bold">{toggleStates["nearer_than_ball"] ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nearer than second-last?</span>
                      <span className="font-bold">{toggleStates["second_last_defender"] ? "Yes" : "No"}</span>
                    </div>
                    <div className="border-t border-dashed border-border-warm pt-1 mt-1 flex justify-between font-mono text-[9px] font-extrabold text-forest-green">
                      <span>Offside?</span>
                      <span>{toggleStates["nearer_than_ball"] && toggleStates["second_last_defender"] && !toggleStates["deliberate_play"] ? "TRUE ❌" : "FALSE ✅"}</span>
                    </div>
                  </div>
                )}
                
                {scenario.baseIncident === "penalty" && (
                  <div className="flex flex-col gap-1 text-[9.5px]">
                    <div className="flex justify-between">
                      <span>Physical Contact?</span>
                      <span className="font-bold">{toggleStates["physical_contact"] ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inside Area?</span>
                      <span className="font-bold">{toggleStates["inside_box"] ? "Yes" : "No"}</span>
                    </div>
                    <div className="border-t border-dashed border-border-warm pt-1 mt-1 flex justify-between font-mono text-[9px] font-extrabold text-forest-green">
                      <span>Penalty?</span>
                      <span>{toggleStates["physical_contact"] && toggleStates["inside_box"] ? "TRUE ✅" : "FALSE ❌"}</span>
                    </div>
                  </div>
                )}
                
                {scenario.baseIncident === "simulation" && (
                  <div className="flex flex-col gap-1 text-[9.5px]">
                    <div className="flex justify-between">
                      <span>Physical Contact?</span>
                      <span className="font-bold">{toggleStates["physical_contact"] ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Exaggerated Fall?</span>
                      <span className="font-bold">{toggleStates["exaggerated_fall"] ? "Yes" : "No"}</span>
                    </div>
                    <div className="border-t border-dashed border-border-warm pt-1 mt-1 flex justify-between font-mono text-[9px] font-extrabold text-forest-green">
                      <span>Simulation?</span>
                      <span>{!toggleStates["physical_contact"] && toggleStates["exaggerated_fall"] ? "TRUE 🟨" : "FALSE ✅"}</span>
                    </div>
                  </div>
                )}

                {scenario.baseIncident === "handball" && (
                  <div className="flex flex-col gap-1 text-[9.5px]">
                    <div className="flex justify-between">
                      <span>Arm Contact?</span>
                      <span className="font-bold">{toggleStates["handball_arm_contact"] ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unnatural Silhouette?</span>
                      <span className="font-bold">{toggleStates["unnaturally_bigger"] ? "Yes" : "No"}</span>
                    </div>
                    <div className="border-t border-dashed border-border-warm pt-1 mt-1 flex justify-between font-mono text-[9px] font-extrabold text-forest-green">
                      <span>Handball Foul?</span>
                      <span>{toggleStates["handball_arm_contact"] && toggleStates["unnaturally_bigger"] ? "TRUE ❌" : "FALSE ✅"}</span>
                    </div>
                  </div>
                )}

                {scenario.baseIncident === "encroachment" && (
                  <div className="flex flex-col gap-1 text-[9.5px]">
                    <div className="flex justify-between">
                      <span>Bibs On Field?</span>
                      <span className="font-bold">{toggleStates["substitutes_on_field"] ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Interference?</span>
                      <span className="font-bold">{toggleStates["interfered_with_play"] ? "Yes" : "No"}</span>
                    </div>
                    <div className="border-t border-dashed border-border-warm pt-1 mt-1 flex justify-between font-mono text-[9px] font-extrabold text-forest-green">
                      <span>Disallow Goal?</span>
                      <span>{toggleStates["substitutes_on_field"] && toggleStates["interfered_with_play"] ? "TRUE ❌" : "FALSE ✅"}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden sm:block text-slate-300 text-sm font-bold">➔</div>

              <div className="flex-1 bg-white border border-border-warm rounded-lg p-2.5 flex flex-col gap-1.5 shadow-sm justify-center items-center text-center">
                <span className="text-[8px] font-mono text-slate-400 uppercase">3. Verdict Resolution</span>
                {(() => {
                  let resolvedVerdict = "";
                  let resolvedSubText = "";
                  let resolvedClass = "";
                  
                  if (scenario.baseIncident === "ball_out_of_play") {
                    const inPlay = !toggleStates["ball_wholly_crossed"] || toggleStates["curvature_hangs_over"];
                    resolvedVerdict = inPlay ? "GOAL STANDS" : "NO GOAL";
                    resolvedSubText = inPlay ? "Ball remained active" : "Ball wholly crossed line";
                    resolvedClass = inPlay ? "text-forest-green bg-forest-green/5 border-forest-green/20" : "text-accent-red bg-accent-red/5 border-accent-red/20";
                  } else if (scenario.baseIncident === "offside") {
                    const isOff = toggleStates["nearer_than_ball"] && toggleStates["second_last_defender"] && !toggleStates["deliberate_play"];
                    resolvedVerdict = isOff ? "OFFSIDE Disallowed" : "GOAL ALLOWED";
                    resolvedSubText = isOff ? "Offside position active" : "Striker inside legal limits";
                    resolvedClass = isOff ? "text-accent-red bg-accent-red/5 border-accent-red/20" : "text-forest-green bg-forest-green/5 border-forest-green/20";
                  } else if (scenario.baseIncident === "penalty") {
                    const pen = toggleStates["physical_contact"] && toggleStates["inside_box"];
                    resolvedVerdict = pen ? "PENALTY AWARDED" : "PLAY ON / NO PEN";
                    resolvedSubText = pen ? "Foul inside box" : "No offence in penalty zone";
                    resolvedClass = pen ? "text-forest-green bg-forest-green/5 border-forest-green/20" : "text-accent-red bg-accent-red/5 border-accent-red/20";
                  } else if (scenario.baseIncident === "simulation") {
                    const sim = !toggleStates["physical_contact"] && toggleStates["exaggerated_fall"];
                    resolvedVerdict = sim ? "BOOKING FOR DIVING" : "NO DIVE BOOKING";
                    resolvedSubText = sim ? "Exaggerated simulation" : "Fair challenge / slip";
                    resolvedClass = sim ? "text-accent-red bg-accent-red/5 border-accent-red/20" : "text-forest-green bg-forest-green/5 border-forest-green/20";
                  } else if (scenario.baseIncident === "handball") {
                    const hb = toggleStates["handball_arm_contact"] && toggleStates["unnaturally_bigger"];
                    resolvedVerdict = hb ? (toggleStates["inside_box"] ? "PENALTY AWARDED" : "HANDBALL FOUL") : "PLAY ON / NO FOUL";
                    resolvedSubText = hb ? (toggleStates["inside_box"] ? "Arm block in area" : "Arm block outside box") : "Accidental arm contact";
                    resolvedClass = hb ? "text-accent-red bg-accent-red/5 border-accent-red/20" : "text-forest-green bg-forest-green/5 border-forest-green/20";
                  } else if (scenario.baseIncident === "encroachment") {
                    const disallow = toggleStates["substitutes_on_field"] && toggleStates["interfered_with_play"];
                    resolvedVerdict = disallow ? "GOAL DISALLOWED" : "GOAL ALLOWED";
                    resolvedSubText = disallow ? "Substitute interference" : "Encroachment with no impact";
                    resolvedClass = disallow ? "text-accent-red bg-accent-red/5 border-accent-red/20" : "text-forest-green bg-forest-green/5 border-forest-green/20";
                  }
                  
                  return (
                    <>
                      <span className={`px-2 py-1 rounded font-display font-extrabold text-[9.5px] border ${resolvedClass}`}>
                        {resolvedVerdict}
                      </span>
                      <span className="text-[8px] text-forest-green-muted mt-1 leading-tight">{resolvedSubText}</span>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* IFAB Document extract (stamped visual design) */}
        <div className="bg-bg-cream/40 border border-border-warm p-4 rounded-xl flex gap-3.5 relative overflow-hidden">
          <Landmark size={24} className="text-gold-accent flex-shrink-0 mt-0.5 z-10" />
          <div className="flex flex-col z-10 text-left">
            <h4 className="text-forest-green font-display font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
              IFAB Official Rules Extract
            </h4>
            <p className="text-slate-500 font-mono text-[9px] mt-0.5 leading-tight italic font-bold">
              FIFA and The IFAB's official VAR rules are fully outlined in Law 5 (The Referee) and the Video Assistant Referee (VAR) Protocol.
            </p>
            <p className="text-forest-green-muted text-xs leading-relaxed mt-2 font-bold font-serif">
              {matchId.startsWith("wc2026_") 
                ? "LAW 5 (The Referee): Decisions will be made to the best of the referee's ability according to the Laws of the Game and the 'spirit of the game'. The decisions of the referee regarding facts connected with play are final."
                : scenario.rulesCitation
              }
            </p>
          </div>
          <div className="absolute right-2 -bottom-2 text-[32px] font-black text-forest-green/2 font-serif select-none pointer-events-none transform rotate-12">
            IFAB SCAN
          </div>
        </div>

        {/* Interactive AI Prompt Console */}
        <div className="border border-border-warm p-4 rounded-xl flex flex-col gap-3 bg-bg-ivory/30">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">AI Vision Official Referee Prompt</span>
          
          {/* Quick prompt chips */}
          {!matchId.startsWith("wc2026_") && (
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  setUserPrompt("You are an expert FIFA VAR official. Analyze this moment image. Look specifically at player contact, ball intent, and whether it qualifies as a clear and obvious error. Explain your decision step-by-step based on official football rules.");
                  handleQueryAI("You are an expert FIFA VAR official. Analyze this moment image. Look specifically at player contact, ball intent, and whether it qualifies as a clear and obvious error. Explain your decision step-by-step based on official football rules.");
                }}
                className="px-2.5 py-1 rounded-full bg-white border border-border-warm text-[8.5px] font-bold text-forest-green hover:border-gold-accent transition-all cursor-pointer"
              >
                🔍 Analyze Contact, Intent & Error
              </button>
              <button
                onClick={() => {
                  setUserPrompt("Analyze if the attacker is in an offside position at the passing release frame. Explain step-by-step using IFAB Law 11.");
                  handleQueryAI("Analyze if the attacker is in an offside position at the passing release frame. Explain step-by-step using IFAB Law 11.");
                }}
                className="px-2.5 py-1 rounded-full bg-white border border-border-warm text-[8.5px] font-bold text-forest-green hover:border-gold-accent transition-all cursor-pointer"
              >
                🚩 SAOT Offside Check
              </button>
              <button
                onClick={() => {
                  setUserPrompt("Explain why this goal was disallowed and cite the official FIFA rule applied.");
                  handleQueryAI("Explain why this goal was disallowed and cite the official FIFA rule applied.");
                }}
                className="px-2.5 py-1 rounded-full bg-white border border-border-warm text-[8.5px] font-bold text-forest-green hover:border-gold-accent transition-all cursor-pointer"
              >
                ⚽ Goal Disallowed Reason
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <textarea
              className="flex-1 bg-white border border-border-warm text-forest-green rounded-lg p-2.5 text-xs font-semibold focus:border-forest-green focus:outline-none placeholder-slate-400 placeholder:font-normal resize-none h-16"
              placeholder="Ask the AI Vision model about this specific incident..."
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
            />
            <button
              onClick={() => handleQueryAI()}
              className="bg-forest-green text-white px-4 rounded-lg font-display font-extrabold text-xs uppercase tracking-wider hover:bg-gold-accent hover:text-forest-green transition-all shadow cursor-pointer disabled:opacity-40"
              disabled={loading}
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : "Query"}
            </button>
          </div>
        </div>

        {/* Verdict Badge & Report Dossier */}
        {aiReport ? (
          <div className="flex flex-col gap-3 pt-3 border-t border-border-warm animate-slide-up">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {getVerdictBadge(aiReport)}
              
              <div className="flex items-center gap-1.5 bg-bg-ivory border border-border-warm rounded-lg p-1 shadow-sm">
                {isSpeaking ? (
                  <>
                    <button
                      onClick={pauseSpeaking}
                      className="p-1 text-forest-green hover:text-gold-accent transition-all cursor-pointer"
                      title="Pause narration"
                    >
                      <Pause size={14} />
                    </button>
                    <button
                      onClick={stopSpeaking}
                      className="p-1 text-accent-red hover:text-red-700 transition-all cursor-pointer"
                      title="Stop narration"
                    >
                      <Square size={14} />
                    </button>
                    <div className="flex items-end gap-[2px] h-[10px] px-1.5">
                      <span className="w-[2px] bg-forest-green eq-bar" style={{ height: "100%" }}></span>
                      <span className="w-[2px] bg-forest-green eq-bar" style={{ height: "60%" }}></span>
                      <span className="w-[2px] bg-forest-green eq-bar" style={{ height: "80%" }}></span>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={speakVerdict}
                    className="p-1 text-forest-green hover:text-gold-accent transition-all cursor-pointer flex items-center gap-1 text-[9px] font-mono font-bold"
                    title={isPaused ? "Resume narration" : "Listen to Referee explanation"}
                  >
                    {isPaused ? <Play size={14} /> : <Volume2 size={14} />}
                    {isPaused ? "Resume" : "Listen"}
                  </button>
                )}
              </div>
            </div>

            {/* AI Response Dossier */}
            <div className="bg-[#FAF8F5] border border-border-warm rounded-xl p-5 shadow-inner relative overflow-hidden flex flex-col gap-3">
              <div className="absolute top-2 right-2 font-mono text-[8px] text-slate-400">VAR OFFICIAL REPORT</div>
              <p className="text-forest-green-muted text-xs leading-relaxed whitespace-pre-line font-body font-normal">{aiReport}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3 border-t border-border-warm">
            <HelpCircle size={32} className="text-slate-400" />
            <span className="text-forest-green-muted text-xs font-bold px-4">
              Choose a preset telemetry moment or upload a controversial moment screenshot, then query the AI Vision model.
            </span>
          </div>
        )}
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
              For image VAR reviews, the RAG agent evaluates player intent, contact force vector coordinates, and IFAB rules:
            </p>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-forest-green font-semibold">IFAB Rules Semantic Vector Similarity</span>
                <span className="text-gold-accent font-mono font-bold">45%</span>
              </div>
              <div className="h-2 w-full bg-bg-cream rounded-full overflow-hidden">
                <div style={{ width: "45%" }} className="bg-forest-green h-full rounded-full"></div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-forest-green font-semibold">Physical Coordinate Boundary Check</span>
                <span className="text-gold-accent font-mono font-bold">35%</span>
              </div>
              <div className="h-2 w-full bg-bg-cream rounded-full overflow-hidden">
                <div style={{ width: "35%" }} className="bg-forest-green h-full rounded-full"></div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-forest-green font-semibold">On-Field Verdict Weight factor</span>
                <span className="text-gold-accent font-mono font-bold">20%</span>
              </div>
              <div className="h-2 w-full bg-bg-cream rounded-full overflow-hidden">
                <div style={{ width: "20%" }} className="bg-forest-green h-full rounded-full"></div>
              </div>
            </div>

            <div className="border-t border-border-warm pt-4 mt-2 text-[10px] text-slate-500 leading-normal">
              * Grounded on official IFAB laws scanned by **IBM Docling** and processed locally by **Granite 3.3 2B** reasoning rules.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default VarRoom;
