"use client";

import { useEffect, useState } from "react";

export default function CourseCard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [showOccurrences, setShowOccurrences] = useState(false);

  // Fetch courses.json from /public/data
  useEffect(() => {
    fetch("/data/courses.json")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Failed to load courses:", err));
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Courses</h2>

      {courses.length === 0 ? (
        <p>Loading courses...</p>
      ) : (
        <ul className="space-y-4">
          {courses.map((course) => (
            <li key={course.id} className="p-3 border rounded-lg">
              <h3 className="font-semibold">{course.name ?? `Course ${course.id}`}</h3>

              <button
                onClick={() => setShowOccurrences(!showOccurrences)}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
              >
                {showOccurrences ? "Hide Details" : "Show Details"}
              </button>

              {showOccurrences && (
                <div className="mt-2">
                  {course.lecture && (
                    <div>
                      <p>
                        <strong>Lecture:</strong> {course.lecture.day},{" "}
                        {course.lecture.time}, {course.lecture.room} <br />
                        Lecturer: {course.lecture.lecturer}
                      </p>
                    </div>
                  )}

                  {course.tutorial && (
                    <div className="mt-2">
                      <p>
                        <strong>Tutorial:</strong> {course.tutorial.day},{" "}
                        {course.tutorial.time}, {course.tutorial.room} <br />
                        Lecturer: {course.tutorial.lecturer}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}