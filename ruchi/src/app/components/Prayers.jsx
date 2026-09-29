"use client";
import React, { useEffect, useState } from "react";

function convertTo12Hour(time24) {
  // time24 format is like "18:45" or "05:30"
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // convert 0 to 12 for 12AM
  return `${hour}:${minute} ${ampm}`;
}

export default function PrayerTimes() {
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!navigator.geolocation) {
      queueMicrotask(() => {
        if (isMounted) {
          setError("Geolocation is not supported by your browser");
          setLoading(false);
        }
      });
      return () => { isMounted = false; };
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://api.aladhan.com/v1/timings/${Math.floor(
              Date.now() / 1000
            )}?latitude=${latitude}&longitude=${longitude}&method=2`
          );
          const data = await res.json();

          if (data.code === 200 && data.data && data.data.timings) {
            const prayerTimes = [
              { name: "Fajr", time: convertTo12Hour(data.data.timings.Fajr) },
              { name: "Zuhr", time: convertTo12Hour(data.data.timings.Dhuhr) },
              { name: "Asar", time: convertTo12Hour(data.data.timings.Asr) },
              { name: "Maghrib", time: convertTo12Hour(data.data.timings.Maghrib) },
              { name: "Isha", time: convertTo12Hour(data.data.timings.Isha) },
            ];
            setTimes(prayerTimes);
          } else {
            setError("Failed to fetch prayer times");
          }
        } catch (err) {
          setError("Error fetching prayer times");
          console.error(err);
        }

        setLoading(false);
      },
      (error) => {
        setError("Permission denied or unable to retrieve location");
        setLoading(false);
      }
    );
  }, []);

  if (loading)
    return (
      <div className="bg-[#05056e] border-t-4 border-blue-400 text-white py-6 px-4">
        <p className="text-center">Loading prayer times...</p>
      </div>
    );

  if (error)
    return (
      <div className="bg-[#05056e] border-t-4 border-blue-400 text-white py-6 px-4">
        <p className="text-center text-red-400">{error}</p>
      </div>
    );

  return (
    <div className="bg-[#05056e] border-t-4 border-blue-400 text-white py-6 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
        {times.map((prayer) => (
          <div key={prayer.name}>
            <p className="italic text-white text-sm">{prayer.name}</p>
            <p className="italic font-semibold text-white">{prayer.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
