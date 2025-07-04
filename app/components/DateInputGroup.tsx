"use client";
import React from "react";

interface DateInputGroupProps {
  label: string;
  name: string; // base name, e.g., "dob"
  required?: boolean;
}

export default function DateInputGroup({ label, name, required }: DateInputGroupProps) {
  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          name={`${name}_day`}
          placeholder="DD"
          pattern="\\d{2}"
          maxLength={2}
          required={required}
          className="date-segment-input"
          inputMode="numeric"
        />
        <span>/</span>
        <select
          name={`${name}_month`}
          required={required}
          className="date-segment-input bg-white"
          defaultValue=""
        >
          <option value="" disabled>
            MM
          </option>
          <option value="01">Jan</option>
          <option value="02">Feb</option>
          <option value="03">Mar</option>
          <option value="04">Apr</option>
          <option value="05">May</option>
          <option value="06">Jun</option>
          <option value="07">Jul</option>
          <option value="08">Aug</option>
          <option value="09">Sep</option>
          <option value="10">Oct</option>
          <option value="11">Nov</option>
          <option value="12">Dec</option>
        </select>
        <span>/</span>
        <input
          type="text"
          name={`${name}_year`}
          placeholder="YYYY"
          pattern="\\d{4}"
          maxLength={4}
          required={required}
          className="date-segment-input"
          inputMode="numeric"
        />
      </div>
    </div>
  );
} 