// IN-LAB TASK (AI closed). Do this in the lab, not at home.
//
// A study plan groups planned course ids by semester:
//
//   const plan = {
//     student: "Asha",
//     semesters: { "2026-odd": [4, 10], "2027-even": [18] },
//   };
//
// Write addToSemester(plan, semester, courseId). It returns a NEW plan where
// that semester's list ends with courseId. Rules:
//   - never change the input (the tests freeze it — mutation throws)
//   - the student and every OTHER semester stay the SAME references
//   - a semester that does not exist yet is created
//   - if the id is already in that semester, return the SAME plan
//
// Stretch: moveCourse(plan, from, to, courseId) — out of one semester, into another.

export function addToSemester(plan, semester, courseId) {
  // Get the existing semester courses (or an empty array)
  const courses = plan.semesters[semester] || [];

  // If course already exists, return the same plan
  if (courses.includes(courseId)) {
    return plan;
  }

  // Create a new plan with updated semester
  return {
    ...plan,
    semesters: {
      ...plan.semesters,
      [semester]: [...courses, courseId],
    },
  };
}

export function moveCourse(plan, from, to, courseId) {
  // Check whether course exists in the source semester
  const fromCourses = plan.semesters[from] || [];

  if (!fromCourses.includes(courseId)) {
    return plan;
  }

  // Remove course from source semester
  const updatedFrom = fromCourses.filter(id => id !== courseId);

  // Add course to destination semester
  const toCourses = plan.semesters[to] || [];

  const updatedTo = toCourses.includes(courseId)
    ? toCourses
    : [...toCourses, courseId];

  // Return a new plan
  return {
    ...plan,
    semesters: {
      ...plan.semesters,
      [from]: updatedFrom,
      [to]: updatedTo,
    },
  };
}
