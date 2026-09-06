import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const categories = [
  {
    id: 'hair-cut',
    title: 'Hair Cut',
    image: '/assets/haircut.webp',
    services: [
      { name: 'Director Cut', price: 'PKR 15,000' },
      { name: 'Senior Stylist Cut', price: 'PKR 8,000' },
      { name: 'Fringe Trim', price: 'PKR 3,000' }
    ],
    note: '*Includes wash and basic styling'
  },
  {
    id: 'hair-styling',
    title: 'Hair Styling',
    image: '/assets/Hair Styling.webp',
    services: [
      { name: 'Blow Dry (Classic)', price: 'PKR 4,000' },
      { name: 'Blow Dry (Volume/Curls)', price: 'PKR 5,500' },
      { name: 'Updo / Formal Styling', price: 'PKR 12,000' }
    ]
  },
  {
    id: 'groom-packages',
    title: 'GROOM PACKAGES',
    image: '/assets/Grooms.jpg',
    services: [
      { name: 'Bridal Baraat', price: 'PKR 120,000' },
      { name: 'Bridal Valima', price: 'PKR 100,000' },
      { name: 'Mehndi Bride', price: 'PKR 80,000' }
    ],
    note: '*Includes hair, makeup, dupatta setting and nail color'
  }
];

export function ServicesMenu() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find all intersecting entries
        const intersecting = entries.filter(entry => entry.isIntersecting);
        if (intersecting.length > 0) {
          // If multiple, pick the first one (top-most in view)
          setActiveSection(intersecting[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    categories.forEach((cat) => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToBooking = (categoryId: string) => {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
      // In a real app, we would pass the category via state/context to pre-select it
      window.history.pushState({}, '', `#booking?service=${categoryId}`);
    }
  };

  return (
    <section id="services" className="w-full bg-white text-black py-24 md:py-40">
      {/* Intro */}
      <motion.div
        className="max-w-[1600px] mx-auto px-6 md:px-10 mb-20 md:mb-32"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <p className="text-xs tracking-[0.2em] uppercase font-mono mb-4 text-gray-500">Discover Our</p>
        <h2 className="font-display font-bold leading-none tracking-tighter text-[12vw] md:text-[clamp(72px,10vw,180px)] uppercase">
          Services Menu
        </h2>
      </motion.div>

      {/* 3-Column Layout Wrapper */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 flex flex-col md:flex-row relative">
        
        {/* Left Rail (Sticky) */}
        <aside className="w-full md:w-[15%] hidden md:block relative">
          <div className="sticky top-40 flex flex-col gap-3 text-xs uppercase tracking-widest font-mono text-gray-400">
            {categories.map(cat => (
              <a 
                key={cat.id} 
                href={`#${cat.id}`} 
                className={`transition-colors ${activeSection === cat.id ? 'text-black font-bold' : 'hover:text-black'}`}
              >
                {cat.title}
              </a>
            ))}
            <button 
              onClick={() => {
                navigate('/deals');
                window.scrollTo(0, 0);
              }}
              className="text-left hover:text-black transition-colors"
            >
              DEALS
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="w-full md:w-[85%] flex flex-col gap-24 md:gap-40">
          {categories.map((cat, index) => (
            <motion.div 
              key={cat.id} 
              id={cat.id} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col lg:flex-row gap-10 lg:gap-16 scroll-mt-40 border-t border-gray-200 pt-10 md:pt-16"
            >
              
              {/* Image Column */}
              <div className="w-full lg:w-[40%]">
                <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                  {cat.image.endsWith('.mp4') ? (
                    <video 
                      src={cat.image} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={cat.image} 
                      alt={cat.title} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
              </div>

              {/* Data Column */}
              <div className="w-full lg:w-[60%] flex flex-col">
                <h3 className="text-4xl md:text-[clamp(42px,5vw,96px)] font-display uppercase tracking-tighter mb-10 leading-none">
                  {cat.title}
                </h3>

                <div className="w-full">
                  {/* Price Table Headers */}
                  <div className="flex justify-between border-b border-black pb-4 mb-4 text-xs font-mono uppercase tracking-widest">
                    <span>Service</span>
                    <span>Price</span>
                  </div>

                  {/* Price Rows */}
                  <div className="flex flex-col gap-4 mb-8">
                    {cat.services.map((service, idx) => (
                      <div key={idx} className="flex justify-between items-end border-b border-gray-100 pb-4">
                        <span className="text-sm md:text-base font-medium">{service.name}</span>
                        <span className="text-sm md:text-base font-mono">{service.price}</span>
                      </div>
                    ))}
                  </div>

                  {cat.note && (
                    <p className="text-xs text-gray-500 italic mb-10">{cat.note}</p>
                  )}

                  <button 
                    onClick={() => scrollToBooking(cat.id)}
                    className="px-8 py-4 bg-white text-black border border-black text-xs tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors w-full sm:w-auto"
                  >
                    Book My Appointment
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
