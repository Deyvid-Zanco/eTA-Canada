"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { COUNTRIES } from "../../lib/countries";

export default function CountrySearchGrid() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return COUNTRIES;
    return COUNTRIES.filter(c => c.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <div className="space-y-6">
      <input
        type="text"
        placeholder="Search your country..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full md:w-1/2 border rounded p-2"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map(country => (
          <Link
            key={country}
            href={{ pathname: "/apply", query: { nationality: country } }}
            className="border rounded p-3 text-center hover:bg-gray-100"
          >
            {country}
          </Link>
        ))}
      </div>
    </div>
  );
} 