// Section 11 — The array toolkit for UIs
import { toCardView } from "./s04-functions.js";
import { byField } from "./s05-higher-order.js";

// Courses in one department. Case-insensitive.
export function byDepartment(courses, department) {
  return courses.filter((x) => x.department.toLowerCase() === department.toLowerCase());
}

// Courses that still have seats.
export function openOnly(courses) {
  return courses.filter((x) => x.seatsLeft > 0);  
}

// Case-insensitive match on code OR title. A blank query returns everything.
export function searchCourses(courses, query) {
  const q = query.trim().toLowerCase();

  if (q === "") return courses;

  return courses.filter(course =>
    course.code.toLowerCase().includes(q) ||
    course.title.toLowerCase().includes(q)
  );

}

// The course with this code (case-insensitive), or undefined.
export function findByCode(courses, code) {
  return courses.find((x) => x.code.toLowerCase() === code.toLowerCase());  
}

// Sum of credits.
export function totalCredits(courses) {
  let sum = 0;
  for (const c of courses) {
    sum += c.credits;
  }
  return sum
}

// { "Computer Science": 5, "Electronics": 4, ... }
export function countByDepartment(courses) {
  const map = new Map();

  for (const c of courses) {
    if(map.has(c.department)) {
      map.set(c.department, map.get(c.department) + 1);
    } else {
      map.set(c.department, 1);
    }
  }
  return Object.fromEntries(map);;
}

// Unique department names, sorted A→Z.
export function departments(courses) {
  let set = new Set();

  for (const c of courses) {
    set.add(c.department);
  }
  const arr = [...set].sort((a, b) => a.localeCompare(b));
  return arr;
}

// A sorted COPY. The input must not change. Reuse byField from section 05.
export function sortedBy(courses, field) {
  return [...courses].sort(byField(field));
}

// Is at least one course full?
export function anyFull(courses) {
  for (const c of courses) {
    if (c.seatsLeft === 0) {
      return true;
    }
  }
  return false;
}

// Does every course have at least `n` seats?
export function allHaveSeats(courses, n = 1) {
  for (const c of courses) {
    if (c.seatsLeft <  n) {
      return false;
    }
  }
  return true;
}

// The cards a department page shows: that department, open courses only,
// sorted by code, turned into card views. One chain.
export function courseCards(courses, department) {
  let c = openOnly(courses);
  c = c.filter((x) => x.department.toLowerCase() === department.toLowerCase());
  c = c.sort((a, b) => a.code.localeCompare(b.code));
  return c.map(toCardView);
}

// Planner ids → the course objects, in planner order. Unknown ids are skipped.
export function plannerCourses(planner, courses) {
  return planner
    .map((id) => courses.find((course) => course.id === id))
    .filter((course) => course !== undefined);
}

// Total credits of the planned courses.
export function plannerCredits(planner, courses) {
  return plannerCourses(planner, courses)
    .reduce((total, course) => total + course.credits, 0);
}

// Can this course be added? It must exist, have a seat, not already be in
// the planner, and keep the total within the limit (24 by default).
export function canAdd(planner, courses, courseId, limit = 24) {
  const course = courses.find((c) => c.id === courseId);

  if (!course) return false;

  if (course.seatsLeft <= 0) return false;

  if (planner.includes(courseId)) return false;

  if (plannerCredits(planner, courses) + course.credits > limit) {
    return false;
  }

  return true;
}