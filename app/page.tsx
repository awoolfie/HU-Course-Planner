"use client";
import React, { useState, useEffect } from "react";
import Timetable from "@/components/Timetable";
import Popup from "@/components/Popup";
import { hasConflict } from "@/lib/conflict";

export default function Home() {
  // --- State for selected modules and errors ---
  const [selectedModules, setSelectedModules] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<"conflict" | "credits" | null>(null);

  // --- State for search bar and results ---
  const [search, setSearch] = useState("");
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // --- Load all modules from JSON once ---
  useEffect(() => {
    setLoading(true);
    fetch("/data/courses.json")
      .then((r) => r.json())
      .then((data) => setModules(data))
      .catch(() => setModules([]))
      .finally(() => setLoading(false));
  }, []);

  // --- Calculate total credit hours ---
  const totalCreditHours = selectedModules.reduce((total, module) => total + module.credits, 0);

  // --- Filter modules by search ---
  const searchResults = search.trim()
    ? modules.filter((m) => {
        const code = (m["course.id"] || m.code || "").toLowerCase();
        const name = (m["course.name"] || m.name || "").toLowerCase();
        const q = search.trim().toLowerCase();
        return code.includes(q) || name.includes(q);
      })
    : [];

  return (
    <main className="min-h-screen bg-purple-700 text-white p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">The Course Planner</h1>
        </div>
        <div className="flex justify-between items-center">
          <div className={`text-lg ${totalCreditHours > 20 ? 'text-red-300' : 'text-purple-200'}`}>
            Credit Hours: {totalCreditHours}/20
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search modules (code or name)"
                className="border rounded-md px-3 py-2 text-black min-w-[240px]"
                style={{ background: "#fff" }}
              />
              {search && (
                <div className="absolute left-0 mt-2 w-full z-50 rounded shadow-lg p-2" style={{background: "#fff", border: "1px solid #ddd", color: "#000"}}>
                  {loading ? (
                    <div className="text-sm text-gray-600">Loading…</div>
                  ) : searchResults.length === 0 ? (
                    <div className="text-sm text-gray-600">No modules match your search.</div>
                  ) : (
                    <div className="space-y-2">
                      {searchResults.map((m) => (
                        <div key={m["course.id"] || m.code} className="border rounded-md p-2 bg-white shadow-sm flex items-center justify-between text-black">
                          <div>
                            <div className="font-semibold">
                              {(m["course.id"] || m.code) + " — " + (m["course.name"] || m.name)}
                            </div>
                            <div className="text-sm text-gray-600">Credits: {m.credits}</div>
                          </div>
                          <button
                            type="button"
                            className="px-3 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                            onClick={() => {
// Check for duplicate
if (selectedModules.some(mod => mod.code === (m["course.id"] || m.code))) {
  alert("Module already added."); // Native browser popup
  return;
}

// Check credit hours
if (totalCreditHours + m.credits > 20) {
  alert(
    `Adding ${(m["course.id"] || m.code)} would exceed the maximum of 20 credit hours.\n\n` +
    `Current: ${totalCreditHours} credits\n` +
    `Attempting to add: ${m.credits} credits\n` +
    `Maximum allowed: 20 credits`
  );
  return;
}

// Add first occurrence only
const occ = m.occurrences?.[0] || null;
if (!occ) {
  alert("No occurrence available for this module.");
  return;
}

// Check for conflicts
const existingSlots = selectedModules.flatMap((mod) => mod.occ.slots);
if (hasConflict(existingSlots, occ.slots)) {
  alert(`The occurrence "${occ.label}" for ${(m["course.id"] || m.code)} conflicts with your existing timetable.`);
  return;
}
                              setSelectedModules((prev) => [
                                ...prev,
                                {
                                  code: m["course.id"] || m.code,
                                  name: m["course.name"] || m.name,
                                  credits: m.credits,
                                  occ,
                                },
                              ]);
                              setSearch("");
                            }}
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Selected Modules + Timetable */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Timetable</h2>
        <Timetable modules={selectedModules} />
      </section>

      {/* Popup for errors */}
      {errorMessage && errorType && (
        <Popup
          message={errorMessage}
          type={errorType}
          onClose={() => {
            setErrorMessage(null);
            setErrorType(null);
          }}
        />
      )}
    </main>
  );
}