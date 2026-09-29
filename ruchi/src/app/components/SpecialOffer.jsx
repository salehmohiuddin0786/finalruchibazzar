"use client";
import React from 'react';
import { Gift, Play, Apple as AppleIcon, ArrowRight, Tag } from 'lucide-react';

const SpecialOffer = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-[#F9FAFB] to-red-50">
      <div className="container mx-auto px-4">
        <div className="relative">
          <div className="absolute -inset-8 bg-gradient-to-r from-red-400 to-red-500 rounded-3xl blur-3xl opacity-10"></div>
          <div className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-12 text-center text-white shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-8">
                <Gift className="w-7 h-7" />
                <span className="font-bold text-lg">Special Offer</span>
              </div>
              <h2 className="text-5xl font-bold mb-6">Ready to Taste Happiness?</h2>
              <p className="text-xl opacity-90 mb-10">
                Download the Ruchi Bazaar app now and get 50% off on your first order!
                Plus, enjoy lightning-fast delivery and exclusive member benefits.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
                <button className="group bg-black hover:bg-gray-900 px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-4 transition-all hover:scale-105 shadow-2xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center">
                    <Play className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm opacity-80">Get it on</div>
                    <div className="text-2xl">Google Play</div>
                  </div>
                  <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                </button>
                
                <button className="group bg-black hover:bg-gray-900 px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-4 transition-all hover:scale-105 shadow-2xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center">
                    <AppleIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm opacity-80">Download on</div>
                    <div className="text-2xl">App Store</div>
                  </div>
                  <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                </button>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center">
                    <Tag className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm opacity-80">Use Promo Code</div>
                    <div className="text-3xl font-bold tracking-wider">FIRST50</div>
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