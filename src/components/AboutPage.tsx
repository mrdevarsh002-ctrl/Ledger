import { motion } from "motion/react";
import {
  ArrowLeft,
  ExternalLink,
  Mail,
  Globe,
  Heart,
} from "lucide-react";
import { getTranslation, Language } from "../translations";

interface AboutPageProps {
  onBack: () => void;
  language: Language;
  theme: "light" | "dark";
}

export function AboutPage({
  onBack,
  language,
  theme,
}: AboutPageProps) {
  const t = getTranslation(language);
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="pt-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isDark
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
          } transition-colors`}
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <div>
          <h2
            className={`text-2xl ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {t.aboutTitle}
          </h2>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {t.version} 1.0.0
          </p>
        </div>
      </div>

      {/* App Icon and Name */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl p-8 ${
          isDark
            ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
            : "bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200"
        }`}
      >
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-900 to-gray-700 rounded-3xl flex items-center justify-center mb-4 shadow-2xl">
            <span className="text-4xl text-white">SL</span>
          </div>
          <h3
            className={`text-2xl mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {t.appName}
          </h3>
          <p
            className={`text-sm text-center ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {t.aboutDescription}
          </p>
        </div>
      </motion.div>

      {/* App Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-2xl overflow-hidden ${
          isDark
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        <div className="divide-y divide-gray-700">
          <div className="p-4 flex justify-between items-center">
            <span
              className={
                isDark ? "text-gray-400" : "text-gray-600"
              }
            >
              {t.version}
            </span>
            <span
              className={
                isDark ? "text-white" : "text-gray-900"
              }
            >
              1.0.0
            </span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span
              className={
                isDark ? "text-gray-400" : "text-gray-600"
              }
            >
              {t.developer}
            </span>
            <span
              className={
                isDark ? "text-white" : "text-gray-900"
              }
            >
              Smart Solutions
            </span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span
              className={
                isDark ? "text-gray-400" : "text-gray-600"
              }
            >
              {t.releaseDate}
            </span>
            <span
              className={
                isDark ? "text-white" : "text-gray-900"
              }
            >
              {language === "gu"
                ? "નવેમ્બર 2025"
                : language === "hi"
                  ? "नवंबर 2025"
                  : "November 2025"}
            </span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span
              className={
                isDark ? "text-gray-400" : "text-gray-600"
              }
            >
              {t.platform}
            </span>
            <span
              className={
                isDark ? "text-white" : "text-gray-900"
              }
            >
              {language === "gu"
                ? "વેબ એપ્લિકેશન"
                : language === "hi"
                  ? "वेब अनुप्रयोग"
                  : "Web Application"}
            </span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span
              className={
                isDark ? "text-gray-400" : "text-gray-600"
              }
            >
              {t.build}
            </span>
            <span
              className={
                isDark ? "text-white" : "text-gray-900"
              }
            >
              {language === "gu"
                ? "ઉત્પાદન"
                : language === "hi"
                  ? "उत्पादन"
                  : "Production"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`rounded-2xl p-6 ${
          isDark
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        <h4
          className={`mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {language === "gu"
            ? "મુખ્ય વિશેષતાઓ"
            : language === "hi"
              ? "मुख्य विशेषताएं"
              : "Key Features"}
        </h4>
        <div className="space-y-3">
          {[
            language === "gu"
              ? "કામદારો અને સપ્લાયર્સ ટ્રેક કરો"
              : language === "hi"
                ? "कामगारों और आपूर्तिकर्ताओं को ट्रैक करें"
                : "Track workers and suppliers",
            language === "gu"
              ? "બહુવિધ સાઇટ્સનું સંચાલન કરો"
              : language === "hi"
                ? "कई साइटों का प्रबंधन करें"
                : "Manage multiple sites",
            language === "gu"
              ? "બજેટ ટ્રેકિંગ"
              : language === "hi"
                ? "बजट ट्रैकिंग"
                : "Budget tracking",
            language === "gu"
              ? "વિગતવાર વ્યવહાર ઇતિહાસ"
              : language === "hi"
                ? "विस्तृत लेनदेन इतिहास"
                : "Detailed transaction history",
            language === "gu"
              ? "બહુભાષી સપોર્ટ"
              : language === "hi"
                ? "बहुभाषी समर्थन"
                : "Multi-language support",
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span
                className={
                  isDark ? "text-gray-300" : "text-gray-700"
                }
              >
                {feature}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact/Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`rounded-2xl p-6 ${
          isDark
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        <h4
          className={`mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {language === "gu"
            ? "સંપર્ક કરો"
            : language === "hi"
              ? "संपर्क करें"
              : "Get in Touch"}
        </h4>
        <div className="space-y-3">
          <motion.a
            href="mailto:mr.devarsh001@gmail.com"
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-3 p-3 rounded-xl ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-50 hover:bg-gray-100"
            } transition-colors`}
          >
            <Mail
              className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-600"}`}
            />
            <span
              className={
                isDark ? "text-gray-300" : "text-gray-700"
              }
            >
              mr.devarsh001@gmail.com
            </span>
          </motion.a>
          <motion.a
            href="https://iamdevarsh.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-3 p-3 rounded-xl ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-50 hover:bg-gray-100"
            } transition-colors`}
          >
            <Globe
              className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-600"}`}
            />
            <span
              className={
                isDark ? "text-gray-300" : "text-gray-700"
              }
            >
              www.iamdevarsh.netlify.app
            </span>
            <ExternalLink
              className={`w-4 h-4 ml-auto ${isDark ? "text-gray-400" : "text-gray-500"}`}
            />
          </motion.a>
        </div>
      </motion.div>

      {/* Made with Love */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center pb-4"
      >
        <div className="flex items-center justify-center gap-2 text-sm">
          <span
            className={
              isDark ? "text-gray-400" : "text-gray-600"
            }
          >
            {language === "gu"
              ? "પ્રેમથી બનાવેલ"
              : language === "hi"
                ? "प्यार से बनाया"
                : "Made with"}
          </span>
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span
            className={
              isDark ? "text-gray-400" : "text-gray-600"
            }
          >
            {language === "gu"
              ? "ભારતમાં"
              : language === "hi"
                ? "भारत में"
                : "in India"}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}