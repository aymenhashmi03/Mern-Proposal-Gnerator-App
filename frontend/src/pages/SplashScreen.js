import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SplashScreen = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/signin');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 1.5,
            ease: 'easeInOut',
          }}
          className="inline-block mb-6"
        >
          <div className="relative">
            <FileText size={80} className="text-white" strokeWidth={1.5} />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles size={32} className="text-yellow-300" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl font-bold text-white mb-4"
        >
          Proposal Generator
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl text-blue-100 mb-8"
        >
          Craft Winning Proposals Effortlessly
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="flex space-x-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: 0,
              }}
              className="w-3 h-3 bg-white rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: 0.2,
              }}
              className="w-3 h-3 bg-white rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: 0.4,
              }}
              className="w-3 h-3 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;

