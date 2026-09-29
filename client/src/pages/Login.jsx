import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, ArrowLeft, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const { login } = useContext(AuthContext);
  const { addNotification } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Forgot Password States
  const [viewState, setViewState] = useState('login'); // 'login', 'email', 'code', 'password'
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Typing Animations
  const fullText = "Welcome to my company and web-site ❤️";
  const [displayText, setDisplayText] = useState('');

    useEffect(() => {
    let i = 0;
    const typeTimer = setInterval(() => {
      if (i <= fullText.length) {
        setDisplayText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(typeTimer);
      }
    }, 80);
    return () => clearInterval(typeTimer);
  }, []);

  // Interactive Particle Net Canvas Background (Luxury gold nodes connect on hover)
  useEffect(() => {
    const canvas = document.getElementById('login-particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = (canvas.width = window.innerWidth);
      height = (canvas.height = window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 35 : 70;
    const maxDistance = 110;

    let mouse = { x: null, y: null };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.6
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212, 175, 55, 0.22)';
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / maxDistance) * 0.12;
            ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            const alpha = (1 - dist / 160) * 0.16;
            ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addNotification('Please enter both email and password', 'warning');
      return;
    }
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      addNotification(`Welcome back, ${loggedUser.name}!`, 'success');
      if (loggedUser.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      addNotification(err.message || 'Invalid credentials', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    if (viewState === 'email') {
      if (!email) { addNotification('Please enter your email', 'warning'); return; }
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/messages/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to send code');

        setViewState('code');
        addNotification('Verification code sent to your email ✓', 'success');
      } catch (err) {
        addNotification(err.message || 'Could not send reset email', 'warning');
      } finally {
        setLoading(false);
      }

    } else if (viewState === 'code') {
      if (resetCode.length < 4) { addNotification('Please enter the full code', 'warning'); return; }
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/messages/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code: resetCode })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Invalid code');
        setViewState('password');
        addNotification('Code verified. Set your new password.', 'success');
      } catch (err) {
        addNotification(err.message, 'warning');
      } finally {
        setLoading(false);
      }

    } else if (viewState === 'password') {
      if (newPassword.length < 6) { addNotification('Password must be at least 6 characters', 'warning'); return; }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setViewState('login');
        setPassword('');
        setResetCode('');
        setNewPassword('');
        addNotification('Password successfully reset. You can now login.', 'success');
      }, 1200);
    }
  };


  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@aetherionmotors.com');
      setPassword('admin123');
      addNotification('Admin credentials loaded. Click login.', 'success');
    } else {
      setEmail('user@aetherionmotors.com');
      setPassword('user123');
      addNotification('User credentials loaded. Click login.', 'success');
    }
  };

  const formVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-x-hidden overflow-y-auto py-16 bg-[#030303] font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* Drifting Car Video Background (Clear, Cinematic Visibility) */}
      <video autoPlay loop muted playsInline className="fixed top-0 left-0 w-full h-full object-cover opacity-65 transform-gpu will-change-transform z-0">
        <source src="/videos/login_bg_vid.mp4" type="video/mp4" />
      </video>
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-black/25 via-[#030303]/45 to-[#030303]/85 pointer-events-none z-0" />

      {/* HTML5 Live Particle Canvas */}
      <canvas id="login-particle-canvas" className="fixed inset-0 w-full h-full pointer-events-none z-0" />

      {/* Floating abstract glowing auras */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-zinc-900/40 rounded-full blur-[160px] pointer-events-none z-0" />

      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", layout: { duration: 0.4, ease: "easeInOut" } }}
        className="relative z-10 w-full max-w-[440px] p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[2.5rem] bg-[#070707]/90 backdrop-blur-3xl border border-zinc-900/60 shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:border-[#D4AF37]/25 transition-all duration-500 overflow-hidden transform-gpu my-auto"
      >
        {/* Top gold bar border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent"></div>

        <div className="text-center mb-8">
          <span className="text-2xl md:text-3xl font-bold tracking-[0.25em] text-white block mb-3 font-serif drop-shadow-md transition-colors hover:text-luxury-gold cursor-default">
            AETHERION MOTORS
          </span>
          <p className="text-[9px] tracking-[0.4em] text-zinc-500 uppercase mb-4 font-black">
            {viewState === 'login' ? 'ACQUISITION PORTAL' : 'ACCOUNT RECOVERY'}
          </p>
          
          <div className="h-6 flex items-center justify-center">
            <p className="text-xs text-zinc-400 tracking-wider font-semibold uppercase">
              {viewState === 'login' ? displayText : "Follow the steps to recover access."}
              {viewState === 'login' && (
                <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="text-luxury-gold ml-1 inline-block">|</motion.span>
              )}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewState === 'login' ? (
            <motion.div key="login" variants={formVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[9px] tracking-[0.2em] uppercase text-zinc-550 font-bold ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-650 group-focus-within:text-luxury-gold transition-colors" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@domain.com" className="w-full bg-zinc-900/20 border border-zinc-900 rounded-xl pl-12 pr-5 py-3.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-luxury-gold/30 focus:bg-zinc-900/30 transition-all font-sans" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] tracking-[0.2em] uppercase text-zinc-550 font-bold ml-1">Security Code</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-650 group-focus-within:text-luxury-gold transition-colors" />
                    <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-zinc-900/20 border border-zinc-900 rounded-xl pl-12 pr-12 py-3.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-luxury-gold/30 focus:bg-zinc-900/30 transition-all font-sans" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-luxury-gold transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                  <label className="flex items-center gap-2 text-zinc-500 cursor-pointer select-none">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded border-zinc-900 bg-black text-luxury-gold focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5" />
                    <span>Remember selection</span>
                  </label>
                  <button type="button" onClick={() => setViewState('email')} className="text-luxury-gold hover:text-white transition">Forgot password?</button>
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 mt-4 bg-luxury-gold text-black rounded-xl hover:bg-white hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] transition-all duration-300 text-[10px] font-black uppercase tracking-widest disabled:opacity-50">
                  {loading ? 'Authenticating...' : 'Secure Authorization'}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-zinc-900">
                <div className="flex items-center justify-center gap-2 mb-5">
                  <ShieldAlert className="w-4 h-4 text-zinc-600" />
                  <p className="text-[9px] tracking-[0.2em] text-zinc-600 font-black uppercase">Authorized Showcase Access</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => fillDemo('admin')} className="px-4 py-3.5 border border-luxury-gold/20 hover:border-luxury-gold/50 hover:bg-luxury-gold/5 rounded-xl text-luxury-gold transition-all text-[9px] font-black uppercase tracking-widest">Admin Demo</button>
                  <button type="button" onClick={() => fillDemo('user')} className="px-4 py-3.5 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-950/40 rounded-xl text-zinc-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest">Client Demo</button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="forgot" variants={formVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <form onSubmit={handleForgotSubmit} className="space-y-5">
                
                {viewState === 'email' && (
                  <div className="space-y-2">
                    <label className="text-[9px] tracking-[0.2em] uppercase text-zinc-550 font-bold ml-1">Confirm Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-650 group-focus-within:text-luxury-gold transition-colors" />
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@domain.com" className="w-full bg-zinc-900/20 border border-zinc-900 rounded-xl pl-12 pr-5 py-3.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-luxury-gold/30 focus:bg-zinc-900/30 transition-all font-sans" />
                    </div>
                  </div>
                )}

                {viewState === 'code' && (
                  <div className="space-y-2">
                    <label className="text-[9px] tracking-[0.2em] uppercase text-zinc-550 font-bold ml-1">Verification Code</label>
                    <div className="relative group">
                      <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-650 group-focus-within:text-luxury-gold transition-colors" />
                      <input type="text" required value={resetCode} onChange={(e) => setResetCode(e.target.value)} placeholder="Enter 6-digit code" className="w-full bg-zinc-900/20 border border-zinc-900 rounded-xl pl-12 pr-5 py-3.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-luxury-gold/30 focus:bg-zinc-900/30 transition-all font-sans tracking-widest" />
                    </div>
                  </div>
                )}

                {viewState === 'password' && (
                  <div className="space-y-2">
                    <label className="text-[9px] tracking-[0.2em] uppercase text-zinc-550 font-bold ml-1">New Security Code</label>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-650 group-focus-within:text-luxury-gold transition-colors" />
                      <input type={showPassword ? 'text' : 'password'} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="w-full bg-zinc-900/20 border border-zinc-900 rounded-xl pl-12 pr-12 py-3.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-luxury-gold/30 focus:bg-zinc-900/30 transition-all font-sans" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-luxury-gold transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-2 space-y-4">
                  <button type="submit" disabled={loading} className="w-full py-4 bg-luxury-gold text-black rounded-xl hover:bg-white hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] transition-all duration-300 text-[10px] font-black uppercase tracking-widest disabled:opacity-50">
                    {loading ? 'Processing...' : (viewState === 'email' ? 'Send Code' : viewState === 'code' ? 'Verify Code' : 'Update Password')}
                  </button>
                  <button type="button" onClick={() => setViewState('login')} className="w-full flex items-center justify-center gap-2 text-[9px] uppercase font-black tracking-widest text-zinc-550 hover:text-white transition">
                    <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
