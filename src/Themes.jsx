import { motion } from "framer-motion";

const themesList = [
  { emoji: "😄", name: "Joy", description: "Bright and cheerful!", gradient: "linear-gradient(135deg,#f9d423,#ff4e50)" },
  { emoji: "😢", name: "Sadness", description: "Calm and reflective.", gradient: "linear-gradient(135deg,#83a4d4,#b6fbff)" },
  { emoji: "😡", name: "Anger", description: "Intense and passionate.", gradient: "linear-gradient(135deg,#ff416c,#ff4b2b)" },
  { emoji: "😨", name: "Fear", description: "Cautious and alert.", gradient: "linear-gradient(135deg,#8360c3,#2ebf91)" },
  { emoji: "😲", name: "Surprise", description: "Curious and amazed.", gradient: "linear-gradient(135deg,#ff9a9e,#fad0c4)" },
  { emoji: "❤️", name: "Love", description: "Warm and affectionate.", gradient: "linear-gradient(135deg,#ff758c,#ff7eb3)" },
  { emoji: "😐", name: "Neutral", description: "Balanced and steady.", gradient: "linear-gradient(135deg,#89f7fe,#66a6ff)" },
  { emoji: "🤢", name: "Disgust", description: "Repulsed but aware — facing what feels unpleasant.", gradient: "linear-gradient(135deg,#76b852,#8DC26F)" },
];

function Themes() {
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
      {/* ✨ Glassy container */}
      <motion.div
        className="backdrop-blur-lg bg-white/20 rounded-2xl shadow-2xl p-6 w-[750px] max-w-[95%] text-center border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 🌟 Header */}
        <motion.h2
          className="text-3xl font-extrabold text-white drop-shadow mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🌈 Themes
        </motion.h2>

        <p className="text-white/90 mb-6 italic">
          Explore Feelify’s signature moods and their unique color energies 🎭
        </p>

        {/* 🧩 Themes grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {themesList.map((theme, i) => (
            <motion.div
              key={i}
              className="rounded-2xl p-4 shadow-lg text-white cursor-pointer transition-transform transform hover:scale-105"
              style={{
                background: theme.gradient,
                boxShadow: "0 4px 15px rgba(255,255,255,0.2)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3 className="text-2xl font-bold drop-shadow flex items-center justify-center gap-2 mb-1">
                <span>{theme.emoji}</span> {theme.name}
              </h3>
              <p className="text-white/90 italic text-sm">{theme.description}</p>
            </motion.div>
          ))}
        </div>

        {/* 📜 Footer Note */}
        <motion.p
          className="text-white/70 mt-8 text-sm italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          💡 Tip: These moods are automatically saved when you explore your emotions in the app.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default Themes;
