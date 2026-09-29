"use client";
import React from "react";

const categories = ["Quran", "Literature", "Hadith"];
const sortOptions = ["Newest", "Oldest", "Most Popular"];

export default function FilterBar({
  category,
  sortBy,
  search,
  onCategoryChange,
  onSortChange,
  onSearchChange,
}) {
  return (
    <div className="flex flex-col md:flex-row items-center text-black bg-white justify-between space-y-4 md:space-y-0 md:space-x-6 p-4 rounded-md shadow-md max-w-7xl mx-auto mb-6">
      
      <div className="w-full md:w-1/4">
        <label htmlFor="category" className="block mb-1 font-semibold text-blue-900">
          CATEGORY :
        </label>
        <select
          id="category"
          value={category}
          onChange={onCategoryChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          aria-label="Filter by category"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full md:w-1/4">
        <label htmlFor="sortBy" className="block mb-1 font-semibold text-blue-900">
          SORT BY
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={onSortChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          aria-label="Sort options"
        >
          <option value="">Select Sort Option</option>
          {sortOptions.map((sort) => (
            <option key={sort} value={sort}>
              {sort}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full md:w-1/3 relative">
        <label htmlFor="search" className="sr-only">Search</label>
        <input
          type="text"
          id="search"
          value={search}
          onChange={onSearchChange}
          placeholder="Search..."
          className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          aria-label="Search notes"
        />
        <svg
          aria-hidden="true"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.4-5.4a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}
