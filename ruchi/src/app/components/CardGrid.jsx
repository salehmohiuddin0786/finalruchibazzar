"use client";
import React from "react";
import Card from "./Card";

export default function CardGrid({ cards, categoryFilter, searchFilter }) {
  const filteredCards = cards.filter((card) => {
    const matchesCategory = categoryFilter ? card.category === categoryFilter : true;
    const matchesSearch = searchFilter
      ? card.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        card.category.toLowerCase().includes(searchFilter.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl bg-white mx-auto px-4 sm:px-6 md:px-12 py-6 mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredCards.length === 0 && (
          <p className="col-span-full text-center text-gray-500 py-6">
            No cards found.
          </p>
        )}

        {filteredCards.map((card) => (
          <Card
            key={card.id}
            {...card}
            onViewClick={() => alert(`View clicked for ${card.title}`)}
          />
        ))}
      </div>
    </div>
  );
}
