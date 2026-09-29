"use client";
import React from 'react';
import { Users, Utensils, TrendingDown, Award, Target } from 'lucide-react';

const AchievementsSection = () => {
  const stats = [
    { 
      value: "10M+", 
      label: "Happy Customers", 
      icon: Users, 
      color: "from-red-500 to-red-600" 
    },
    { 
      value: "50K+", 
      label: "Restaurant Partners", 
      icon: Utensils, 
      color: "from-red-600 to-rose-600" 
    },
    { 
      value: "30min", 
      label: "Average Delivery", 
      icon: TrendingDown, 
      color: "from-red-700 to-red-800" 
    },
    { 
      value: "4.8★", 
      label: "App Rating", 
      icon: Award, 
      color: "from-rose-500 to-red-600" 
    },
  ];

  return (
    <div className="py-20 bg-gradient-to-r from-red-50 via-red-100/50 to-red-50 text-gray-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-200 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-200 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-red-200 shadow-sm rounded-full mb-8">
            <Target className="w-7 h-7 text-red-500" />
            <span className="font-bold text-lg text-gray-900">Our Achievements</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Numbers That Speak</h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Join millions of happy customers who trust Ruchi Bazaar for their daily food and grocery needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center group">
              <div className="relative inline-block mb-6">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-red-400/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 text-gray-900">
                {stat.value}
              </div>
              <div className="text-base md:text-lg font-medium text-gray-700">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsSection;