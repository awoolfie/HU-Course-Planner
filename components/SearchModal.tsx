"use client";

import React, { useEffect, useMemo, useState } from "react";

type Slot = {
  day: string;
  start: number;
  end: number;
  room: string;
  lecturer: string;
  type: string;
};

type RawOccurrence = { slots: Slot[] };
type RawCourse = {
  ["course.id"]: string;
  ["course.name"]: string;
  credits: number;
  occurrences: RawOccurrence[];
};

type Occ = { id: number; label: string; slots: Slot[] };
export type Module = {
  code: string;
  name: string;
  credits: number;
  occurrences: Occ[];
};

type Props = {
  onClose: () => void;
  onSelectModule: (module: Module | null) => void;
  onSelectOccurrence: (occ: Occ) => void;
  currentModule: Module | null;
};

export default function SearchModal({
  onClose,
  onSelectModule,
  onSelectOccurrence,
  currentModule,
}: Props) {
  const [search, setSearch] = useState("");
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch and normalize data
  useEffect(() => {
    setLoading(true);
    fetch("/data/courses.json")
      .then((r) => r.json())
      .then((data: RawCourse[]) => {
        const mapped: Module[] = data.map((c) => ({
          code: c["course.id"],
          name: c["course.name"],
          credits: c.credits,
          occurrences: c.occurrences.map((occ, idx) => ({
            id: idx,
            label: `Occurrence ${idx + 1}`,
            slots: occ.slots,
          })),
        }));
        setModules(mapped);
      })
      .catch((e) => console.error("Failed to load courses:", e))
      .finally(() => setLoading(false));
  }, []);

  // Filter results only after typing
  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return modules.filter((m) => {
      const code = m.code?.toLowerCase() ?? "";
      const name = m.name?.toLowerCase() ?? "";
      return code.includes(q) || name.includes(q);
    });
  }, [search, modules]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center -mt-20">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl rounded-lg bg-white text-gray-900 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Search Modules</h3>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
          >
            Close
          </button>
        </div>

        {/* Search field */}
        <input
          autoFocus
          value={search}
          onChange={(e) => {
            if (currentModule) onSelectModule(null);
            setSearch(e.target.value);
          }}
          placeholder="Type code or name (e.g. ACC101 or Accounting)"
          className="w-full border rounded-md px-3 py-2 mb-4"
        />

        {loading ? (
          <div className="text-sm text-gray-600">Loading…</div>
        ) : currentModule ? (
          // Occurrence chooser
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">
                {currentModule.code} — {currentModule.name}
              </div>
              <button
                type="button"
                onClick={() => onSelectModule(null)}
                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Back to results
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {currentModule.occurrences.map((occ) => (
                <div
                  key={occ.id}
                  className="border rounded-md p-3 bg-gray-50 shadow-sm"
                >
                  <div className="font-medium mb-2">{occ.label}</div>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    {occ.slots.map((s, i) => (
                      <div key={i} className="rounded border bg-white p-2">
                        <div className="font-medium">
                          {s.day} {s.start}:00–{s.end}:00
                        </div>
                        <div>Room: {s.room}</div>
                        <div>Type: {s.type}</div>
                        <div className="text-xs text-gray-600">
                          {s.lecturer}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => onSelectOccurrence(occ)}
                      className="px-3 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                    >
                      Choose this occurrence
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-sm text-gray-600">
            {search.trim() === ""
              ? "Start typing to search for modules…"
              : "No modules match your search."}
          </div>
        ) : (
          // Search results
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {results.map((m) => (
              <div
                key={m.code}
                className="border rounded-md p-3 bg-gray-50 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">
                      {m.code} — {m.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Credits: {m.credits}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectModule(m)}
                    className="px-3 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}