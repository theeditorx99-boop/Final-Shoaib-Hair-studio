import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ScrollRevealText } from './ScrollRevealText';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Welcome / Home', href: '#hero' },
    { label: 'Services Menu', href: '#services' },
    { label: 'DEALS', href: '/deals' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Book Appointment', href: '#booking' },
    { label: 'Contact Us', href: '#contact' },
  ];

  const scrollTo = (href: string) => {
    setIsOpen(false);
    setTimeout(() => {
      if (href.startsWith('/')) {
        navigate(href);
        window.scrollTo(0, 0);
      } else {
        if (location.pathname !== '/') {
          navigate(`/${href}`);
          setTimeout(() => {
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } else {
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 300);
  };

  return (
    <>
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full bg-white text-black relative flex flex-col items-center justify-center pt-10 pb-6"
      >
        <div className="flex flex-col items-center text-center">
          <img src="/assets/logo salon.png" alt="Shoaib Salon Logo" className="h-24 md:h-32 mb-4 md:mb-8 object-contain" />
          <ScrollRevealText
            text="SHOAIB SALON"
            tag="h1"
            preset="Masked Lines"
            trigger="On Load"
            onLoadDuration={1.2}
            colorHidden="#9ca3af"
            colorRevealed="#000000"
            className="text-6xl md:text-[100px] lg:text-[140px] font-display font-normal tracking-wide uppercase leading-none"
          />
          <div className="flex gap-4 md:gap-8 mt-2 md:mt-4 text-[10px] md:text-sm font-bold tracking-[0.1em] font-sans uppercase">
            <span>HAIR • BEAUTY • GROOMING</span>
            <span>SINCE 2008</span>
          </div>
        </div>

        <button 
          onClick={() => setIsOpen(true)}
          className="fixed top-6 right-6 md:top-10 md:right-10 p-2 hover:opacity-70 transition-opacity z-50 mix-blend-difference text-white"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white text-black flex flex-col"
          >
            <div className="flex justify-between items-start p-6 md:p-10 border-b border-gray-100">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight uppercase leading-none">
                  SHOAIB SALON
                </h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:opacity-70 transition-opacity"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center px-10 md:px-20 gap-6 md:gap-8 overflow-y-auto">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.label}
                  onClick={() => scrollTo(item.href)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="text-left text-3xl md:text-5xl lg:text-7xl font-display uppercase tracking-tighter hover:text-gray-500 transition-colors w-fit"
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
            
            <div className="p-6 md:p-10 border-t border-gray-100 flex justify-between text-xs font-mono uppercase tracking-widest text-gray-500">
              <span>Est. 2024</span>
              <span>Karachi, PK</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
