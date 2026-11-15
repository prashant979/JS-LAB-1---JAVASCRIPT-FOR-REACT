// src/courses/CoursesPage.jsx
import { useState } from "react";
import { useCourses } from "./useCourses.js";
import { CourseForm } from "./CourseForm.jsx";

function seatsLabel(seatsLeft) {
  if (seatsLeft === 0) return "Full";
  if (seatsLeft === 1) return "1 seat left";
  return `${seatsLeft} seats left`;
}

export function CoursesPage() {
  const { status, courses, error, addCourse } = useCourses();

  // Submit state belongs to the page/form, not the hook.
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Resolves true on success, false on failure, so the form knows whether to clear itself.
  async function handleAdd(courseRequest) {
    setSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});
    try {
      await addCourse(courseRequest);
      return true;
    } catch (err) {
      setSubmitError(err.message);
      setFieldErrors(err.fieldErrors ?? {});
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <h1>Courses</h1>

      {status === "loading" && <p>Loading courses…</p>}

      {status === "error" && <p>Couldn't load courses: {error}</p>}

      {status === "ready" && courses.length === 0 && <p>No courses yet.</p>}

      {status === "ready" && courses.length > 0 && (
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              <div>
                {course.code} · {course.title}
              </div>
              <div>
                {course.credits} credits · {course.department} ·{" "}
                {seatsLabel(course.seatsLeft)}
              </div>
            </li>
          ))}
        </ul>
      )}

      <CourseForm
        onAdd={handleAdd}
        submitting={submitting}
        submitError={submitError}
        fieldErrors={fieldErrors}
      />
    </main>
  );
}