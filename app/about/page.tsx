'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Download, Mail, Github, Linkedin, Globe, Cpu, Code, Database, Terminal } from 'lucide-react'
import AuthDecor from '../components/AuthDecor'
import NoiseOverlay from '../components/NoiseOverlay'
import GlitchText from '../components/GlitchText'
import TextScramble from '../components/TextScramble'
import MagneticButton from '../components/MagneticButton'

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-amber-500/30 selection:text-white relative overflow-hidden">
            <AuthDecor />
            <NoiseOverlay />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full p-8 z-50 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto">
                    <Link href="/" className="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Return to Base</span>
                    </Link>
                </div>
            </nav>

            <div className="relative z-10 container mx-auto px-6 py-32 md:py-48 max-w-5xl">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-24 space-y-8"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="font-mono text-xs uppercase tracking-widest text-emerald-500">Identity Record</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-8xl font-display tracking-tighter uppercase leading-none">
                        <GlitchText text="Mohammed" /> <br/>
                        <span className="text-amber-500"><GlitchText text="Qambar" /></span> <br/>
                        <GlitchText text="Syed" />
                    </h1>

                    <p className="font-mono text-gray-400 max-w-2xl leading-relaxed text-sm md:text-base border-l-2 border-white/10 pl-6">
                        <TextScramble>
                            Aspiring Machine Learning & XR Developer. Building intelligent systems, automation workflows, and full-stack AI applications.
                        </TextScramble>
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <MagneticButton>
                            <a href="/MohammedQambarResume.pdf" download className="flex items-center gap-2 px-6 py-3 bg-white text-black font-display uppercase tracking-wider text-sm hover:bg-amber-400 transition-colors rounded-full">
                                <Download className="w-4 h-4" />
                                Download Resume
                            </a>
                        </MagneticButton>
                        
                        <div className="flex gap-4 items-center px-6">
                            <a href="https://github.com/Qambar-dev-0207" target="_blank" className="text-gray-400 hover:text-white transition-colors"><Github className="w-5 h-5"/></a>
                            <a href="https://linkedin.com/in/mohammed-qambar-0466132b9" target="_blank" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5"/></a>
                            <a href="https://qambars-portfolio.netlify.app" target="_blank" className="text-gray-400 hover:text-white transition-colors"><Globe className="w-5 h-5"/></a>
                            <a href="mailto:work.qambar@gmail.com" className="text-gray-400 hover:text-white transition-colors"><Mail className="w-5 h-5"/></a>
                        </div>
                    </div>
                </motion.div>


                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
                    
                    {/* Sidebar / Skills */}
                    <div className="md:col-span-4 space-y-12">
                        
                        <div className="space-y-6">
                            <h3 className="font-display text-2xl uppercase tracking-widest border-b border-white/10 pb-2">Core Systems</h3>
                            
                            <div className="space-y-4">
                                <div className="group">
                                    <h4 className="font-mono text-xs uppercase text-gray-500 mb-2 flex items-center gap-2">
                                        <Code className="w-3 h-3" /> Languages
                                    </h4>
                                    <p className="font-display text-lg text-white group-hover:text-amber-400 transition-colors">Python, Java, JavaScript</p>
                                </div>
                                <div className="group">
                                    <h4 className="font-mono text-xs uppercase text-gray-500 mb-2 flex items-center gap-2">
                                        <Cpu className="w-3 h-3" /> AI & ML
                                    </h4>
                                    <p className="font-display text-lg text-white group-hover:text-amber-400 transition-colors">TensorFlow, PyTorch, OpenCV, NLP</p>
                                </div>
                                <div className="group">
                                    <h4 className="font-mono text-xs uppercase text-gray-500 mb-2 flex items-center gap-2">
                                        <Terminal className="w-3 h-3" /> Backend
                                    </h4>
                                    <p className="font-display text-lg text-white group-hover:text-amber-400 transition-colors">FastAPI, Node.js, REST APIs</p>
                                </div>
                                <div className="group">
                                    <h4 className="font-mono text-xs uppercase text-gray-500 mb-2 flex items-center gap-2">
                                        <Database className="w-3 h-3" /> Data
                                    </h4>
                                    <p className="font-display text-lg text-white group-hover:text-amber-400 transition-colors">MongoDB, MySQL</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border border-white/10 bg-white/5 rounded-xl backdrop-blur-sm">
                            <h4 className="font-mono text-xs uppercase text-emerald-500 mb-4 tracking-widest">Education</h4>
                            <div className="space-y-6">
                                <div>
                                    <p className="font-display text-lg">B.Tech CS Engineering</p>
                                    <p className="text-gray-400 text-sm font-mono">Integral University • 2024-2027</p>
                                    <p className="text-amber-500 text-xs font-mono mt-1">CGPA: 8.5</p>
                                </div>
                                <div>
                                    <p className="font-display text-lg">Diploma CS Engineering</p>
                                    <p className="text-gray-400 text-sm font-mono">Integral University • 2021-2024</p>
                                    <p className="text-amber-500 text-xs font-mono mt-1">CGPA: 7.5</p>
                                </div>
                            </div>
                        </div>

                    </div>


                    {/* Main Content / Experience & Projects */}
                    <div className="md:col-span-8 space-y-20">
                        
                        {/* Experience */}
                        <section>
                            <h3 className="font-display text-2xl uppercase tracking-widest border-b border-white/10 pb-4 mb-8 flex items-center gap-3">
                                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                Operational History
                            </h3>
                            
                            <div className="relative border-l border-white/10 pl-8 ml-3 space-y-12">
                                <div className="relative group">
                                    <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-black border border-white/20 group-hover:border-amber-500 group-hover:bg-amber-500 transition-colors"></div>
                                    <div className="flex justify-between items-baseline mb-2 flex-wrap gap-2">
                                        <h4 className="font-display text-2xl">AI Engineer Intern</h4>
                                        <span className="font-mono text-xs text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-500/10">Feb 2025 - Aug 2025</span>
                                    </div>
                                    <p className="font-mono text-sm text-gray-500 uppercase tracking-wide mb-4">Robotics Lab, Integral University</p>
                                    <ul className="space-y-2 text-gray-300 font-mono text-sm leading-relaxed list-disc list-inside marker:text-amber-500">
                                        <li>Designed and developed LeafLens CNN-based plant disease detection model.</li>
                                        <li>Improved accuracy from 70% to 83% via dataset restructuring & transfer learning.</li>
                                        <li>Built automated pipelines for symptom-based dataset creation and augmentation.</li>
                                        <li>Implemented segmentation workflows for 15+ disease categories.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Projects */}
                        <section>
                            <h3 className="font-display text-2xl uppercase tracking-widest border-b border-white/10 pb-4 mb-8 flex items-center gap-3">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                Protocol Modules
                            </h3>

                            <div className="grid gap-8">
                                
                                <motion.div 
                                    whileHover={{ y: -5 }}
                                    className="p-8 border border-white/10 bg-white/5 rounded-2xl hover:border-amber-500/50 transition-colors group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-display text-2xl group-hover:text-amber-400 transition-colors">Agentic AI Career Co-Pilot</h4>
                                        <span className="text-[10px] font-mono border border-white/20 px-2 py-1 rounded text-gray-400">Full Stack AI</span>
                                    </div>
                                    <p className="font-mono text-sm text-gray-400 mb-6 leading-relaxed">
                                        Designed a full-stack AI career assistant enabling resume optimization, skill-gap analysis, and job search automation. Built backend services for LLM-powered resume parsing and JD comparison.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {['FastAPI', 'MongoDB', 'LangChain', 'Gemini API', 'React'].map((tech) => (
                                            <span key={tech} className="text-[10px] font-mono bg-white/10 px-2 py-1 rounded text-white/70">{tech}</span>
                                        ))}
                                    </div>
                                </motion.div>

                                <motion.div 
                                    whileHover={{ y: -5 }}
                                    className="p-8 border border-white/10 bg-white/5 rounded-2xl hover:border-emerald-500/50 transition-colors group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-display text-2xl group-hover:text-emerald-400 transition-colors">LeafLens</h4>
                                        <span className="text-[10px] font-mono border border-white/20 px-2 py-1 rounded text-gray-400">Computer Vision</span>
                                    </div>
                                    <p className="font-mono text-sm text-gray-400 mb-6 leading-relaxed">
                                        Production-ready CNN model for plant leaf disease classification. Applied transfer learning and Grad-CAM explainability to achieve 83% accuracy.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {['TensorFlow', 'OpenCV', 'CNN', 'Transfer Learning'].map((tech) => (
                                            <span key={tech} className="text-[10px] font-mono bg-white/10 px-2 py-1 rounded text-white/70">{tech}</span>
                                        ))}
                                    </div>
                                </motion.div>

                                <motion.div 
                                    whileHover={{ y: -5 }}
                                    className="p-8 border border-white/10 bg-white/5 rounded-2xl hover:border-red-500/50 transition-colors group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-display text-2xl group-hover:text-red-400 transition-colors">Danger Object Detection</h4>
                                        <span className="text-[10px] font-mono border border-white/20 px-2 py-1 rounded text-gray-400">Real-Time Safety</span>
                                    </div>
                                    <p className="font-mono text-sm text-gray-400 mb-6 leading-relaxed">
                                        Real-time safety detection system using classical computer vision. Implemented custom boundary detection and contextual danger alerts without pose-detection APIs.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Python', 'OpenCV', 'Computer Vision'].map((tech) => (
                                            <span key={tech} className="text-[10px] font-mono bg-white/10 px-2 py-1 rounded text-white/70">{tech}</span>
                                        ))}
                                    </div>
                                </motion.div>

                            </div>
                        </section>

                    </div>
                </div>

            </div>
        </main>
    )
}
