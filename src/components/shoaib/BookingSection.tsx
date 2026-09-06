import { useState } from 'react';
import { motion } from 'framer-motion';

// Converts "HH:MM" (24h) → "H:MM AM/PM" (12h)
function to12Hour(time: FormDataEntryValue | null): string {
  if (!time || typeof time !== 'string' || !time.includes(':')) return '';
  const [hourStr, minute] = time.split(':');
  let hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${period}`;
}

export function BookingSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const branch = formData.get('branch');
    const date = formData.get('date');
    const time = to12Hour(formData.get('time'));
    const notes = formData.get('notes');
    const service = formData.get('service');

    const message = `*New Appointment Request*
Name: ${firstName} ${lastName}
Phone: ${phone}
Email: ${email}
Branch: ${branch}
Date: ${date}
Time: ${time}
Service: ${service}
Notes: ${notes}`;

    const whatsappUrl = `https://wa.me/923312473575?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    setIsSubmitting(false);
  };

  return (
    <section id="booking" className="w-full bg-gray-50 py-24 md:py-40 border-t border-gray-200">
      <div className="max-w-[800px] mx-auto px-6 md:px-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h2 className="font-display font-bold leading-none tracking-tighter text-[10vw] md:text-7xl uppercase mb-6">
            For Bookings & Appointments
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Appointment requests are confirmed by our salon team. For urgent bookings, please use our direct phone number.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest font-mono text-gray-500">First Name *</label>
              <input name="firstName" required type="text" className="w-full border-b border-gray-300 bg-transparent py-3 focus:outline-none focus:border-black transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest font-mono text-gray-500">Last Name *</label>
              <input name="lastName" required type="text" className="w-full border-b border-gray-300 bg-transparent py-3 focus:outline-none focus:border-black transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest font-mono text-gray-500">Email Address *</label>
              <input name="email" required type="email" className="w-full border-b border-gray-300 bg-transparent py-3 focus:outline-none focus:border-black transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest font-mono text-gray-500">Contact Number *</label>
              <input name="phone" required type="tel" className="w-full border-b border-gray-300 bg-transparent py-3 focus:outline-none focus:border-black transition-colors" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest font-mono text-gray-500">Preferred Branch / Area *</label>
            <select name="branch" required className="w-full border-b border-gray-300 bg-transparent py-3 focus:outline-none focus:border-black transition-colors appearance-none">
              <option value="">Select a location</option>
              <option value="Gulistan-e-Johar">Gulistan-e-Johar Studio</option>
            </select>
          </div>

          {/* Service — single pre-selected card (auto-selected per PRD §5.3 option a) */}
          <div className="flex flex-col gap-3">
            <label className="text-xs uppercase tracking-widest font-mono text-gray-500">Service</label>
            {/* Hidden input carries the fixed service value through form submission */}
            <input type="hidden" name="service" value="Top Stylist Hair Cutting — Rs. 2,500 / 30 mins — Shoaib Bashir" />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="border border-black px-6 py-5 flex items-center justify-between bg-white"
            >
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold uppercase tracking-tight">Top Stylist Hair Cutting</span>
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">30 mins · Shoaib Bashir</span>
              </div>
              <span className="text-base font-bold font-mono">Rs. 2,500</span>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest font-mono text-gray-500">Preferred Date *</label>
              <input name="date" required type="date" min={new Date().toISOString().split('T')[0]} className="w-full border-b border-gray-300 bg-transparent py-3 focus:outline-none focus:border-black transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest font-mono text-gray-500">Preferred Time</label>
              <input name="time" type="time" className="w-full border-b border-gray-300 bg-transparent py-3 focus:outline-none focus:border-black transition-colors" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest font-mono text-gray-500">Additional Notes</label>
            <textarea name="notes" rows={4} className="w-full border-b border-gray-300 bg-transparent py-3 focus:outline-none focus:border-black transition-colors resize-none" placeholder="Any special requests or stylist preferences?"></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-8 px-8 py-5 bg-black text-white text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black border border-black transition-colors w-full disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Request Appointment'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
