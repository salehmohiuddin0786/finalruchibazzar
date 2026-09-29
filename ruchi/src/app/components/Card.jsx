"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Card({
  id,
  title,
  category,
  updated,
  createdAt,
  image,
  showImage,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const categoryStyles = {
    Quran: "bg-green-100 text-green-800 border-green-300",
    Literature: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Hadith: "bg-blue-100 text-blue-800 border-blue-300",
  };

  const formatDate = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    return isNaN(d)
      ? "Invalid Date"
      : d.toLocaleDateString("ur-PK", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  const onViewClick = (e) => {
    e?.stopPropagation();
    setLoading(true);
    setTimeout(() => {
      router.push(`/notes/${id}`);
    }, 100);
  };

  return (
    <div
      onClick={onViewClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onViewClick(e);
        }
      }}
      aria-label={`Card for ${title}`}
      className={`
        group relative rounded-xl border p-6 shadow-md transition-all duration-300
        hover:scale-[1.02] hover:shadow-xl cursor-pointer overflow-hidden
        max-w-full sm:max-w-sm bg-white
        ${!showImage && (categoryStyles[category] ? categoryStyles[category].split(' ')[0] : 'bg-white')}
        ${!showImage && !categoryStyles[category] ? 'border-gray-200' : ''}
      `}
      style={
        showImage && image
          ? {
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
      {loading ? (
        // Show loading spinner when loading
        <div className="flex justify-center items-center h-40">
          <svg
            className="animate-spin h-8 w-8 text-orange-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Loading"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      ) : (
        <>
          {showImage && image && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 backdrop-blur-[2px] rounded-xl pointer-events-none z-0" />
          )}

          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <span
                className={`
                  self-start px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border
                  ${showImage 
                    ? "bg-white/95 text-gray-900 border-gray-200" 
                    : categoryStyles[category] || "bg-gray-100 text-gray-900 border-gray-200"
                  }
                `}
              >
                {category}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewClick(e);
                }}
                aria-label={`View details for ${title}`}
                className={`
                  bg-orange-500 hover:bg-orange-600 active:bg-orange-700
                  text-white text-sm font-semibold rounded-full px-4 py-1.5 shadow-md 
                  transition-all duration-200 hover:shadow-lg transform hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2
                  ${showImage ? "bg-opacity-95 hover:bg-opacity-100" : ""}
                `}
              >
                View →
              </button>
            </div>

            <h3
              dir="rtl"
              className={`
                text-xl sm:text-2xl font-bold leading-tight urdu-font
                ${showImage ? "text-white" : "text-gray-900"}
              `}
            >
              {title}
            </h3>

            {createdAt && (
              <p className={`text-sm font-medium flex items-center gap-1 ${
                showImage ? "text-gray-200" : "text-gray-700"
              }`}>
                <span className="opacity-80">Created:</span>
                <time className="font-semibold">{formatDate(createdAt)}</time>
              </p>
            )}

            {updated && !isNaN(new Date(updated)) && (
              <p className={`text-sm font-medium flex items-center gap-1 ${
                showImage ? "text-gray-200" : "text-gray-700"
              }`}>
                <span className="opacity-80">Updated:</span>
                <time className="font-semibold">{formatDate(updated)}</time>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}