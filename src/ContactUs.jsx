import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill out all fields ✍️");
      return;
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <motion.div
      className="min-h-screen w-full flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(135deg,#667eea,#764ba2)",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        paddingTop: "80px",
      }}
    >
      {/* ✨ Glass Card */}
      <motion.div
        className="backdrop-blur-lg bg-white/15 rounded-2xl shadow-2xl p-6 w-[550px] max-w-[90%] text-center border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 📨 Header */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-extrabold text-white drop-shadow mb-4"
        >
          📩 Contact Us
        </motion.h2>
        <p className="text-white/90 mb-6 italic">
          We'd love to hear your thoughts, feedback, or collaboration ideas 💡
        </p>

        {/* 🧾 Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-full bg-white/20 text-white placeholder-white/70 border border-white/30 text-center focus:outline-none focus:ring-2 focus:ring-white/50 transition"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-full bg-white/20 text-white placeholder-white/70 border border-white/30 text-center focus:outline-none focus:ring-2 focus:ring-white/50 transition"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 rounded-2xl bg-white/20 text-white placeholder-white/70 border border-white/30 text-center focus:outline-none focus:ring-2 focus:ring-white/50 transition resize-none"
          ></textarea>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 rounded-full font-bold bg-yellow-400 hover:bg-yellow-500 text-black shadow-md transition mt-2"
          >
            ✉️ Send Message
          </motion.button>
        </motion.form>

        {/* ✅ Success message */}
        <AnimatePresence>
          {submitted && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-green-200 font-semibold"
            >
              ✅ Thank you! Your message has been sent successfully.
            </motion.p>
          )}
        </AnimatePresence>

        {/* 📍 Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 text-white/80 text-sm"
        >
          <p>📧 Email: feelify.support@gmail.com</p>
          <p>📞 Phone: +1 (555) 234-5678</p>
          <p>🌐 Website: www.feelifyapp.com</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default ContactUs;
