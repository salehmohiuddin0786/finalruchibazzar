"use client";
import React from 'react';
import { Clock, Star, Shield, Truck, Zap, ThumbsUp } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    { 
      icon: Clock, 
      title: '30-Min Delivery', 
      desc: 'Fastest in the city', 
      highlight: true 
    },
    { 
      icon: Star, 
      title: '4.8 Star Rating', 
      desc: 'Based on 50K+ reviews', 
      highlight: false 
    },
    { 
      icon: Shield, 
      title: 'Safe & Hygienic', 
      desc: '100% contactless delivery', 
      highlight: false 
    },
    { 
      icon: Truck, 
      title: 'Free Delivery', 
      desc: 'On orders above ₹299', 
      highlight: true 
    },
  ];

  return (
    <div className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-red-50/50 relative overflow-hidden">
      {/* Background Pattern - Optimized for mobile */}
      <div className="absolute inset-0 opacity-30 md:opacity-50">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-32 h-32 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-red-100 to-red-100 rounded-full mb-4 sm:mb-6">
            <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-600" />
            <span className="font-semibold text-red-700 text-sm sm:text-base lg:text-lg">Why Choose Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
            Experience the Best
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto px-4">
            We&apos;re not just delivering food, we&apos;re delivering happiness, one meal at a time.
          </p>
        </div>

        {/* Features Grid - Centered on mobile */}
        <div className="flex flex-col items-center lg:grid lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="relative group w-full max-w-sm lg:max-w-none">
              {/* Glow Effect */}
              <div className={`
                absolute -inset-2 sm:-inset-3 lg:-inset-4 
                bg-gradient-to-r 
                ${feature.highlight 
                  ? 'from-red-400 to-red-500' 
                  : 'from-gray-400 to-gray-300'
                } 
                rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-20 
                transition-opacity duration-700
              `}></div>
              
              {/* Card */}
              <div className={`
                relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 
                border border-gray-200 hover:border-red-300 
                transition-all duration-500 hover:scale-[1.02] sm:hover:scale-105 
                hover:shadow-xl sm:hover:shadow-2xl h-full
                mx-auto w-full
              `}>
                {/* Icon Container - Centered */}
                <div className={`
                  w-14 h-14 sm:w-16 sm:h-16 
                  bg-gradient-to-br 
                  ${feature.highlight 
                    ? 'from-red-500 to-red-600' 
                    : 'from-gray-700 to-gray-800'
                  } 
                  rounded-xl sm:rounded-2xl 
                  flex items-center justify-center 
                  mb-4 sm:mb-6 
                  mx-auto
                  group-hover:rotate-6 sm:group-hover:rotate-12 
                  transition-transform duration-500 
                  shadow-md sm:shadow-lg
                `}>
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                
                {/* Content - Centered text */}
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                    {feature.desc}
                  </p>
                  
                  {/* Highlight Badge - Centered */}
                  {feature.highlight && (
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-50 rounded-full mx-auto">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 animate-pulse" />
                      <span className="text-xs sm:text-sm font-medium text-red-700">
                        Most Popular
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default WhyChooseUs;