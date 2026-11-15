# Audit — React Lab 2

## 0. What came back

| File the AI gave you | What's in it (components, hooks) | Lines |
|---|---|---|
| `src/courses/CoursesPage.jsx` | CoursesPage component; calls useCourses and connects the View and Form | Entire component |
| `src/courses/useCourses.js` | useCourses custom hook; useState (3), useEffect (1), GET and POST API logic | Entire file |
| `src/courses/CoursesView.jsx` | CoursesView component; displays loading, error, empty and course list states | Entire component |
| `src/courses/AddCourseForm.jsx` | AddCourseForm component; useState (3), controlled inputs, form submission and error handling | Entire component |

- Does it run? The intended implementation supports loading the list, adding a valid course in sorted order, displaying duplicate-code errors (409), and displaying fieldErrors for invalid input (400). Actual runtime verification is still required.
- Requests in the Network tab — on page load: **1 GET request normally (2 GET attempts in React StrictMode development)**; per add: **1 POST request**.
- `npm test` before any fix: **Not yet verified — fill in the actual passed/failed counts after running the tests.** The test files to check are `useCourses`, `CoursesPage`, `CoursesView`, and `AddCourseForm`.

## 1. Part A — walk the allowed list

| Element (the sheet, Part A) | Where it is in the AI's code (`file:line`, or "missing") | Right place? If not, where should it be? |
|---|---|---|
| One View component that only renders | `CoursesView.jsx` | Yes. It receives props and only displays the UI. |
| Fetch + logic in a separate hook or module | `useCourses.js` | Yes. GET and POST requests are handled here. |
| `useState` for the course list, at the right level | `useCourses.js` | Yes. The course list is shared between the page and View, so it belongs in the hook. |
| `useState` for the form's inputs, at the right level | `AddCourseForm.jsx` | Yes. The form manages its own input values. |
| `useEffect` — for the initial fetch only (with a cleanup) | `useCourses.js` | Yes. It loads the courses when the hook is mounted and uses cleanup to ignore outdated responses. |
| Props down, callbacks up (the form raises "add this course") | `CoursesPage.jsx`, `AddCourseForm.jsx` | Yes. The page passes `onAdd` to the form, and the form calls it on submission. |
| `.map` to render the list, with a stable `key` | `CoursesView.jsx` | Yes. It uses `courses.map()` and `key={course.id}`. |
| Loading / error / empty states, from one `status` | `useCourses.js`, `CoursesView.jsx` | Yes. The hook maintains one status, and the View displays the corresponding UI. |

## 2. Part B — scan for "not yet"

| Not yet | Found? (`file:line`) | What it does in this slice | Cut, or keep — and why |
|---|---|---|---|
| `useMemo` | No | Not used. No expensive calculation needs caching. | Keep removed. |
| `useCallback` | No | Not used. Functions do not need memoization for this feature. | Keep removed. |
| `useReducer` | No | Not used. The state is simple enough for useState. | Keep removed. |
| `useRef` | No | Not used. There is no need to access DOM elements directly. | Keep removed. |
| Context (`createContext`, `useContext`) | No | Not used. Data is passed through props. | Keep removed. |
| A data-fetching library, or `axios`, or raw `fetch` instead of `apiFetch` | No | The existing `apiFetch` client handles API requests. | Keep removed. |
| TypeScript (types, interfaces, `.ts`/`.tsx`) | No | The project uses JavaScript and JSX. | Keep removed. |
| Anything else nobody taught you (name it) | No | No additional libraries or unfamiliar hooks are required. | Nothing to remove. |

## 3. The rule — every hook and every component split

| Hook call or component (`file:line`) | What earns it here? (one sentence) | Keep / cut / move (to where) |
|---|---|---|
| `useState` — `useCourses.js` (courses) | Stores the course list received from the backend and updated after adding a course. | Keep in useCourses. |
| `useState` — `useCourses.js` (status) | Tracks whether the initial course-list request is loading, successful or failed. | Keep in useCourses. |
| `useState` — `useCourses.js` (error) | Stores the error message if the initial GET request fails. | Keep in useCourses. |
| `useEffect` — `useCourses.js` | Fetches the initial course list once and uses cleanup to prevent an outdated response from updating state. | Keep in useCourses. |
| `useCourses()` — `CoursesPage.jsx` | Connects the page to the course list and API operations. | Keep in CoursesPage. |
| `useState` — `AddCourseForm.jsx` (form) | Stores the six controlled input values entered by the user. | Keep in AddCourseForm. |
| `useState` — `AddCourseForm.jsx` (submitting) | Tracks whether the POST request is still running so the submit button can be disabled. | Keep in AddCourseForm. |
| `useState` — `AddCourseForm.jsx` (error) | Stores the last POST error so the form can display its message and fieldErrors. | Keep in AddCourseForm. |
| `CoursesPage` — `CoursesPage.jsx` | Connects the hook, View and Form to build the complete page. | Keep. |
| `CoursesView` — `CoursesView.jsx` | Displays the course list and the loading, error and empty states using props. | Keep as the only list View. |
| `AddCourseForm` — `AddCourseForm.jsx` | Collects course details and raises the add request through the onAdd callback. | Keep as a separate form component. |

## 4. Decisions — before any fix prompt

- I will **cut**:
  - Any duplicate or unused `CourseForm.jsx` if it remains from the earlier AI-generated version.
  - Any unnecessary submitting or field-error state stored in the hook.
  - Any duplicated list-rendering logic in CoursesPage.

- I will **move**:
  - Form input state, submitting state and POST error handling into `AddCourseForm.jsx`.
  - Course-list state, initial GET request and POST API operation into `useCourses.js`.
  - All course-list rendering into `CoursesView.jsx`.

- I will **add**:
  - `CoursesView.jsx` as a separate component that renders only from props.
  - Cleanup in the initial-fetch effect to prevent stale responses in StrictMode.
  - Error propagation from `addCourse()` so AddCourseForm can catch the original ApiError.
  - Accessible field errors using `aria-invalid` and `aria-describedby`.
  - A stable React key using `course.id`.

- Other smells I found:
  - The initial implementation mixed API logic and UI logic in one component.
  - The form's submitting state was initially placed in the hook instead of the form.
  - The earlier `addCourse()` implementation swallowed errors instead of rejecting them.
  - A separate GET request after adding a course would be unnecessary because the POST response already contains the created course.
  - Browser-side validation should not prevent the server from receiving the entered values.
  - The list should be updated immutably and sorted by course code.
  - The initial GET error and POST error have different responsibilities and should be handled separately.

---

## 5. Strip check (section 14 of the doc)

No "not yet" items were used in the final implementation, so there was nothing extra to remove.

| Removed | `npm test` after | The app after (loads / adds / shows errors) |
|---|---|---|
| None — no restricted hooks or libraries were used. | Not applicable; no removal was necessary. | Expected to load courses, add courses and display server errors. Runtime verification required. |

The rule that prevented these unnecessary additions was the prompt's instruction to use only `useState` and `useEffect`, and not to use `useMemo`, `useCallback`, `useReducer`, `useRef`, context or additional packages.

## 6. Before / after

| | Before (the AI's first version) | After (yours) |
|---|---|---|
| Files and components | `CoursesPage.jsx`, `useCourses.js`, `CourseForm.jsx` | `CoursesPage.jsx`, `useCourses.js`, `CoursesView.jsx`, `AddCourseForm.jsx` |
| `useState` calls (and where) | 3 in useCourses and 1 in CourseForm in the initial version. | 3 in useCourses and 3 in AddCourseForm. |
| `useEffect` calls | 1 in useCourses. | 1 in useCourses, with cleanup. |
| "Not yet" items | None. | None. |
| Requests: on load / per add | 1 GET / 1 POST. | 1 GET / 1 POST (2 GET attempts during StrictMode development). |
| `npm test` | Not verified. | Not verified; run the complete suite and record the actual results. |

## 7. Two sentences

- One thing the AI got right that you might not have thought of: Using an immutable state update with `setCourses(prev => [...prev, created].sort(...))` allows React to update the list without fetching all courses again.
- One thing you will never accept from an AI without checking again: I will always check whether state and logic are placed in the correct component or hook instead of accepting a solution just because the application appears to work.