"use client";

import React, { useState } from "react";
import Timetable from "@/components/Timetable";
import SearchModal from "@/components/SearchModal";
import Popup from "@/components/Popup";
import { hasConflict } from "@/lib/conflict";

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedModules, setSelectedModules] = useState<any[]>([]);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);
  const [currentModule, setCurrentModule] = useState<any | null>(null);

  return (
    <main className="min-h-screen bg-purple-700 text-white p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">The Course Planner</h1>
        <button
          onClick={() => setIsSearchOpen(true)}
          className="px-4 py-2 rounded-md bg-purple-300 text-purple-900 font-semibold hover:bg-purple-200"
        >
          Search Modules
        </button>
      </header>

      {/* Selected Modules + Timetable */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Timetable</h2>
        <Timetable modules={selectedModules} />
      </section>

      {/* Search modal */}
      {isSearchOpen && (
        <SearchModal
          onClose={() => {
            setIsSearchOpen(false);
            setCurrentModule(null);
          }}
          onSelectModule={(module) => setCurrentModule(module)}
          onSelectOccurrence={(occ) => {
            const existingSlots = selectedModules.flatMap((m) => m.occ.slots);

            if (hasConflict(existingSlots, occ.slots)) {
              setConflictMessage(
                `The occurrence "${occ.label}" for ${currentModule?.code} conflicts with your existing timetable.`
              );
            } else if (currentModule) {
              const chosenModule = {
                code: currentModule.code,
                name: currentModule.name,
                credits: currentModule.credits,
                occ, // keep only the chosen occurrence
              };
              setSelectedModules((prev) => [...prev, chosenModule]);
            }

            setCurrentModule(null);
          }}
          currentModule={currentModule}
        />
      )}

      {/* Popup for conflicts */}
      {conflictMessage && (
        <Popup
          message={conflictMessage}
          onClose={() => setConflictMessage(null)}
        />
      )}
    </main>
  );
}