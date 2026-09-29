"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const tabs = ["Quran", "Hadith", "Literature"];

const allData = {
  Quran: [
  {
    title: "آپ کا مستقبل آپ کے ہاتھ میں",
    description:
      "یہ کتاب نوجوانوں کو خودی کی پہچان، صلاحیتوں کی دریافت اور مضبوط کردار کی تعمیر کے ذریعے اپنے مستقبل کو بہتر بنانے کی ترغیب دیتی ہے۔",
    image: "/Quran.jpg",
  },
  {
    title: "امانت",
    description:
      "قرآن و حدیث کی روشنی میں یہ کتاب امانت داری، وعدوں کی پاسداری اور عدل و دیانت کے اصولوں کو بیان کرتی ہے۔",
    image: "/Quran1.jpg",
  },
  {
    title: "دعوتِ دین",
    description:
      "یہ کتاب انبیاء کے مشن اور امتِ مسلمہ کی ذمہ داری کو اجاگر کرتی ہے کہ وہ نیکی کا حکم دیں، برائی سے روکیں اور دینِ حق کو عام کریں۔",
    image: "/Quran2.jpg",
  },
],

  Hadith: [
    {
      title: "کارکنوں کے باہمی تعلقات (حصہ اوّل)",
      description:
        "اس حصے میں اسلامی اخوت، محبت، ایثار اور کارکنوں کے درمیان تعلقات کی بنیاد کو واضح کیا گیا ہے۔ قرآن و سنت کی روشنی میں مومنوں کے درمیان بھائی چارے، رفاقت اور جماعتی جدوجہد میں اتحاد و یکجہتی کی اہمیت بیان کی گئی ہے۔",
      image: "/hadith1.jpg",
    },
    {
      title: "کارکنوں کے باہمی تعلقات (حصہ دوم)",
      description:
        "اس حصے میں مسلمانوں کے آپس کے حقوق، خیر خواہی، ایثار، عدل، احسان اور رحمت جیسے اوصاف کو اجاگر کیا گیا ہے۔ سیرتِ نبویؐ اور صحابہ کرامؓ کی مثالوں کے ذریعے یہ واضح کیا گیا ہے کہ بھائی چارے کو قائم رکھنے کے لیے ایثار اور عدل بنیادی حیثیت رکھتے ہیں۔",
      image: "/hadith2.jpg",
    },
    {
      title: "کارکنوں کے باہمی تعلقات (حصہ پنجم)",
      description:
        "اس حصے میں عزت و آبرو کے تحفظ، دکھ درد میں شرکت، حاجت روائی، احتساب و نصیحت اور ملاقات و محبت کے آداب کو بیان کیا گیا ہے۔ مسلمانوں کے باہمی تعلقات میں اخلاص، قربانی اور ایثار کو مضبوط کرنے پر زور دیا گیا ہے۔",
      image: "/hadith3.jpg",
    },
  ],
  Literature: [
  {
    title: "اپنی تربیت کیسے کریں؟ (حصہ دوم)",
    description:
      "یہ کتابچہ خودسازی اور تعمیرِ سیرت کے اصولوں پر مبنی ہے۔ اس میں مقصدِ زندگی، جنت کو اصل ہدف بنانے، یکسوئی، عزم، ارادے اور مسلسل سعی کے ذریعے اپنی شخصیت کو سنوارنے کے عملی طریقے بیان کیے گئے ہیں۔ ساتھ ہی یہ واضح کیا گیا ہے کہ ہر نیکی، مصیبت اور حتیٰ کہ گناہ بھی اگر توبہ کے جذبے کے ساتھ ہو تو انسان کی تربیت کا ذریعہ بن سکتا ہے۔",
    image: "/is1.jpg",
  },
  {
    title: "بدر – یوم الفرقان (2016)",
    description:
      "اس کتاب میں غزوۂ بدر کے پس منظر، اس کی تیاری، صحابہ کرامؓ کے جذبۂ ایمانی اور اللہ کی مدد کے اسباق کو بیان کیا گیا ہے۔ یہ واضح کیا گیا ہے کہ فتح و نصرت کا اصل دار و مدار اللہ پر بھروسے اور صبر و استقامت پر ہے، نہ کہ صرف وسائل پر۔ ساتھ ہی اس دور کے واقعات کو آج کے حالات پر منطبق کرنے کی دعوت دی گئی ہے تاکہ دوبارہ \"فضائے بدر\" پیدا کی جا سکے۔",
    image: "/is2.jpg",
  },
  {
    title: "بدر – یوم الفرقان",
    description:
      "یہ کتاب غزوۂ بدر کے تفصیلی واقعات، رسول اللہ ﷺ کی قیادت، صحابہؓ کی قربانیاں اور اللہ کی مدد کے عملی مظاہر کو بیان کرتی ہے۔ اس میں مکہ اور مدینہ کے حالات، مہاجرین و انصار کی مواخات، لشکروں کا موازنہ، اور بدر کی رات کی دعاؤں کے مناظر شامل ہیں۔ مقصد تاریخ بیان کرنا نہیں بلکہ ان واقعات سے سبق اور رہنمائی حاصل کرنا ہے تاکہ آج کے مسلمانوں کو عمل کی طرف ابھارا جا سکے۔",
    image: "/is3.jpg",
  },

  ],
};

export default function ScripturesSection() {
  const [activeTab, setActiveTab] = useState("Quran");
  const router = useRouter();

  const currentData = allData[activeTab];

  const handleCardClick = () => {
    router.push(`/notes?category=${encodeURIComponent(activeTab)}`);
  };

  const handleViewAll = () => {
    router.push("/notes");
  };

  return (
    <section className="py-10 bg-white px-4 max-w-8xl mx-auto">
      {/* Title */}
      <h2 className="text-3xl text-black font-semibold text-center mb-8">
        Scriptures
      </h2>

      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="bg-orange-100 rounded-full p-2 flex space-x-4 sm:space-x-6 shadow-inner">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 ${
                activeTab === tab
                  ? "bg-white text-blue-900 shadow-md"
                  : "text-orange-500 hover:text-orange-600 hover:bg-orange-200"
              }`}
              aria-pressed={activeTab === tab}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentData.map((card, index) => (
          <div
            key={index}
            onClick={handleCardClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleCardClick();
              }
            }}
            className="rounded-xl overflow-hidden shadow-lg bg-white transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
            aria-label={`View notes for ${card.title}`}
            dir="rtl"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-4 text-right">
              <h3 className="text-lg font-bold text-blue-900 italic">{card.title}</h3>
              <p className="text-sm text-gray-700 italic mt-1 mb-4">
                {card.description}
              </p>
              <button
                className="text-xs bg-orange-200 text-orange-900 font-semibold px-3 py-1 rounded-md hover:bg-orange-300 transition pointer-events-none"
                tabIndex={-1}
                aria-hidden="true"
              >
                مزید پڑھیں
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Scriptures Button */}
      <div className="flex justify-center mt-12">
        <button
          onClick={handleViewAll}
          className="bg-purple-800 hover:bg-purple-900 text-white font-semibold px-6 py-2 rounded-md transition duration-300"
        >
          تمام مضامین دیکھیں
        </button>
      </div>
    </section>
  );
}
