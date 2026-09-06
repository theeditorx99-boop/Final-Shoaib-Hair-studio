import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const socials = [
    { name: 'Instagram', href: 'https://www.instagram.com/shoaibsalonofficial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
    { name: 'Facebook', href: 'https://www.facebook.com/SHOAIBBASHIROFFICIAL/' },
  ];

  const links = [
    { name: 'Home', href: '#hero' },
    { name: 'Services', href: '#services' },
    { name: 'DEALS', href: '/deals' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Our Story', href: '#story' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#booking' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
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
  };

  return (
    <footer className="w-full bg-white border-t border-gray-200 pt-20 md:pt-32 flex flex-col relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 w-full flex flex-col md:flex-row justify-between gap-16 mb-24 md:mb-40">
        
        {/* Socials & Email */}
        <motion.div
          className="flex flex-col gap-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div>
            <h4 className="text-xs uppercase tracking-widest font-mono text-gray-400 mb-6">Connect</h4>
            <ul className="flex flex-col gap-3">
              {socials.map(social => (
                <li key={social.name}>
                  <a href={social.href} className="text-xl md:text-3xl font-display uppercase hover:text-gray-500 transition-colors">
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-widest font-mono text-gray-400 mb-4">Inquiries</h4>
            <a href="mailto:shoaibbashir840@gmail.com" className="text-lg md:text-xl font-medium border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
              shoaibbashir840@gmail.com
            </a>
          </div>
        </motion.div>

        {/* Links */}
        <motion.div
          className="flex flex-col md:items-end gap-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
        >
          <div>
            <h4 className="text-xs uppercase tracking-widest font-mono text-gray-400 mb-6 md:text-right">Explore</h4>
            <ul className="flex flex-col gap-3 md:items-end">
              {links.map(link => (
                <li key={link.name}>
                  <a href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="text-sm md:text-base font-mono uppercase tracking-widest hover:text-gray-500 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col gap-3 md:items-end mt-10">
             <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors uppercase tracking-widest">Privacy Policy</a>
             <a href="#" className="text-xs text-gray-500 hover:text-black transition-colors uppercase tracking-widest">Terms & Conditions</a>
             <p className="text-xs text-gray-400 uppercase tracking-widest mt-4">© {new Date().getFullYear()} Shoaib Salon. All rights reserved.</p>
          </div>
        </motion.div>
      </div>

      {/* Oversized Wordmark */}
      <motion.div
        className="w-full flex justify-center overflow-hidden leading-[0.75] select-none translate-y-4 md:translate-y-10"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="font-display font-bold text-[25vw] md:text-[20vw] whitespace-nowrap text-black">
          SHOAIB SALON
        </h2>
      </motion.div>
    </footer>
  );
}
