'use client';
 
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { registerUser } from '@/app/lib/auth-actions';
import Link from 'next/link';
import { ArrowRight, AlertCircle, Database, Server } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthDecor from '../components/AuthDecor';

export default function RegisterPage() {
  const [state, dispatch] = useActionState(registerUser, undefined);

  return (
    <main className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-white text-black font-sans selection:bg-lime-400 selection:text-white">
      <AuthDecor />

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }} 
      />

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-0 z-10 border-x border-black/10 min-h-screen lg:min-h-0 lg:h-[600px]">
        
        {/* LEFT COLUMN: Brand & Visuals */}
        <div className="lg:col-span-7 relative p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black/10 bg-white/50 backdrop-blur-sm order-last lg:order-first">
             {/* Technical Markers */}
             <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-black/30" />
             <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-black/30" />
             <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-black/30" />
             <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-black/30" />

             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
             >
                 <div className="flex items-center gap-3 mb-8">
                     <div className="w-2 h-2 bg-lime-500 animate-pulse" />
                     <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/60">Node Creation Protocol</span>
                 </div>
                 
                 <h1 className="text-8xl md:text-9xl font-display font-bold uppercase tracking-tighter leading-[0.85] text-black mix-blend-darken">
                     New
                     <span className="block text-transparent stroke-text">Operator</span>
                 </h1>
             </motion.div>

             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
             >
                 <p className="font-mono text-sm max-w-md leading-relaxed text-black/70">
                    <span className="text-lime-600">&gt;&gt;&gt;</span> Allocating secure memory partition.
                    <br />
                    Generating unique identity hash. 
                    Writing to immutable ledger.
                 </p>

                 <div className="flex gap-1 h-12 items-end pt-4">
                     {[...Array(10)].map((_, i) => (
                         <motion.div 
                            key={i}
                            className="w-2 bg-black/10"
                            animate={{ height: [10, 30, 15, 40, 10], backgroundColor: ['rgba(0,0,0,0.1)', 'rgba(132, 204, 22, 0.8)', 'rgba(0,0,0,0.1)'] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                         />
                     ))}
                 </div>
             </motion.div>
        </div>

        {/* RIGHT COLUMN: Auth Form */}
        <div className="lg:col-span-5 relative p-8 flex flex-col justify-center bg-gray-50/50 backdrop-blur-md">
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="w-full max-w-sm mx-auto"
            >
                <div className="mb-8">
                    <h2 className="text-3xl font-display uppercase tracking-widest mb-2">Initialize</h2>
                    <div className="h-1 w-12 bg-lime-500" />
                </div>

                <form action={dispatch} className="space-y-5">
                    
                    <div className="group">
                        <label className="block font-mono text-[10px] uppercase tracking-widest text-black/40 mb-1 group-focus-within:text-lime-600 transition-colors">
                            Designation (Name)
                        </label>
                        <input 
                            name="name"
                            type="text" 
                            required
                            className="w-full bg-transparent border-b border-black/20 py-2 text-xl font-display tracking-wide text-black placeholder:text-black/10 focus:outline-none focus:border-lime-500 transition-all rounded-none"
                            placeholder="OPERATOR_01"
                        />
                    </div>

                    <div className="group">
                        <label className="block font-mono text-[10px] uppercase tracking-widest text-black/40 mb-1 group-focus-within:text-lime-600 transition-colors">
                            Identifier (Email)
                        </label>
                        <input 
                            name="email"
                            type="email" 
                            required
                            className="w-full bg-transparent border-b border-black/20 py-2 text-xl font-display tracking-wide text-black placeholder:text-black/10 focus:outline-none focus:border-lime-500 transition-all rounded-none"
                            placeholder="USER@PRAXIS.AI"
                        />
                    </div>

                    <div className="group">
                        <label className="block font-mono text-[10px] uppercase tracking-widest text-black/40 mb-1 group-focus-within:text-lime-600 transition-colors">
                            Secure Key (Password)
                        </label>
                        <input 
                            name="password"
                            type="password" 
                            required
                            minLength={6}
                            className="w-full bg-transparent border-b border-black/20 py-2 text-xl font-display tracking-wide text-black placeholder:text-black/10 focus:outline-none focus:border-lime-500 transition-all rounded-none"
                            placeholder="••••••••"
                        />
                    </div>

                    {state && state !== 'success' && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <p className="font-mono text-xs text-red-600">{state}</p>
                        </div>
                    )}

                    <div className="pt-4">
                        <SubmitButton />
                    </div>

                    <div className="text-center pt-8">
                        <Link href="/login" className="font-mono text-xs uppercase tracking-widest text-black/40 hover:text-lime-600 transition-colors border-b border-transparent hover:border-lime-600 pb-1">
                            Existing Node Access →
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
      </div>
    </main>
  );
}
 
function SubmitButton() {
  const { pending } = useFormStatus();
 
  return (
    <button
      disabled={pending}
      className="w-full bg-black text-white hover:bg-lime-500 hover:text-black transition-colors duration-300 py-6 px-8 flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="font-mono text-xs uppercase tracking-[0.2em] font-bold">
        {pending ? 'ALLOCATING...' : 'ESTABLISH IDENTITY'}
      </span>
      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
    </button>
  );
}
