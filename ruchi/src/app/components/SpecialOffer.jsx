"use client";
import React from 'react';
import { Gift, Play, Apple as AppleIcon, ArrowRight, Tag } from 'lucide-react';

const SpecialOffer = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-[#F9FAFB] to-red-50 overflow-hidden w-full max-w-full">
      <div className="container mx-auto px-4 max-w-7xl w-full max-w-full">
        <div className="relative rounded-3xl overflow-hidden w-full max-w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 rounded-3xl blur-2xl opacity-15 pointer-events-none"></div>
          <div className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-6 sm:p-8 md:p-12 text-center text-white shadow-2xl overflow-hidden w-full max-w-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-12 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-12 pointer-events-none"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm rounded-full mb-6 sm:mb-8">
                <Gift className="w-5 h-5 sm:w-7 sm:h-7" />
                <span className="font-bold text-sm sm:text-lg">Special Offer</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                Ready to Taste Happiness?
              </h2>
              <p className="text-sm sm:text-base md:text-xl opacity-90 mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
                Download the Ruchi Bazaar app now and get 50% off on your first order!
                Plus, enjoy lightning-fast delivery and exclusive member benefits.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-6 sm:mb-10">
                <button className="group bg-black hover:bg-gray-900 px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-3 sm:gap-4 transition-all hover:scale-105 shadow-2xl">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center shrink-0">
                    <Play className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm opacity-80">Get it on</div>
                    <div className="text-lg sm:text-2xl">Google Play</div>
                  </div>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all hidden xs:block" />
                </button>
                
                <button className="group bg-black hover:bg-gray-900 px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-3 sm:gap-4 transition-all hover:scale-105 shadow-2xl">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center shrink-0">
                    <AppleIcon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm opacity-80">Download on</div>
                    <div className="text-lg sm:text-2xl">App Store</div>
                  </div>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all hidden xs:block" />
                </button>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 inline-block max-w-full">
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center shrink-0">
                    <Tag className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs sm:text-sm opacity-80">Use Promo Code</div>
                    <div className="text-xl sm:text-3xl font-bold tracking-wider">FIRST50</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffer;