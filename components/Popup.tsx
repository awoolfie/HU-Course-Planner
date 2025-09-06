"use client";

import React from "react";

export default function Popup({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-purple-800 text-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-lg font-bold mb-3">⚠️ Conflict Detected</h2>
        <p className="mb-4">{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-purple-300 text-purple-900 rounded-md font-semibold hover:bg-purple-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}