'use client';
import React from 'react';
import { motion } from 'framer-motion';

const pillars = [
  { name: 'Shahadah', image: '/Shahadah.png' },
  { name: 'Salah', image: '/Salah.jpg' },
  { name: 'Sawm', image: '/Sawm.jpg' },
  { name: 'Zakah', image: '/zakha.jpg' },
  { name: 'Hajj', image: '/hajj.jpg' },
];

// Bigger wave vertical offsets for stronger wave shape
const waveOffsets = [70, 20, 90, 30, 75];

export default function PillarsOfIslam() {
  return (
    <section className="relative z-10 bg-gradient-to-b from-white via-purple-50 to-white py-20 pb-30 px-6 overflow-hidden max-w-8xl mx-auto">
      {/* Heading */}
      <h2 className="text-4xl font-bold mb-16 flex items-end justify-center gap-2">
        <span className="text-purple-800 text-5xl font-extrabold  decoration-purple-400 decoration-4">5</span>
        <span className="italic text-gray-800">Pillars of Islam</span>
      </h2>

      {/* Pillars */}
      <div className="flex justify-center flex-wrap gap-x-20 gap-y-20">
        {pillars.map((pillar, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center max-w-[130px]"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: waveOffsets[index] }}
            transition={{
              delay: index * 0.5,
              duration: 1,
              ease: 'easeOut',
            }}
          >
            {/* Floating animation after appearing */}
            <motion.div
              animate={{
                y: [0, -20, 0],  // bigger floating range
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 2 + index * 0.5,
                ease: 'easeInOut',
              }}
              className="flex flex-col items-center"
            >
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img
                  src={pillar.image}
                  alt={pillar.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-4 text-lg italic font-semibold text-gray-700">
                {pillar.name}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
