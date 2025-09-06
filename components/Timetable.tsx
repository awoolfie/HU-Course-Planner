"use client";

import React, { useRef } from "react";
import * as htmlToImage from "html-to-image";

type Slot = {
  day: string;
  start: number;
  end: number;
  room: string;
  lecturer: string;
  type: string;
};

type Module = {
  code: string;
  name: string;
  credits: number;
  occ: {
    id: number;
    label: string;
    slots: Slot[];
  };
};

type Props = {
  modules: Module[];
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8:00 - 18:00

export default function Timetable({ modules }: Props) {
  const tableRef = useRef<HTMLDivElement>(null);

  const handleSaveAsPng = async () => {
    if (tableRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(tableRef.current, { quality: 1.0 });
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "timetable.png";
        link.click();
      } catch (error) {
        console.error("Failed to save timetable as PNG:", error);
      }
    }
  };

  const allSlotsWithModule = React.useMemo(
    () =>
      modules.flatMap((m) =>
        (m.occ?.slots || []).map((s) => ({
          ...s,
          module: m,
        }))
      ),
    [modules]
  );

  // Styles
  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
    border: "1px solid #d1d5db",
  };
  const thStyle: React.CSSProperties = {
    border: "1px solid #d1d5db",
    background: "#f3f4f6",
    padding: "8px",
    textAlign: "center",
    fontWeight: 600,
  };
  const tdStyle: React.CSSProperties = {
    border: "1px solid #d1d5db",
    padding: "6px",
    verticalAlign: "top",
  };
  const hourCellStyle: React.CSSProperties = {
    ...tdStyle,
    background: "#fbfafb",
    textAlign: "center",
    width: 88,
    fontWeight: 600,
  };

  const colors = {
    lecture: "#E9D5FF", // lilac
    tutorial: "#FCE7F3", // light pink
    hybrid: "#DBF4FF", // light blue
    fallback: "#E5E7EB",
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <LegendItem color={colors.lecture} label="Lecture" />
          <LegendItem color={colors.tutorial} label="Tutorial" />
          <LegendItem color={colors.hybrid} label="Lecture + Tutorial" />
        </div>
        <button
          onClick={handleSaveAsPng}
          style={{
            background: "#6D28D9",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Save as PNG
        </button>
      </div>

      {/* Timetable */}
      <div ref={tableRef} style={{ overflowX: "auto", background: "white", padding: 12, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <table style={tableStyle} aria-label="Weekly timetable">
          <thead>
            <tr>
              <th style={thStyle} />
              {days.map((day) => (
                <th key={day} style={thStyle}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {hours.map((hour) => (
              <tr key={hour} style={{ height: 64 }}>
                <td style={hourCellStyle}>{hour}:00</td>
                {days.map((day) => {
                  const slot = allSlotsWithModule.find((s) => s.day === day && s.start === hour);

                  if (slot) {
                    const type = (slot.type || "").toLowerCase();
                    const hasLecture = /lect|lecture|lec/.test(type);
                    const hasTutorial = /tut|tutorial/.test(type);
                    const isHybrid =
                      /hyb|hybrid|mix/.test(type) || (hasLecture && hasTutorial) || /\b(&|and)\b/.test(type);

                    let bg = colors.fallback;
                    if (isHybrid) bg = colors.hybrid;
                    else if (hasLecture) bg = colors.lecture;
                    else if (hasTutorial) bg = colors.tutorial;

                    const span = Math.max(1, Math.floor((slot.end || slot.start + 1) - (slot.start || hour)));

                    return (
                      <td key={day + hour} style={{ ...tdStyle }} rowSpan={span}>
                        <div
                          style={{
                            background: bg,
                            borderRadius: 8,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                            padding: 8,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: 6,
                          }}
                        >
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{slot.module.code}</div>
                          <div style={{ fontSize: 12, fontWeight: 600 }}>{slot.type}</div>
                          <div style={{ fontSize: 12 }}>{slot.room}</div>
                          <div style={{ fontSize: 11, color: "#475569" }}>{slot.lecturer}</div>
                          <div style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>
                            {slot.start}:00 - {slot.end}:00
                          </div>
                        </div>
                      </td>
                    );
                  }

                  const covered = allSlotsWithModule.some(
                    (s) => s.day === day && s.start < hour && s.end > hour
                  );
                  return covered ? null : <td key={day + hour} style={tdStyle} />;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Legend
function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div
        style={{
          width: 18,
          height: 12,
          background: color,
          borderRadius: 4,
          border: "1px solid #d1d5db",
        }}
      />
      <div style={{ fontSize: 13 }}>{label}</div>
    </div>
  );
}