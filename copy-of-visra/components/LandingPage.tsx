
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Wand2, Layers, Zap, Play, ArrowRight, Check, ChevronDown } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart: onLogin }) => {
  const [isPlayingFounder, setIsPlayingFounder] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [heroImageState, setHeroImageState] = useState(0);

  // Auto-switch Hero Image
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageState((prev) => (prev === 0 ? 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const faqs = [
    { q: "Is Visra really free to use?", a: "Yes, our starter plan allows you to generate unlimited drafts. Pro features unlock high-res renders." },
    { q: "Do I need design skills?", a: "Absolutely not. Just upload a photo and describe what you want. Visra handles the rest." },
    { q: "Can I use this for commercial projects?", a: "Yes, the Pro and Agency plans come with a commercial license for all generated designs." },
  ];

  // fadeInUp variants with responsive-friendly transition
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      } 
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-black font-sans overflow-x-hidden selection:bg-black selection:text-white">
      
      {/* ---------------- NAVBAR ---------------- */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-black text-white rounded-lg flex items-center justify-center font-bold text-xl">V</div>
            <span className="font-bold text-xl tracking-tight">VISRA</span>
          </div>
          {/* Middle links hidden on mobile */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-black transition-colors">Features</a>
            <a href="#founder" className="hover:text-black transition-colors">About</a>
            <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onLogin} className="hidden sm:block text-sm font-medium hover:underline">Log in</button>
            <button onClick={onLogin} className="bg-black text-white px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium hover:bg-gray-800 transition-transform active:scale-95 shadow-lg">
              Start Designing
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="pt-32 md:pt-40 pb-20 px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto text-center space-y-6"
        >
            
            {/* Version Tag */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-600">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              v2.5 is now live
            </motion.div>
            
            {/* Heading - text-4xl on mobile, text-5xl on desktop */}
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Redesign Your Space <br className="hidden md:block" />
              with <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-black">AI Intelligence.</span>
            </motion.h1>
            
            {/* Subtext */}
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Upload a photo. Describe your vision. Watch Visra transform your room in seconds with studio-grade fidelity.
            </motion.p>
            
            {/* Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button onClick={onLogin} className="w-full sm:w-auto h-12 px-8 rounded-full bg-black text-white font-semibold hover:bg-gray-800 hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2">
                Start Designing Free <ArrowRight className="w-4 h-4" />
              </button>
              <button className="w-full sm:w-auto h-12 px-8 rounded-full border border-gray-200 hover:bg-gray-50 font-medium transition-all hover:border-black">
                View Gallery
              </button>
            </motion.div>

            {/* Hero Visual: Before/After Simulator */}
            <motion.div 
              variants={fadeInUp}
              className="mt-12 md:mt-20 max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-200 aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] relative bg-gray-100 group cursor-crosshair"
            >
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={heroImageState}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={heroImageState === 0 ? "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop" : "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop"} 
                      alt="Room Visualization" 
                      className={`w-full h-full object-cover ${heroImageState === 0 ? 'grayscale-[0.2]' : ''}`} 
                    />
                    <div className={`absolute bottom-4 left-4 px-4 py-2 rounded-full text-xs md:text-sm backdrop-blur-md font-medium shadow-lg ${heroImageState === 0 ? 'bg-black/70 text-white' : 'bg-white/90 text-black font-bold'}`}>
                      {heroImageState === 0 ? "Original Space" : "Visra Optimized"}
                    </div>
                  </motion.div>
                </AnimatePresence>
            </motion.div>
        </motion.div>
      </section>

      {/* ---------------- FEATURES SECTION ---------------- */}
      <section id="features" className="py-20 md:py-24 bg-zinc-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold">Why Visra?</h2>
            </div>
            {/* Grid stacks on mobile: grid-cols-1 md:grid-cols-3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: Wand2, title: "AI-Powered Reality", desc: "Our engine understands depth, lighting, and texture to create photorealistic renders." },
              { icon: Layers, title: "Instant Material Swap", desc: "Don't like the floor? Change it instantly. Experiment with infinite combinations." },
              { icon: Zap, title: "Commercial Speed", desc: "What used to take designers days now takes seconds. Perfect for client presentations." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl md:hover:-translate-y-2 transition-all duration-300"
              >
                <div className="h-12 w-12 bg-black text-white rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm md:text-base">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FOUNDER SECTION ---------------- */}
      <section id="founder" className="py-20 md:py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          {/* Layout stacks on mobile: flex-col md:flex-row. Image sits BELOW text. */}
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            
            {/* Text Side - Always first on stack */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 space-y-6 text-left order-1"
            >
              <h2 className="text-xs font-bold tracking-widest text-gray-400 uppercase">Meet the Visionary</h2>
              <h3 className="text-3xl md:text-5xl font-bold">Priya Sharma</h3>
              <p className="text-lg md:text-xl text-gray-500 font-medium">Alumni, NIT Jamshedpur</p>
              <div className="h-1 w-20 bg-black/10"></div>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-md">
                "Architecting the future of interior design. I combined my technical background from NIT with a passion for aesthetics to democratize luxury design for everyone."
              </p>
              <div className="pt-4">
                 <div className="text-3xl md:text-4xl opacity-40 font-bold italic">Priya S.</div>
              </div>
            </motion.div>

            {/* Video Side - Image sits below text on mobile (order-2) */}
            <div className="flex-1 w-full flex justify-center md:justify-end order-2">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 className="relative w-full max-w-[280px] md:max-w-[320px] aspect-[9/16] bg-gray-900 rounded-[2rem] overflow-hidden shadow-2xl cursor-pointer group ring-4 ring-black/5 hover:ring-black/10 transition-all"
                 onClick={() => setIsPlayingFounder(true)}
               >
                  {!isPlayingFounder ? (
                    <>
                      <img 
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop" 
                        alt="Priya Sharma" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-14 md:h-16 w-14 md:w-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-125 transition-transform shadow-lg">
                           <Play className="w-5 md:w-6 h-5 md:h-6 text-white fill-white ml-1" />
                        </div>
                      </div>
                      
                      <div className="absolute bottom-8 left-6 text-white">
                        <p className="font-bold text-base md:text-lg">Meet Priya</p>
                        <p className="text-sm opacity-80">Watch her story</p>
                      </div>
                    </>
                  ) : (
                    <video 
                      src="https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-laptop-project-while-lying-on-couch-44772-large.mp4" 
                      className="w-full h-full object-cover" 
                      autoPlay 
                      controls 
                      playsInline
                    />
                  )}
               </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- PRICING SECTION ---------------- */}
      <section id="pricing" className="py-20 md:py-24 bg-zinc-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing.</h2>
            <p className="text-gray-500 text-sm md:text-base">Start for free, upgrade when you need pro power.</p>
          </div>

          {/* Pricing grid: grid-cols-1 md:grid-cols-3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
             {/* Starter */}
             <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg md:hover:-translate-y-2 transition-all duration-300"
             >
                <h3 className="text-lg font-semibold text-gray-500 mb-2">Starter</h3>
                <div className="text-4xl font-bold mb-6">₹0</div>
                <ul className="space-y-3 mb-8 text-left text-sm text-gray-600">
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> 5 Renders / day</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Standard Quality</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Public Gallery</li>
                </ul>
                <button onClick={onLogin} className="w-full py-3 rounded-xl border border-black font-medium hover:bg-gray-50 transition-colors">Get Started</button>
             </motion.div>

             {/* PRO (Highlighted) */}
             <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-black text-white p-8 rounded-2xl shadow-2xl relative z-10 md:scale-105 md:hover:-translate-y-2 transition-all duration-300"
             >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md">Most Popular</div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Pro Designer</h3>
                <div className="text-4xl font-bold mb-6">₹999<span className="text-sm font-normal text-gray-400">/mo</span></div>
                <ul className="space-y-3 mb-8 text-left text-sm text-gray-300">
                  <li className="flex gap-2"><Check className="w-4 h-4 text-white" /> Unlimited Renders</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-white" /> 4K Ultra-HD Export</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-white" /> Commercial License</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-white" /> Smart Editing Tools</li>
                </ul>
                <button onClick={onLogin} className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors">Try Pro Free</button>
             </motion.div>

             {/* Agency */}
             <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg md:hover:-translate-y-2 transition-all duration-300"
             >
                <h3 className="text-lg font-semibold text-gray-500 mb-2">Agency</h3>
                <div className="text-4xl font-bold mb-6">Custom</div>
                <ul className="space-y-3 mb-8 text-left text-sm text-gray-600">
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Team Collaboration</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> API Access</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Dedicated Support</li>
                </ul>
                <button onClick={onLogin} className="w-full py-3 rounded-xl border border-black font-medium hover:bg-gray-50 transition-colors">Contact Sales</button>
             </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ SECTION ---------------- */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 md:mb-12 text-center">Common Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-100 pb-4">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left py-2 font-medium hover:text-gray-600 text-sm md:text-base"
                >
                  {faq.q}
                  <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <motion.div 
                  initial={false}
                  animate={{ height: activeFaq === i ? 'auto' : 0, opacity: activeFaq === i ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-500 mt-2 text-xs md:text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="bg-black text-white pt-16 md:pt-20 pb-10">
        {/* Footer grid: grid-cols-1 md:grid-cols-3 pattern */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
           <div className="space-y-4">
              <div className="h-8 w-8 bg-white text-black rounded-lg flex items-center justify-center font-bold text-xl">V</div>
              <p className="text-gray-400 text-sm">Empowering every individual to become their own interior designer.</p>
           </div>
           <div>
              <h4 className="font-bold mb-6 text-xs md:text-sm uppercase tracking-widest text-zinc-500">Product</h4>
              <ul className="space-y-4 text-xs md:text-sm text-gray-400">
                 <li><a href="#features" className="hover:text-white">Features</a></li>
                 <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                 <li><a href="#" className="hover:text-white">Gallery</a></li>
              </ul>
           </div>
           <div>
              <h4 className="font-bold mb-6 text-xs md:text-sm uppercase tracking-widest text-zinc-500">Company</h4>
              <ul className="space-y-4 text-xs md:text-sm text-gray-400">
                 <li><a href="#founder" className="hover:text-white">About</a></li>
                 <li><a href="#" className="hover:text-white">Careers</a></li>
                 <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-gray-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-[10px] md:text-sm text-gray-500 gap-4">
           <p>© 2024 Visra AI. All rights reserved.</p>
           <p className="flex items-center gap-1">Made with <span className="text-red-500 animate-pulse">🖤</span> in India.</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
