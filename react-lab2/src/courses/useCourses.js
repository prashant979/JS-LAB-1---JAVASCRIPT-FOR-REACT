// src/courses/useCourses.js
import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false; // cleanup flag: only the latest effect run may set state

    async function loadCourses() {
      try {
        const data = await apiFetch("/api/courses");
        if (ignore) return;
        setCourses(data);
        setStatus("ready");
      } catch (err) {
        if (ignore) return;
        setError(err.message);
        setStatus("error");
      }
    }

    loadCourses();
    return () => {
      ignore = true;
    };
  }, []);

  // Resolves with the created course; rejects with the ApiError (the caller handles it).
  async function addCourse(courseRequest) {
    const created = await apiFetch("/api/courses", {
      method: "POST",
      body: courseRequest,
    });

    setCourses((prev) =>
      [...prev, created].sort((a, b) => a.code.localeCompare(b.code))
    );
    return created;
  }

  return { status, courses, error, addCourse };
}