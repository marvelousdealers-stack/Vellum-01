import React from "react";
import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceDot, AreaChart, Area,
} from "recharts";

// ═══════════════════════════════════════════════════════════════
// CHART THEME
// ═══════════════════════════════════════════════════════════════
export const TIP = {
  contentStyle: { background:"#1C2029", border:"1px solid #333A47", borderRadius:6,
    fontFamily:"'Instrument Sans', sans-serif", fontSize:12.5, color:"#E4E4E1", padding:"9px 13px",
    boxShadow:"0 8px 24px rgba(0,0,0,0.4)" },
  labelStyle: { fontFamily:"'Instrument Sans', sans-serif", fontSize:11.5, fontWeight:600,
    color:"#9A9A97", marginBottom:5 },
  itemStyle: { color:"#E4E4E1", fontSize:12.5, padding:"2px 0" },
};
export const AXIS = { stroke:"#3A3A38", fontSize:11, fontFamily:"'Instrument Sans', sans-serif", fill:"#62625F" };

// ═══════════════════════════════════════════════════════════════
// ANALYTICS DATA
// ═══════════════════════════════════════════════════════════════
export const TREND = [
  { t:"T1", class:72, maya:68, spread:14 }, { t:"T2", class:76, maya:74, spread:12 },
  { t:"T3", class:79, maya:71, spread:15 }, { t:"T4", class:81, maya:80, spread:11 },
  { t:"T5", class:83, maya:83, spread:10 }, { t:"T6", class:84, maya:86, spread:9  },
];
export const TOPICS = [
  { name:"Newton's Laws of Motion", accuracy:92, affected:2,  trend:[88,90,91,89,93,92] },
  { name:"Kinematics",              accuracy:88, affected:4,  trend:[80,82,85,86,87,88] },
  { name:"Gravitation",             accuracy:81, affected:6,  trend:[72,75,78,79,80,81] },
  { name:"Thermodynamics",          accuracy:74, affected:8,  trend:[68,70,72,73,74,74] },
  { name:"Electromagnetism",        accuracy:58, affected:14, trend:[62,60,59,57,58,58] },
  { name:"Wave Optics",             accuracy:46, affected:18, trend:[50,48,47,45,46,46] },
];
export const STUDENTS = [
  { name:"Maya Okafor",     overall:91, weak:"Wave Optics",      strong:"Newton's Laws", flags:0 },
  { name:"Sofia Lindqvist", overall:88, weak:"Thermodynamics",   strong:"Kinematics",    flags:0 },
  { name:"Priya Nair",      overall:85, weak:"Thermodynamics",   strong:"Newton's Laws", flags:0 },
  { name:"Jayden Park",     overall:81, weak:"Electromagnetism", strong:"Newton's Laws", flags:0 },
  { name:"Adrian Bell",     overall:78, weak:"Electromagnetism", strong:"Kinematics",    flags:2 },
  { name:"Tomás Reyes",     overall:72, weak:"Wave Optics",      strong:"Gravitation",   flags:1 },
];

// ═══════════════════════════════════════════════════════════════
// ADMIN DATA
// ═══════════════════════════════════════════════════════════════
export const CLASSES = [
  { name:"Grade 11 — Section A", teachers:["R. Chen","L. Park"], students:32, subjects:3 },
  { name:"Grade 11 — Section B", teachers:["D. Osei"],           students:30, subjects:2 },
  { name:"Grade 10 — Section A", teachers:["L. Park"],           students:28, subjects:4 },
];
export const USERS = [
  { name:"Dr. R. Chen",  email:"r.chen@westfield.edu",  role:"Teacher", cls:"11A, 11B", status:"Active" },
  { name:"Mrs. L. Park", email:"l.park@westfield.edu",  role:"Teacher", cls:"11A, 10A", status:"Active" },
  { name:"Mr. D. Osei",  email:"d.osei@westfield.edu",  role:"Teacher", cls:"11B",      status:"Active" },
  { name:"Maya Okafor",  email:"m.okafor@westfield.edu",role:"Student", cls:"11A",      status:"Active" },
  { name:"Adrian Bell",  email:"a.bell@westfield.edu",  role:"Student", cls:"11A",      status:"Active" },
  { name:"Tomás Reyes",  email:"t.reyes@westfield.edu", role:"Student", cls:"11B",      status:"Inactive" },
];

// ═══════════════════════════════════════════════════════════════
// MATERIALS / CLUSTERS
// ═══════════════════════════════════════════════════════════════
export const UPLOAD_FILES = [
  { kind:"PDF",  label:"physics_outline_2024.pdf", meta:"1.2 MB · typed · direct extraction", route:"DIRECT" },
  { kind:"IMG",  label:"IMG_2043.heic",             meta:"2.8 MB · phone photo · vision model", route:"VISION" },
  { kind:"SCAN", label:"past_paper_2023.pdf",       meta:"860 KB · scanned · vision model",    route:"VISION" },
  { kind:"TXT",  label:"notes_thermo.txt",          meta:"4,200 chars · pasted text",           route:"AS-IS" },
];

// Extracted text samples for the review modal (7.3)
export const EXTRACTED_TEXT_SAMPLE = [
  { id:"e1", label:"physics_outline_2024.pdf", kind:"PDF", route:"DIRECT", quality:"high",
    text:"Course Outline — Physics 11\n\nUnit 1 · Mechanics\nNewton's three laws of motion, free body diagrams, application of F = ma. Free fall and projectile motion.\n\nUnit 2 · Energy & Momentum\nWork, kinetic and potential energy. Conservation of energy. Impulse and momentum.\n\nUnit 3 · Thermodynamics\nTemperature and heat. First law of thermodynamics. Isothermal and adiabatic processes.\n\nUnit 4 · Waves & Optics\nWave properties, interference, refraction and Snell's law. Lenses and the lens equation." },
  { id:"e2", label:"IMG_2043.heic", kind:"IMG", route:"VISION", quality:"med",
    text:"Newton's Second Law — notes from board\n\nF = ma\n- net force (N)\n- mass (kg)\n- acceleration (m/s²)\n\nExamples:\n1. 5 kg block on frictionless surface, applied force 20 N.\n   a = 20 / 5 = 4 m/s²\n2. Incline 30°: component of gravity along slope = mg sin θ\n\nSign conventions matter! [unclear — probably \"positive direction is up the slope\"]" },
  { id:"e3", label:"past_paper_2023.pdf", kind:"SCAN", route:"VISION", quality:"high",
    text:"Physics 11 — Final Examination 2023\n\nSection A · Multiple choice (10 marks)\n1. A 5 kg block rests on a frictionless surface. A horizontal force of 20 N is applied. What is the acceleration?\n2. In an isothermal expansion, which quantity remains constant?\n...\n\nSection B · Written (40 marks)\n6. State Newton's Second Law and explain its relation to inertia.\n7. A car of mass 1200 kg decelerates from 25 m/s to rest in 8 s. Find the average braking force.\n8. Compare isothermal and adiabatic processes for an ideal gas." },
  { id:"e4", label:"notes_thermo.txt", kind:"TXT", route:"AS-IS", quality:"high",
    text:"Thermodynamics — supplementary notes\n\n- First law: ΔU = Q - W\n- Isothermal: T constant, so ΔU = 0 for ideal gas → Q = W\n- Adiabatic: Q = 0, so ΔU = -W\n- Common mistake: students conflate \"no heat flow\" with \"constant temperature\". These are different conditions." },
];

export const EXTRACTED_TOPICS = [
  { name:"Newton's Laws of Motion", weight:8, thin:false },
  { name:"Thermodynamics",          weight:6, thin:false },
  { name:"Kinematics",              weight:5, thin:false },
  { name:"Wave Optics",             weight:4, thin:true  },
  { name:"Electromagnetism",        weight:3, thin:false },
  { name:"Gravitation",             weight:2, thin:false },
];
export const CLUSTERS = [
  { label:"Acceleration from Newton's Second Law", years:5, count:8, sample:"A 5 kg block..." },
  { label:"Free body diagrams for inclined planes", years:4, count:6, sample:"Draw the forces on a 3 kg mass on a 30° incline..." },
  { label:"Isothermal vs adiabatic processes",       years:3, count:5, sample:"Compare the internal energy change..." },
  { label:"Lens sign conventions",                   years:4, count:6, sample:"An object sits 15 cm from a converging lens..." },
  { label:"Conservation of momentum",                years:3, count:4, sample:"Two carts collide and stick together..." },
];

// ═══════════════════════════════════════════════════════════════
// GENERATED QUESTIONS
// ═══════════════════════════════════════════════════════════════
export const GENERATED_QUESTIONS = [
  { id:1, type:"MCQ",        topic:"Newton's Laws", marks:2,
    text:"A 5 kg block rests on a frictionless horizontal surface. A horizontal force of 20 N is applied. What is the block's acceleration?",
    options:["2 m/s²","4 m/s²","10 m/s²","25 m/s²"] },
  { id:2, type:"Short answer",topic:"Newton's Laws", marks:4,
    text:"State Newton's Second Law of Motion and explain, in your own words, how it relates to the concept of inertia." },
  { id:3, type:"MCQ",        topic:"Thermodynamics", marks:2,
    text:"In an isothermal expansion of an ideal gas, which quantity remains constant throughout the process?",
    options:["Internal energy","Pressure","Volume","Heat transferred"] },
  { id:4, type:"Numerical",  topic:"Kinematics", marks:3,
    text:"A car of mass 1200 kg decelerates uniformly from 25 m/s to rest in 8 seconds. Calculate the magnitude of the average braking force." },
];

// ═══════════════════════════════════════════════════════════════
// HISTORY / LIVE / LMS
// ═══════════════════════════════════════════════════════════════
export const PAST_ATTEMPTS = [
  { id:1, test:"Newton's Laws — Unit Test",   date:"14 Nov 2026", score:88, total:100, status:"released", flagged:0 },
  { id:2, test:"Thermodynamics — Quiz 3",     date:"07 Nov 2026", score:76, total:100, status:"released", flagged:0 },
  { id:3, test:"Kinematics — Unit Test",      date:"28 Oct 2026", score:82, total:100, status:"released", flagged:1 },
  { id:4, test:"Wave Optics — Quiz 2",        date:"19 Oct 2026", score:54, total:100, status:"released", flagged:0 },
  { id:5, test:"Electromagnetism — Quiz 1",   date:"08 Oct 2026", score:61, total:100, status:"released", flagged:0 },
  { id:6, test:"Foundations — Diagnostic",    date:"01 Oct 2026", score:68, total:100, status:"released", flagged:0 },
];

export const ATTEMPT_DETAIL = [
  { id:1, type:"MCQ",        topic:"Newton's Laws", marks:2, earned:2,   text:"A 5 kg block rests on a frictionless surface. A force of 20 N is applied. What is the acceleration?", answer:"4 m/s²", correct:"4 m/s²", remark:"" },
  { id:2, type:"Short answer",topic:"Newton's Laws", marks:4, earned:3.5, text:"State Newton's Second Law and explain how it relates to inertia.", answer:"F = ma. Inertia is resistance to change in motion, proportional to mass.", remark:"Strong. Next time use 'net external force'." },
  { id:3, type:"MCQ",        topic:"Thermodynamics", marks:2, earned:2,   text:"In isothermal expansion of an ideal gas, which quantity remains constant?", answer:"Internal energy", correct:"Internal energy", remark:"" },
  { id:4, type:"Numerical",  topic:"Kinematics", marks:3, earned:2,   text:"A 1200 kg car decelerates from 25 m/s to rest in 8 s. Find the average braking force.", answer:"3750 N", correct:"3750 N", remark:"Correct answer, but the sign convention wasn't shown." },
];

export const LIVE_STUDENTS = [
  { name:"Maya Okafor",     status:"active",    progress:7,  flags:0, time:"18:42" },
  { name:"Sofia Lindqvist", status:"active",    progress:9,  flags:0, time:"18:42" },
  { name:"Priya Nair",      status:"active",    progress:5,  flags:0, time:"18:42" },
  { name:"Jayden Park",     status:"active",    progress:8,  flags:0, time:"18:42" },
  { name:"Adrian Bell",     status:"flagged",   progress:6,  flags:3, time:"18:42" },
  { name:"Tomás Reyes",     status:"active",    progress:4,  flags:1, time:"18:42" },
  { name:"Amelia Chen",     status:"submitted", progress:10, flags:0, time:"18:39" },
  { name:"Marcus Webb",     status:"submitted", progress:10, flags:0, time:"18:38" },
  { name:"Layla Hassan",    status:"active",    progress:6,  flags:0, time:"18:42" },
  { name:"Dmitri Volkov",   status:"active",    progress:3,  flags:0, time:"18:42" },
];

export const GRADE_QUEUE = [
  { id:"g1",  student:"Tomás Reyes",     roll:"11A-28", test:"Newton's Laws — Unit Test",   date:"14 Nov", question:"State Newton's Second Law and explain how it relates to inertia.", answer:"Newton said that things keep moving until something stops them.", aiScore:1,   maxScore:4, confidence:"low",  status:"pending",  flags:1, reviewed:false },
  { id:"g2",  student:"Adrian Bell",     roll:"11A-04", test:"Newton's Laws — Unit Test",   date:"14 Nov", question:"State Newton's Second Law and explain how it relates to inertia.", answer:"Newton's second law says that force equals mass times acceleration. It relates to inertia because a heavier object needs more force to accelerate the same amount.", aiScore:3.5, maxScore:4, confidence:"high", status:"pending",  flags:2, reviewed:false },
  { id:"g3",  student:"Maya Okafor",     roll:"11A-19", test:"Newton's Laws — Unit Test",   date:"14 Nov", question:"State Newton's Second Law and explain how it relates to inertia.", answer:"F = ma. Inertia is the resistance to change in motion, and it's proportional to mass — so a larger mass needs a larger net force for the same acceleration.", aiScore:4,   maxScore:4, confidence:"high", status:"reviewed", flags:0, reviewed:true },
  { id:"g4",  student:"Priya Nair",      roll:"11A-22", test:"Newton's Laws — Unit Test",   date:"14 Nov", question:"State Newton's Second Law and explain how it relates to inertia.", answer:"The second law states F = ma. Inertia is an object's resistance to a change in its velocity, and this resistance scales with mass.", aiScore:3.5, maxScore:4, confidence:"med",  status:"pending",  flags:0, reviewed:false },
  { id:"g5",  student:"Jayden Park",     roll:"11A-15", test:"Thermodynamics — Quiz 3",     date:"07 Nov", question:"Compare isothermal and adiabatic processes for an ideal gas.", answer:"In an isothermal process, temperature is constant, so internal energy is constant for an ideal gas. In an adiabatic process, no heat is exchanged, so any work done changes the internal energy.", aiScore:4,   maxScore:5, confidence:"high", status:"reviewed", flags:0, reviewed:true },
  { id:"g6",  student:"Sofia Lindqvist", roll:"11A-25", test:"Thermodynamics — Quiz 3",     date:"07 Nov", question:"Compare isothermal and adiabatic processes for an ideal gas.", answer:"Isothermal means same temperature. Adiabatic means no heat flow.", aiScore:2.5, maxScore:5, confidence:"med",  status:"pending",  flags:0, reviewed:false },
  { id:"g7",  student:"Dmitri Volkov",   roll:"11A-11", test:"Thermodynamics — Quiz 3",     date:"07 Nov", question:"Compare isothermal and adiabatic processes for an ideal gas.", answer:"An isothermal process holds temperature steady. An adiabatic process has no heat transfer into or out of the gas.", aiScore:4,   maxScore:5, confidence:"high", status:"pending",  flags:0, reviewed:false },
  { id:"g8",  student:"Layla Hassan",    roll:"11A-17", test:"Kinematics — Unit Test",      date:"28 Oct", question:"A car decelerates uniformly from 25 m/s to rest in 8 s. Find the average braking force on a 1200 kg car.", answer:"a = (0 - 25)/8 = -3.125 m/s². F = 1200 × 3.125 = 3750 N.", aiScore:3,   maxScore:3, confidence:"high", status:"reviewed", flags:0, reviewed:true },
  { id:"g9",  student:"Marcus Webb",     roll:"11A-20", test:"Kinematics — Unit Test",      date:"28 Oct", question:"A car decelerates uniformly from 25 m/s to rest in 8 s. Find the average braking force on a 1200 kg car.", answer:"Force = mass × acceleration. The acceleration is 25/8, so force is 1200 × 3.125 = 3750 N.", aiScore:2.5, maxScore:3, confidence:"med",  status:"pending",  flags:0, reviewed:false },
  { id:"g10", student:"Amelia Chen",     roll:"11A-01", test:"Kinematics — Unit Test",      date:"28 Oct", question:"A car decelerates uniformly from 25 m/s to rest in 8 s. Find the average braking force on a 1200 kg car.", answer:"Deceleration = 25/8 = 3.125 m/s². Braking force = 1200 × 3.125 = 3750 N directed opposite to motion.", aiScore:3,   maxScore:3, confidence:"high", status:"reviewed", flags:0, reviewed:true },
  { id:"g11", student:"Tomás Reyes",     roll:"11A-28", test:"Wave Optics — Quiz 2",        date:"19 Oct", question:"An object sits 15 cm from a converging lens of focal length 10 cm. Where is the image?", answer:"Using 1/f = 1/v - 1/u, the image forms 30 cm on the other side.", aiScore:1.5, maxScore:4, confidence:"low",  status:"flagged", flags:1, reviewed:false },
  { id:"g12", student:"Adrian Bell",     roll:"11A-04", test:"Wave Optics — Quiz 2",        date:"19 Oct", question:"An object sits 15 cm from a converging lens of focal length 10 cm. Where is the image?", answer:"The image forms at 30 cm, real and inverted.", aiScore:3,   maxScore:4, confidence:"high", status:"pending",  flags:2, reviewed:false },
];

export const LMS_COURSES = [
  { id:1, title:"Physics — Newtonian Mechanics", subject:"Physics", students:32, lessons:8,
    items:[
      { id:"l1", kind:"text",  title:"Introduction to force and motion", duration:"8 min",  done:32 },
      { id:"l2", kind:"video", title:"Newton's three laws, worked examples", duration:"14 min", done:28 },
      { id:"l3", kind:"file",  title:"Free body diagram reference sheet",  duration:"PDF",     done:22 },
      { id:"l4", kind:"text",  title:"Applying F = ma to real problems", duration:"12 min", done:19 },
      { id:"l5", kind:"video", title:"Common mistakes with sign conventions", duration:"9 min", done:14 },
    ] },
  { id:2, title:"Physics — Waves & Optics", subject:"Physics", students:32, lessons:6,
    items:[
      { id:"w1", kind:"text",  title:"Wave properties and terminology",  duration:"10 min", done:32 },
      { id:"w2", kind:"video", title:"Refraction and Snell's law",        duration:"16 min", done:25 },
      { id:"w3", kind:"file",  title:"Lens equation practice problems",   duration:"PDF",     done:18 },
    ] },
  { id:3, title:"Chemistry — Bonding & Structure", subject:"Chemistry", students:28, lessons:5,
    items:[
      { id:"c1", kind:"text",  title:"Ionic vs covalent bonds", duration:"11 min", done:26 },
    ] },
];

export const MY_LESSONS = [
  { id:"l1", kind:"text",  title:"Introduction to force and motion", duration:"8 min",  done:true,
    body:"Force is any interaction that changes an object's motion. Newton's first law states that an object at rest stays at rest unless acted on by a net external force." },
  { id:"l2", kind:"video", title:"Newton's three laws, worked examples", duration:"14 min", done:true,
    body:"Video walkthrough of the three laws with classroom demonstrations." },
  { id:"l3", kind:"file",  title:"Free body diagram reference sheet",  duration:"PDF",     done:true,
    body:"A printable one-page reference for drawing force diagrams correctly." },
  { id:"l4", kind:"text",  title:"Applying F = ma to real problems", duration:"12 min", done:false,
    body:"Once you can draw a free body diagram, the algebra is straightforward. Identify all forces, sum them by axis, and solve for the unknown." },
  { id:"l5", kind:"video", title:"Common mistakes with sign conventions", duration:"9 min", done:false,
    body:"The five most common errors students make when assigning signs to forces and accelerations." },
];

// ═══════════════════════════════════════════════════════════════
// QUESTION BANK
// ═══════════════════════════════════════════════════════════════
export const QUESTION_BANK = [
  { id: "q1", text: "A 5 kg block rests on a frictionless horizontal surface. A horizontal force of 20 N is applied. What is the block's acceleration?", topic: "Newton's Laws of Motion", type: "MCQ", marks: 2, source: "past-paper", used: 4, lastUsed: "14 Nov 2026",
    options: ["2 m/s²", "4 m/s²", "10 m/s²", "25 m/s²"],
    rubric: [{ label: "Correct application of F = ma", points: 2 }] },
  { id: "q2", text: "State Newton's Second Law of Motion and explain, in your own words, how it relates to the concept of inertia.", topic: "Newton's Laws of Motion", type: "Short answer", marks: 4, source: "past-paper", used: 6, lastUsed: "14 Nov 2026",
    rubric: [{ label: "Correctly states the law", points: 2 }, { label: "Connects to inertia", points: 1 }, { label: "Uses correct terminology", points: 1 }] },
  { id: "q3", text: "In an isothermal expansion of an ideal gas, which quantity remains constant throughout the process?", topic: "Thermodynamics", type: "MCQ", marks: 2, source: "past-paper", used: 3, lastUsed: "07 Nov 2026",
    options: ["Internal energy", "Pressure", "Volume", "Heat transferred"],
    rubric: [{ label: "Correct choice", points: 2 }] },
  { id: "q4", text: "A car of mass 1200 kg decelerates uniformly from 25 m/s to rest in 8 seconds. Calculate the magnitude of the average braking force.", topic: "Kinematics", type: "Numerical", marks: 3, source: "generated", used: 2, lastUsed: "28 Oct 2026",
    rubric: [{ label: "Correct deceleration", points: 1 }, { label: "Correct force magnitude", points: 1 }, { label: "Correct units and direction", points: 1 }] },
  { id: "q5", text: "Compare isothermal and adiabatic processes for an ideal gas, giving one real-world example of each.", topic: "Thermodynamics", type: "Short answer", marks: 5, source: "generated", used: 1, lastUsed: "07 Nov 2026",
    rubric: [{ label: "Defines both correctly", points: 2 }, { label: "Explains energy exchange", points: 2 }, { label: "Provides valid examples", points: 1 }] },
  { id: "q6", text: "An object sits 15 cm from a converging lens of focal length 10 cm. Where is the image, and is it real or virtual?", topic: "Wave Optics", type: "Numerical", marks: 4, source: "past-paper", used: 5, lastUsed: "19 Oct 2026",
    rubric: [{ label: "Uses lens equation correctly", points: 2 }, { label: "Correct image distance", points: 1 }, { label: "States real/inverted", points: 1 }] },
  { id: "q7", text: "Draw the free body diagram for a 3 kg mass resting on a 30° frictionless incline. Label every force.", topic: "Newton's Laws of Motion", type: "Short answer", marks: 4, source: "past-paper", used: 6, lastUsed: "14 Nov 2026",
    rubric: [{ label: "Gravity shown correctly", points: 1 }, { label: "Normal force perpendicular", points: 1 }, { label: "Components resolved", points: 2 }] },
  { id: "q8", text: "Two carts of mass 2 kg and 3 kg collide and stick together. If the 2 kg cart was moving at 4 m/s and the 3 kg cart was at rest, what is their combined velocity?", topic: "Kinematics", type: "Numerical", marks: 3, source: "past-paper", used: 4, lastUsed: "28 Oct 2026",
    rubric: [{ label: "Correct momentum conservation", points: 2 }, { label: "Correct final velocity", points: 1 }] },
  { id: "q9", text: "Explain why a person standing in a moving bus falls forward when the bus stops suddenly.", topic: "Newton's Laws of Motion", type: "Short answer", marks: 3, source: "generated", used: 2, lastUsed: "14 Nov 2026",
    rubric: [{ label: "References inertia", points: 2 }, { label: "Correct direction explained", points: 1 }] },
  { id: "q10", text: "A ball is thrown vertically upward with an initial speed of 15 m/s. Calculate the maximum height it reaches, taking g = 10 m/s².", topic: "Kinematics", type: "Numerical", marks: 3, source: "generated", used: 1, lastUsed: "28 Oct 2026",
    rubric: [{ label: "Correct kinematic equation", points: 1 }, { label: "Correct substitution", points: 1 }, { label: "Correct final answer (11.25 m)", points: 1 }] },
];

// ═══════════════════════════════════════════════════════════════
// STUDENT PROFILES
// ═══════════════════════════════════════════════════════════════
export const STUDENT_PROFILES = {
  default: { attempts: 6, strongScore: 92, weakScore: 58, gap: 6, trailing: false, bias: { overall: 0 } },
  "Maya Okafor":     { attempts: 6, strongScore: 95, weakScore: 38, gap: 3,  trailing: true,  bias: { overall: 2, "Wave Optics": -8, "Newton's Laws of Motion": 3 } },
  "Sofia Lindqvist": { attempts: 6, strongScore: 91, weakScore: 62, gap: 4,  trailing: false, bias: { overall: 4, "Thermodynamics": -12, "Kinematics": 4 } },
  "Priya Nair":      { attempts: 6, strongScore: 88, weakScore: 66, gap: 1,  trailing: false, bias: { overall: 1, "Thermodynamics": -8 } },
  "Jayden Park":     { attempts: 6, strongScore: 88, weakScore: 60, gap: -3, trailing: false, bias: { overall: -3, "Electromagnetism": -6 } },
  "Adrian Bell":     { attempts: 6, strongScore: 82, weakScore: 52, gap: -6, trailing: false, bias: { overall: -6, "Electromagnetism": -8, "Newton's Laws of Motion": 2 } },
  "Tomás Reyes":     { attempts: 6, strongScore: 78, weakScore: 42, gap: -12,trailing: false, bias: { overall: -12, "Wave Optics": -10, "Gravitation": 4 } },
};

// ═══════════════════════════════════════════════════════════════
// CHART PRIMITIVES
// ═══════════════════════════════════════════════════════════════
export const Spark = ({ data, color="#5B9BD5", height=22 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data.map((v,i)=>({i,v}))} margin={{ top:2, right:2, bottom:2, left:2 }}>
      <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
    </LineChart>
  </ResponsiveContainer>
);

export const Trend = ({ data, series, height=200, focal }) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data} margin={{ top:16, right:36, bottom:8, left:4 }}>
      <XAxis dataKey="t" axisLine={{ stroke:"#252A35", strokeWidth:1 }} tickLine={false} tick={AXIS} />
      <YAxis domain={[50,100]} axisLine={false} tickLine={false} tick={AXIS} width={32} />
      <Tooltip {...TIP} cursor={{ stroke:"#333A47", strokeWidth:1 }} />
      {series.map((s,i)=>(<Line key={i} type="monotone" dataKey={s.key} stroke={s.color}
        strokeWidth={s.width||1.5} strokeDasharray={s.dash} dot={false}
        isAnimationActive={false} name={s.label} />))}
      {focal != null && <ReferenceDot x={data[data.length-1].t} y={focal} r={3.5} fill="#FF4D1C" stroke="none" />}
    </LineChart>
  </ResponsiveContainer>
);

export const SmallMultiple = ({ topic }) => {
  const cls = topic.accuracy < 60 ? "weak" : topic.accuracy < 80 ? "mid" : "";
  const color = topic.accuracy < 60 ? "#FF4D1C" : topic.accuracy < 80 ? "#D9A63E" : "#3DB87F";
  const gid = `sg-${topic.name.replace(/\W/g,"")}`;
  return (
    <div className="sm-cell">
      <div className="sm-topic">{topic.name}</div>
      <div className={"sm-val " + cls}>{topic.accuracy}%</div>
      <div className="sm-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={topic.trend.map((v,i)=>({i,v}))} margin={{ top:2, right:0, bottom:0, left:0 }}>
            <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient></defs>
            <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.2} fill={`url(#${gid})`} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const DotPlot = ({ rows }) => {
  const sorted = [...rows].sort((a,b)=>a.accuracy-b.accuracy);
  return (
    <div className="dotplot">
      {sorted.map((r,i)=>{
        const cls = r.accuracy < 60 ? "weak" : r.accuracy < 80 ? "mid" : "ok";
        return (
          <div key={i} className="dp-row">
            <div className="dp-label">{r.name}</div>
            <div className="dp-track">
              <div className="dp-axis" />
              {[25,50,75].map(p=><div key={p} className="dp-tick" style={{left:`${p}%`}} />)}
              <div className={"dp-dot " + cls} style={{left:`${r.accuracy}%`}} />
            </div>
            <div className="dp-val">{r.accuracy}%</div>
          </div>
        );
      })}
      <div className="dp-scale">
        <div className="dp-scale-mid"><span>0%</span><span>25</span><span>50</span><span>75</span><span>100%</span></div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// SHARED UI
// ═══════════════════════════════════════════════════════════════
export const Conn = ({ state="live", secs=12 }) => {
  const cfg = { live:{label:"Live"}, polling:{label:"Polling"}, retry:{label:"Reconnecting"}, down:{label:"Offline"} }[state];
  return <span className={"conn " + state} title={`Updated ${secs}s ago`}><span className="beacon" />{cfg.label}</span>;
};

export const SearchIcon = ({ size=15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const Icon = ({ name, size=18 }) => {
  const p = {
    upload: <path d="M12 16V4M12 4l-4 4M12 4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>,
    spark: <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>,
    check: <path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>,
    warn: <path d="M12 4l9 16H3L12 4z M12 10v4 M12 17v.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>,
    minus: <path d="M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>,
    plus: <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink:0}}>{p[name]}</svg>;
};

// ═══════════════════════════════════════════════════════════════
// NUMBER STEPPER
// ═══════════════════════════════════════════════════════════════
export const NumberStepper = ({ value, onChange, min = 1, max = 100, step = 1, suffix, id }) => {
  const clamp = (v) => Math.max(min, Math.min(max, v));
  const handleInput = (raw) => {
    const digits = raw.replace(/[^0-9]/g, "");
    if (digits === "") { onChange(min); return; }
    onChange(clamp(parseInt(digits, 10)));
  };
  return (
    <div className="stepper" role="group" aria-labelledby={id}>
      <button type="button" className="stepper-btn" onClick={() => onChange(clamp(value - step))} disabled={value <= min} aria-label="Decrease">
        <Icon name="minus" size={14} />
      </button>
      <input id={id} type="text" inputMode="numeric" pattern="[0-9]*" className="stepper-input" value={value}
        onChange={(e) => handleInput(e.target.value)} onBlur={(e) => { if (e.target.value === "") onChange(min); }} aria-label="Value" />
      <button type="button" className="stepper-btn" onClick={() => onChange(clamp(value + step))} disabled={value >= max} aria-label="Increase">
        <Icon name="plus" size={14} />
      </button>
      {suffix && <span className="stepper-suffix">{suffix}</span>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// TOPIC INPUT
// ═══════════════════════════════════════════════════════════════
export const TopicInput = ({ value, onChange, suggestions = [], max = 6, placeholder = "Type or pick a topic…" }) => {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const add = (topic) => {
    const t = topic.trim();
    if (!t) return;
    if (value.includes(t)) { setInput(""); return; }
    if (value.length >= max) return;
    onChange([...value, t]);
    setInput("");
  };
  const remove = (topic) => onChange(value.filter((t) => t !== topic));
  const filtered = suggestions.filter((s) => !value.includes(s.name)).filter((s) => s.name.toLowerCase().includes(input.trim().toLowerCase()));
  const exactMatch = value.includes(input.trim()) || suggestions.some((s) => s.name.toLowerCase() === input.trim().toLowerCase());
  const showCustomOption = input.trim() && !exactMatch && value.length < max;
  const handleKey = (e) => {
    if (e.key === "Enter" && input.trim()) { e.preventDefault(); add(input); }
    if (e.key === "Backspace" && !input && value.length) remove(value[value.length - 1]);
    if (e.key === "Escape") setInput("");
  };
  return (
    <div className="topic-input">
      <div className="topic-chips" onClick={(e) => e.currentTarget.querySelector("input")?.focus()}>
        {value.map((t) => (
          <span key={t} className="topic-chip">
            {t}
            <button type="button" onClick={(e) => { e.stopPropagation(); remove(t); }} aria-label={`Remove ${t}`}>×</button>
          </span>
        ))}
        <input className="topic-field" value={input} onChange={(e) => setInput(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 160)}
          onKeyDown={handleKey} placeholder={value.length === 0 ? placeholder : ""}
          disabled={value.length >= max} aria-label="Add a topic" />
      </div>
      {focused && (filtered.length > 0 || showCustomOption) && (
        <div className="topic-suggest" role="listbox">
          {filtered.slice(0, 5).map((s) => (
            <button key={s.name} type="button" className="topic-suggest-item" onMouseDown={(e) => { e.preventDefault(); add(s.name); }}>
              <span>{s.name}</span>
              {s.meta && <span className="topic-suggest-meta">{s.meta}</span>}
            </button>
          ))}
          {showCustomOption && (
            <button type="button" className="topic-suggest-item topic-suggest-new" onMouseDown={(e) => { e.preventDefault(); add(input); }}>
              <span>Add “{input.trim()}”</span>
              <span className="topic-suggest-meta">Custom</span>
            </button>
          )}
        </div>
      )}
      <div className="topic-hint">{value.length}/{max} selected · press Enter to add a custom topic</div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════
// CLASS ROSTERS — used by admin ClassDetail
// ═══════════════════════════════════════════════════════════════
export const CLASS_ROSTERS = {
  "Grade 11 — Section A": {
    teachers: [
      { name: "Dr. R. Chen", email: "r.chen@westfield.edu", subjects: ["Physics", "Maths"], classes: 2 },
      { name: "Mrs. L. Park", email: "l.park@westfield.edu", subjects: ["Chemistry"], classes: 2 },
    ],
    students: [
      { name: "Amelia Chen",     roll: "11A-01", email: "a.chen@westfield.edu",     avg: 91, status: "Active" },
      { name: "Adrian Bell",     roll: "11A-04", email: "a.bell@westfield.edu",     avg: 78, status: "Active" },
      { name: "Dmitri Volkov",   roll: "11A-11", email: "d.volkov@westfield.edu",   avg: 74, status: "Active" },
      { name: "Jayden Park",     roll: "11A-15", email: "j.park@westfield.edu",     avg: 81, status: "Active" },
      { name: "Layla Hassan",    roll: "11A-17", email: "l.hassan@westfield.edu",   avg: 88, status: "Active" },
      { name: "Maya Okafor",     roll: "11A-19", email: "m.okafor@westfield.edu",   avg: 91, status: "Active" },
      { name: "Marcus Webb",     roll: "11A-20", email: "m.webb@westfield.edu",     avg: 69, status: "Active" },
      { name: "Priya Nair",      roll: "11A-22", email: "p.nair@westfield.edu",     avg: 85, status: "Active" },
      { name: "Sofia Lindqvist", roll: "11A-25", email: "s.lindqvist@westfield.edu",avg: 88, status: "Active" },
      { name: "Tomás Reyes",     roll: "11A-28", email: "t.reyes@westfield.edu",    avg: 72, status: "Inactive" },
    ],
  },
  "Grade 11 — Section B": {
    teachers: [
      { name: "Mr. D. Osei", email: "d.osei@westfield.edu", subjects: ["Biology"], classes: 1 },
    ],
    students: [
      { name: "Hana Yamada",     roll: "11B-02", email: "h.yamada@westfield.edu",   avg: 84, status: "Active" },
      { name: "Kofi Mensah",     roll: "11B-05", email: "k.mensah@westfield.edu",   avg: 79, status: "Active" },
      { name: "Lucia Romano",    roll: "11B-08", email: "l.romano@westfield.edu",   avg: 82, status: "Active" },
      { name: "Noah Bergström",  roll: "11B-12", email: "n.bergstrom@westfield.edu",avg: 76, status: "Active" },
      { name: "Ravi Sharma",     roll: "11B-16", email: "r.sharma@westfield.edu",   avg: 87, status: "Active" },
      { name: "Zara Ahmed",      roll: "11B-21", email: "z.ahmed@westfield.edu",    avg: 90, status: "Active" },
    ],
  },
  "Grade 10 — Section A": {
    teachers: [
      { name: "Mrs. L. Park", email: "l.park@westfield.edu", subjects: ["Chemistry"], classes: 2 },
    ],
    students: [
      { name: "Aiden Kelly",     roll: "10A-03", email: "a.kelly@westfield.edu",    avg: 73, status: "Active" },
      { name: "Beatriz Silva",   roll: "10A-07", email: "b.silva@westfield.edu",    avg: 85, status: "Active" },
      { name: "Chen Wu",         roll: "10A-09", email: "c.wu@westfield.edu",       avg: 92, status: "Active" },
      { name: "Elena Petrova",   roll: "10A-14", email: "e.petrova@westfield.edu",  avg: 80, status: "Active" },
      { name: "Farid Khalil",    roll: "10A-18", email: "f.khalil@westfield.edu",   avg: 77, status: "Active" },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
// LMS LESSONS (per course, keyed by course id)
// ═══════════════════════════════════════════════════════════════
export const LMS_LESSONS = {
  1: [
    { id:"l1", kind:"text",  title:"Introduction to force and motion", duration:"8 min",  done:true,
      body:"Force is any interaction that changes an object's motion. Newton's first law states that an object at rest stays at rest unless acted on by a net external force. Practically, this means that without a net force, velocity does not change — an object stays still if still, and keeps drifting at the same speed in the same direction if moving." },
    { id:"l2", kind:"video", title:"Newton's three laws, worked examples", duration:"14 min", done:true,
      url:"https://www.youtube.com/watch?v=kKKM8Y-u7ds",
      body:"A visual walkthrough of the three laws using classroom demonstrations." },
    { id:"l3", kind:"file",  title:"Free body diagram reference sheet.pdf", duration:"2 pages", done:true,
      url:"https://res.cloudinary.com/demo/image/upload/sample.pdf",
      body:"A one-page reference you can keep on your desk when solving problems." },
    { id:"l4", kind:"text",  title:"Applying F = ma to real problems", duration:"12 min", done:false,
      body:"Once you can draw a free body diagram, the algebra is straightforward. Identify all forces, resolve them by axis, sum them, and solve for the unknown. Remember that Σ F = ma applies component by component." },
    { id:"l5", kind:"video", title:"Common mistakes with sign conventions", duration:"9 min", done:false,
      url:"https://www.youtube.com/watch?v=Z7XeTUvK6BU",
      body:"The five most common errors students make when assigning signs to forces and accelerations." },
  ],
  2: [
    { id:"w1", kind:"text",  title:"Wave properties and terminology", duration:"10 min", done:true,
      body:"Wavelength, frequency, amplitude, and speed are the four properties every wave has. The relationship v = f λ ties them together." },
    { id:"w2", kind:"video", title:"Refraction and Snell's law", duration:"16 min", done:false,
      url:"https://www.youtube.com/watch?v=kJ4i5v6j1XU",
      body:"How light bends when it crosses between media, and how to use Snell's law to calculate the angles." },
  ],
  3: [
    { id:"c1", kind:"text",  title:"Ionic vs covalent bonds", duration:"11 min", done:false,
      body:"Ionic bonds form between metals and non-metals through electron transfer. Covalent bonds form between non-metals through electron sharing." },
  ],
};

// ═══════════════════════════════════════════════════════════════
// CLASS DISCUSSION — seeded threads
// ═══════════════════════════════════════════════════════════════
export const CLASS_THREADS = [
  {
    id: 1,
    title: "Lens sign convention — when is v negative?",
    body: "In the lens equation 1/f = 1/v − 1/u, I keep getting confused about when the image distance is negative. Can someone explain with a concrete example?",
    author: "Tomás Reyes", role: "student", tag: "Question",
    time: "2 hours ago", lastActivity: 100, pinned: false, resolved: false,
    replies: [
      { id: 11, author: "Maya Okafor", role: "student",
        body: "I always check: if the image forms on the same side as the object, it's virtual, so v is negative. Otherwise positive.",
        time: "1 hour ago" },
      { id: 12, author: "Dr. R. Chen", role: "teacher",
        body: "Maya's rule is correct for a single thin lens. The cleanest way is to draw the ray diagram first — the geometry tells you which side the image is on before you ever write an equation.",
        time: "45 min ago" },
    ],
  },
  {
    id: 2,
    title: "Extra practice problems for Wave Optics",
    body: "I've uploaded a 4-page set of extra problems focused on sign conventions and image formation. The answers are on the last page. Try them before Thursday's test.",
    author: "Dr. R. Chen", role: "teacher", tag: "Resource",
    time: "yesterday", lastActivity: 95, pinned: true, resolved: false,
    replies: [
      { id: 21, author: "Priya Nair", role: "student",
        body: "Thanks — these are perfect. Q7 was tricky but I got it after looking at the diagram again.",
        time: "22 hours ago" },
    ],
  },
  {
    id: 3,
    title: "Study group for the mid-term?",
    body: "Would anyone want to meet in the library on Saturday morning to review Newton's Laws together? Thinking 10 AM, 90 minutes.",
    author: "Sofia Lindqvist", role: "student", tag: "Discussion",
    time: "3 days ago", lastActivity: 90, pinned: false, resolved: false,
    replies: [
      { id: 31, author: "Jayden Park", role: "student", body: "Count me in.", time: "3 days ago" },
      { id: 32, author: "Amelia Chen", role: "student", body: "Same. I'll bring the past papers.", time: "2 days ago" },
      { id: 33, author: "Dmitri Volkov", role: "student", body: "Can we push to 11? I have something until 10:30.", time: "2 days ago" },
    ],
  },
  {
    id: 4,
    title: "Reminder: test on Thursday covers Units 3 and 4",
    body: "Reminder that Thursday's test covers thermodynamics and waves. Format: 10 MCQs, 5 short answers, 2 long answers. Bring your calculators.",
    author: "Dr. R. Chen", role: "teacher", tag: "Announcement",
    time: "4 days ago", lastActivity: 80, pinned: true, resolved: false,
    replies: [],
  },
  {
    id: 5,
    title: "Understanding adiabatic vs isothermal — cleared up",
    body: "I was confused about the difference but after doing the two problems from Section 5.3 it clicked. In adiabatic processes Q = 0; in isothermal processes ΔU = 0.",
    author: "Layla Hassan", role: "student", tag: "Discussion",
    time: "5 days ago", lastActivity: 70, pinned: false, resolved: true,
    replies: [
      { id: 51, author: "Dr. R. Chen", role: "teacher",
        body: "Exactly right, Layla. Marking this resolved.",
        time: "5 days ago" },
    ],
  },
];