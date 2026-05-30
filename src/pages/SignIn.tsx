import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon } from
'lucide-react';
function GoogleLogo({ size = 16 }: {size?: number;}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z" />
      
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.61 6.61 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z" />
      
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
      
    </svg>);

}
export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/app/new');
    }, 600);
  };
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col relative overflow-hidden">
      {/* Background glows */}
      <div className="pointer-events-none absolute -top-60 -right-40 w-[700px] h-[700px] rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-60 -left-40 w-[700px] h-[700px] rounded-full bg-orange-500/5 blur-3xl" />

      {/* Top bar */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-axiom text-white flex items-center justify-center text-sm font-bold">
            S
          </span>
          <span className="text-base font-bold text-black tracking-tight">
            Shoal AI
          </span>
        </Link>
        <Link
          to="/signup"
          className="text-sm text-gray-600 hover:text-black transition-colors">
          
          New here?{' '}
          <span className="font-semibold text-black">Create an account</span>
        </Link>
      </header>

      {/* Form */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="w-full max-w-[420px]">
          
          <div className="text-center mb-9">
            <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tighter leading-tight mb-2.5">
              Welcome back
            </h1>
            <p className="text-gray-600">
              Sign in to dispatch your next swarm.
            </p>
          </div>

          {/* Google */}
          <motion.button
            whileHover={{
              y: -1
            }}
            whileTap={{
              scale: 0.99
            }}
            type="button"
            className="w-full inline-flex items-center justify-center gap-2.5 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-black hover:border-gray-300 hover:shadow-sm transition-all mb-5">
            
            <GoogleLogo />
            Continue with Google
          </motion.button>

          <div className="relative flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
              or with email
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                Email
              </label>
              <div className="relative">
                <MailIcon
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-white pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all" />
                
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-axiom font-semibold hover:underline">
                  
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <LockIcon
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all" />
                
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}>
                  
                  {showPwd ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{
                scale: 1.005
              }}
              whileTap={{
                scale: 0.99
              }}
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-1.5 bg-axiom text-white rounded-xl px-4 py-3 text-sm font-semibold hover:bg-orange-600 shadow-sm transition-colors disabled:opacity-60 mt-2">
              
              {loading ? 'Signing in…' : 'Sign in'}
              {!loading && <ArrowRightIcon size={14} />}
            </motion.button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-8 leading-relaxed">
            By continuing you agree to our{' '}
            <a className="underline hover:text-black">Terms</a> and{' '}
            <a className="underline hover:text-black">Privacy Policy</a>.
          </p>
        </motion.div>
      </main>
    </div>);

}