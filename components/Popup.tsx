"use client";

import React from "react";

export default function Popup({
  message,
  onClose,
  type = "conflict"
}: {
  message: string;
  onClose: () => void;
  type?: "conflict" | "credits";
}) {
  const titles = {
    conflict: "⚠️ Timetable Conflict Detected",
    credits: "⚠️ Credit Hours Limit Exceeded"
  };

  const bgColors = {
    conflict: "bg-purple-800",
    credits: "bg-red-700"
  };

  const buttonColors = {
    conflict: "bg-purple-300 text-purple-900 hover:bg-purple-200",
    credits: "bg-red-300 text-red-900 hover:bg-red-200"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${bgColors[type]} text-white p-6 rounded-lg shadow-lg w-[400px]`}>
        <h2 className="text-lg font-bold mb-3">{titles[type]}</h2>
        <p className="mb-4 whitespace-pre-line">{message}</p>
        <button
          onClick={onClose}
          className={`px-4 py-2 rounded-md font-semibold ${buttonColors[type]}`}
        >
          Close
        </button>
      </div>
    </div>
  );
}