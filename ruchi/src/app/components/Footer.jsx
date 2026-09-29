"use client";
import React from 'react';
import Link from 'next/link';
import { 
  Facebook, Twitter, Instagram, Youtube, 
  Mail, Phone, MapPin, Shield, 
  Truck, CreditCard, Package,
  Apple, Award, CheckCircle,
  Leaf, Zap, Star, Heart
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-48 h-48 bg-red-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-red-400/5 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        
        {/* Decorative Top Border */}
        <div className="flex justify-center mb-12">
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full"></div>
        </div>

        {/* Main Grid with Enhanced Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          
          {/* Company Info - Premium Card */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-red-500/20 p-6 shadow-2xl hover:border-red-400/40 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                      <Package className="w-7 h-7 text-red-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center animate-pulse">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-red-300 via-red-300 to-red-300 bg-clip-text text-transparent">
                    Ruchi Bazaar
                  </h2>
                  <p className="text-sm text-red-200/80 flex items-center">
                    <Leaf className="w-3 h-3 mr-1" />
                    Express Fresh Delivery
                  </p>
                </div>
              </div>
              <p className="text-[#D1D5DB] mb-6 leading-relaxed">
                India&apos;s <span className="font-semibold text-red-300">#1 fastest</span> grocery delivery service. 
                Fresh produce delivered to your doorstep in <span className="font-bold text-red-300">30 minutes or FREE!</span>
              </p>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, color: 'hover:bg-red-600' },
                  { icon: Twitter, color: 'hover:bg-blue-500' },
                  { icon: Instagram, color: 'hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500' },
                  { icon: Youtube, color: 'hover:bg-red-600' }
                ].map((social, idx) => (
                  <a 
                    key={idx}
                    href="#" 
                    className={`w-10 h-10 bg-gray-800/80 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color} shadow-lg hover:shadow-xl`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links - Enhanced */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/5 to-red-600/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-red-500/20 p-6 shadow-2xl hover:border-red-400/40 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl flex items-center justify-center mr-3">
                  <CheckCircle className="w-5 h-5 text-red-300" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-red-300 to-red-300 bg-clip-text text-transparent">
                  Quick Links
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  { label: 'About Us', href: '/about-us' },
                  { label: 'Contact Us', href: '/contact-us' },
                  { label: 'FAQ', href: '/faq' },
                  { label: 'Partner With Us', href: '/partner-with-us' },
                  { label: 'Become a Delivery Partner', href: '/delivery-partner' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link 
                      href={item.href} 
                      className="flex items-center group/link text-[#D1D5DB] hover:text-white transition-all duration-300 hover:translate-x-2"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-red-400 rounded-full mr-3 group-hover/link:animate-pulse"></div>
                      <span className="flex-1">{item.label}</span>
                      <div className="opacity-0 group-hover/link:opacity-100 transition-opacity duration-300">
                        <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-400 rounded-full flex items-center justify-center">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info - Premium */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/5 to-red-600/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-red-500/20 p-6 shadow-2xl hover:border-red-400/40 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl flex items-center justify-center mr-3">
                  <Phone className="w-5 h-5 text-red-300" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-red-300 to-red-300 bg-clip-text text-transparent">
                  Contact Us
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start group/item">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                    <Phone className="w-4 h-4 text-red-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">24/7 Customer Support</p>
                    <a href="tel:+911800123456" className="text-lg font-bold bg-gradient-to-r from-red-300 to-red-300 bg-clip-text text-transparent hover:from-red-200 hover:to-red-200 transition-all duration-300">
                      📞 1800-123-456
                    </a>
                  </div>
                </li>
                <li className="flex items-start group/item">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                    <Mail className="w-4 h-4 text-red-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Email us at</p>
                    <a href="mailto:support@ruchibazaar.com" className="text-lg font-bold bg-gradient-to-r from-red-300 to-red-300 bg-clip-text text-transparent hover:from-red-200 hover:to-red-200 transition-all duration-300">
                      ✉️ support@ruchibazaar.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start group/item">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                    <MapPin className="w-4 h-4 text-red-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Head Office</p>
                    <p className="text-sm text-[#D1D5DB] font-medium">123 Food Street, Mumbai</p>
                    <p className="text-xs text-gray-400">Maharashtra 400001</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Showcase - Removed as per request */}

        {/* App Download - Premium */}
        <div className="relative mb-12">
          <div className="absolute -inset-4 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-3xl blur-2xl opacity-50"></div>
          <div className="relative bg-gradient-to-r from-red-900/40 via-gray-900/60 to-red-900/40 rounded-2xl border border-red-500/30 p-8 backdrop-blur-sm shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="mb-6 lg:mb-0 lg:mr-8 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-3">
                    <Apple className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
                    Get Our Mobile App
                  </h3>
                </div>
                <p className="text-[#D1D5DB] mb-4 max-w-lg">
                  <Star className="w-4 h-4 inline mr-1 text-yellow-400" />
                  Order groceries on the go! Faster delivery, exclusive offers, and real-time tracking.
                  <Heart className="w-4 h-4 inline ml-2 text-red-400" />
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button className="flex items-center justify-center bg-black/80 hover:bg-black px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 group">
                    <Apple className="w-5 h-5 mr-2" />
                    <div className="text-left">
                      <div className="text-xs text-gray-400">Download on</div>
                      <div className="font-bold">App Store</div>
                    </div>
                    <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    </div>
                  </button>
                  <button className="flex items-center justify-center bg-black/80 hover:bg-black px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 group">
                    <div className="mr-2 text-xl">▶</div>
                    <div className="text-left">
                      <div className="text-xs text-gray-400">Get it on</div>
                      <div className="font-bold">Google Play</div>
                    </div>
                    <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    </div>
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur-lg opacity-20 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-red-500/30 shadow-xl">
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-red-300 to-red-300 bg-clip-text text-transparent">
                      4.8★
                    </div>
                    <div className="text-sm text-gray-400">5M+ Downloads</div>
                    <div className="text-xs text-red-400 mt-2">#1 in Food Delivery</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Enhanced */}
        <div className="border-t border-red-200/20 pt-8 relative">
          {/* Animated Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-[#9CA3AF]">
                © {new Date().getFullYear()} <span className="font-semibold text-red-300">Ruchi Bazaar</span>. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {[
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms & Conditions', href: '/terms-and-conditions' },
                { label: 'Refund Policy', href: '/refund-policy' },
                { label: 'Delivery Policy', href: '/delivery-policy' },
                { label: 'Cookie Policy', href: '/cookie-policy' },
                { label: 'Offers Terms', href: '/offers-terms' },
                { label: 'Food Safety', href: '/food-safety' },
                { label: 'Grievance', href: '/grievance' },
                { label: 'Accessibility', href: '/accessibility' },
                { label: 'Sitemap', href: '/sitemap.xml' },
              ].map((item, idx) => (
                <Link 
                  key={idx}
                  href={item.href} 
                  className="text-xs sm:text-sm text-[#D1D5DB] hover:text-red-400 transition-all duration-300 hover:scale-105 relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-red-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Payment Methods - Enhanced */}
          <div className="mt-8 pt-6 border-t border-red-200/20">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-400 mb-3">We Accept:</p>
                <div className="flex space-x-3">
                  {['VISA', 'MC', 'UPI', 'PP', 'COD'].map((method, idx) => (
                    <div 
                      key={idx}
                      className="w-14 h-9 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center border border-gray-700/50 hover:border-red-500/50 transition-all duration-300 hover:scale-110 shadow-lg"
                    >
                      <span className="text-xs font-bold bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent">
                        {method}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-sm text-[#9CA3AF] text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2"></div>
                  <span>Serving 100+ cities across India</span>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse ml-2"></div>
                </div>
                <div className="text-xs text-gray-600 mt-1">Licensed FSSAI: 12345678901234</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;