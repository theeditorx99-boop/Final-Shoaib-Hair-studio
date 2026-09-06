import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Clock, ExternalLink } from 'lucide-react';
import { ScrollRevealText } from './ScrollRevealText';

export function LocationMarquee() {
  return (
    <section className="w-full bg-white relative overflow-hidden py-24 md:py-40">
      {/* Marquee Background */}
      <div className="relative w-full overflow-hidden flex whitespace-nowrap bg-black text-white py-4 md:py-8 mb-20 md:mb-32">
        <motion.div 
          className="flex whitespace-nowrap font-display uppercase tracking-tighter text-6xl md:text-[8vw] leading-none"
          animate={{ x: [0, -1035] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 15,
              ease: "linear",
            },
          }}
        >
          {/* Repeat enough times to cover standard screen widths */}
          <span className="mx-8">LOOK GOOD, FEEL GOOD AND LIVE BETTER.</span>
          <span className="mx-8">LOOK GOOD, FEEL GOOD AND LIVE BETTER.</span>
          <span className="mx-8">LOOK GOOD, FEEL GOOD AND LIVE BETTER.</span>
          <span className="mx-8">LOOK GOOD, FEEL GOOD AND LIVE BETTER.</span>
        </motion.div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 relative z-10">
        
        {/* Branch Info */}
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <ScrollRevealText
            text="GULISTAN-E-JOHAR STUDIO"
            tag="h2"
            preset="Masked Lines"
            colorHidden="#9ca3af"
            colorRevealed="#000000"
            className="font-display font-bold leading-none tracking-tighter text-[10vw] md:text-7xl uppercase mb-10"
          />
          
          <div className="flex flex-col gap-8">
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm md:text-base text-black font-medium">Shoaib Salon, Gulistan-e-Johar</p>
                <p className="text-sm md:text-base text-gray-600">Shop 12, W47C+C72 Haroon Royal City, phase 1 Block 17 Gulistan-e-Johar,<br/>Karachi, 75290, Pakistan</p>
                <a href="https://maps.app.goo.gl/waTk3Q22Kt7CWBEp8" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-3 text-xs uppercase tracking-[0.2em] font-mono border-b border-black pb-1 hover:text-gray-500 transition-colors">
                  Get Directions <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm md:text-base text-black font-medium">Call Us</p>
                <a href="tel:03312473575" className="text-sm md:text-base text-gray-600 hover:text-black transition-colors">03312473575</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MessageCircle className="w-5 h-5 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm md:text-base text-black font-medium">WhatsApp</p>
                <a href="https://wa.me/923312473575" target="_blank" rel="noreferrer" className="text-sm md:text-base text-gray-600 hover:text-black transition-colors">03312473575</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm md:text-base text-black font-medium">Opening Hours</p>
                <p className="text-sm md:text-base text-gray-600">Mon - Sun: 12:00 PM - 12:00 AM</p>
              </div>
            </div>
            
            <div className="mt-4">
               <button 
                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-black border border-black text-xs tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors"
              >
                Book My Appointment
              </button>
            </div>
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          className="w-full h-[400px] lg:h-full min-h-[400px] bg-gray-100 relative group overflow-hidden border border-gray-200"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
        >
           <img 
              src="https://images.unsplash.com/photo-1524813686514-a57563d77965?q=80&w=1000&auto=format&fit=crop" 
              alt="Map Location" 
              className="w-full h-full object-cover img-editorial"
            />
            <div className="absolute inset-0 bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <a href="https://maps.app.goo.gl/waTk3Q22Kt7CWBEp8" target="_blank" rel="noreferrer" className="bg-black text-white px-6 py-3 text-xs uppercase tracking-widest font-mono">
                 Open in Maps
               </a>
            </div>
        </motion.div>

      </div>
    </section>
  );
}
