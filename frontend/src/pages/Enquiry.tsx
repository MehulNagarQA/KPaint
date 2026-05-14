import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { enquiryAPI } from '../api';

const Enquiry: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data } = await enquiryAPI.send(formData);
      if (data.success) {
        toast.success(data.message || 'Your enquiry has been sent successfully. We will get back to you soon!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data.message || 'Failed to send enquiry.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Have a question about a specific painting, a custom commission request, or just want to say hello? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <p className="text-gray-400 mb-8">
              Fill out the form and our team will get back to you within 24 hours. We are available for artistic collaborations, commissions, and interior design consultations.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Our Gallery</h3>
                <p className="text-gray-400 mt-1">123 Art Avenue, Design District<br />Metropolis, NY 10001</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Phone</h3>
                <p className="text-gray-400 mt-1">+1 (555) 123-4567<br />Mon-Fri 9am-6pm EST</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Email</h3>
                <p className="text-gray-400 mt-1">info@kpaint.com<br />support@kpaint.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass p-8 rounded-2xl border border-[#3e4042] bg-[#242526]">
          <h2 className="text-2xl font-bold mb-6">Send an Enquiry</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#18191a] border border-[#3e4042] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1877F2] transition-colors"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#18191a] border border-[#3e4042] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1877F2] transition-colors"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-[#18191a] border border-[#3e4042] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1877F2] transition-colors"
                placeholder="Commission Request"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[#18191a] border border-[#3e4042] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1877F2] transition-colors resize-none"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-4 text-lg justify-center mt-4"
            >
              {isSubmitting ? 'Sending...' : (
                <>
                  Send Message <Send className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Enquiry;
