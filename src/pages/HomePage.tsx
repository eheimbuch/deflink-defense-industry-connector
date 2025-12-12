import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
export function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };
  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans">
      <ThemeToggle className="absolute top-4 right-4 z-20" />
      {/* OEM Section */}
      <motion.div
        className="relative flex-1 flex flex-col items-center justify-center bg-slate-900 text-white p-8 lg:p-12"
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>
        <motion.div
          className="relative z-10 text-center max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <ShieldCheck className="w-16 h-16 text-slate-400" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4 text-slate-50">
            OEM-Bereich
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-slate-300 mb-8">
            Tragen Sie Ihren Bedarf in einem geschützten und vertraulichen Bereich ein.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button asChild size="lg" className="w-full bg-slate-50 text-slate-900 hover:bg-slate-200 group transition-transform duration-300 hover:scale-105">
              <Link to="/oem/login">
                Zum OEM-Bereich (geschützt)
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
      {/* Divider */}
      <div className="hidden lg:block w-2 bg-gradient-to-b from-slate-900 via-slate-500 to-slate-50"></div>
      {/* Provider Section */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-8 lg:p-12"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      >
        <motion.div
          className="text-center max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <Briefcase className="w-16 h-16 text-slate-500" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            Dienstleister-Hub
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-slate-600 mb-8">
            Präsentieren Sie Ihr Profil und Ihre Expertise für relevante Projekte im Verteidigungssektor.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button asChild size="lg" variant="outline" className="w-full border-slate-900 text-slate-900 hover:bg-slate-200 hover:text-slate-900 group transition-transform duration-300 hover:scale-105">
              <Link to="/providers">
                Profile ansehen & eintragen
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}