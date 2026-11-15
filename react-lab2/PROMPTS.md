# Prompt log — React Lab 2

- Name: Prashant Vishwakarma
- Roll number: [Enter your roll number]
- AI tool and plan: ChatGPT (Free)

---

## Prompt 1 — generate

**Sent:**

```text
CONTRACT.md prompt 1, unchanged
```

**What came back:**

The AI initially generated three files:

- `CoursesPage.jsx` — page component.
- `useCourses.js` — custom hook for API requests and course state.
- `CourseForm.jsx` — form component.

It used `useState` and `useEffect`. It did not use anything from the "not yet" list.

However, some responsibilities were not placed exactly as required. The form was named `CourseForm` instead of `AddCourseForm`, and submitting/error state was initially managed in the hook rather than entirely inside the form.

**Did it run?**

- `npm run dev`: Implementation was generated, but complete runtime verification was not recorded.
- List loads: Intended to work.
- Add works: Intended to work.
- 409 shown: Required error-handling correction.
- FieldErrors shown: Required correction.
- `npm test`: Actual passed/failed count not recorded.

**What I did with it:**

I reviewed the generated files and compared them with the lab contract. I identified that the form needed its own state and that the View needed to be separated from the page. I asked the AI to make these changes instead of accepting the initial implementation.

---

## Prompt 2 — generate the missing AddCourseForm

**Why I sent it:**

The initial AI response generated `CourseForm.jsx` instead of the required `AddCourseForm.jsx`. The form also needed to manage its own input values, submitting state and errors.

**Sent:**

```text
This file is not generated

src/courses/AddCourseForm.jsx — the form: raises "add this course"

export function AddCourseForm({ onAdd })

- Its own state: the six input values (controlled inputs, one <label> each: Code, Title, Department, Credits, Capacity, Description — a textarea), whether it is submitting, and the last error.
- On submit: preventDefault(), then await onAdd({ code, title, department, credits: Number(…), capacity: Number(…), description }) with description = the text, or null when empty. The "Add course" button is disabled while waiting.
- Success → clear the form and the error. Failure → keep what was typed; show error.message above the button, and each error.fieldErrors entry directly under its own input (not inside the <label>).
- Errors a screen reader can find: an input with a fieldErrors entry has aria-invalid="true" and aria-describedby set to its message's id; the message above the button has role="alert".
- Never calls apiFetch or fetch itself.
```

**What came back:**

The AI generated `AddCourseForm.jsx` with:

- Six controlled inputs.
- `useState` for form values, submitting and error.
- `handleChange()` to update the input values.
- `handleSubmit()` to call `onAdd`.
- Number conversion for credits and capacity.
- Null description when empty.
- Error display and accessible field errors.

It also explained that `CoursesPage.jsx` needed to import and render `AddCourseForm`.

**What I kept, and what I rejected:**

I kept the separate form component, controlled inputs, error handling and state management. I also kept the approach of letting the form call `onAdd` rather than making API requests directly.

---

## Prompt 3 — correct useCourses according to its tests

**Why I sent it:**

I wanted the hook to satisfy its independent tests. In particular, it needed to return the correct status, handle React StrictMode cleanup, insert the course without reloading the list, and reject with the original ApiError.

**Sent:**

I pasted the complete `useCourses.js` Vitest test file from the lab, covering:

- Initial loading and successful GET.
- Fetching only once after normal mounting and rerendering.
- HTTP errors and network errors.
- React StrictMode cleanup and stale responses.
- Successful POST and sorted insertion.
- Immutable state updates.
- No additional GET after adding.
- Rejection with ApiError for 409 and 400 responses.

**What came back:**

The AI updated `useCourses.js` to:

- Use `status` with `"loading"`, `"ready"` and `"error"`.
- Use `useState` for courses, status and error.
- Use `useEffect` for the initial GET request.
- Add cleanup using an `active` variable to ignore stale responses.
- Implement `addCourse()` using `apiFetch`.
- Insert the returned course into the existing list in sorted order.
- Return the created course.
- Allow POST errors to propagate instead of swallowing them.

**What I kept, and what I rejected:**

I kept the status-based approach, cleanup function and immutable list update. I kept error propagation because the form needs to catch the original ApiError and display its message and fieldErrors.

---

## Prompt 4 — correct CoursesPage according to its tests

**Why I sent it:**

The complete page needed to work with the updated hook and form. I wanted to verify loading, successful additions, duplicate codes and validation errors together.

**Sent:**

I pasted the complete `CoursesPage.jsx` Vitest test file from the lab, covering:

- Courses heading and initial loading message.
- Displaying the 20 seeded courses.
- Adding a valid course in sorted order.
- Clearing the form after successful addition.
- Showing the 409 duplicate-code message.
- Retaining form values after failure.
- Showing the 400 validation message and field-specific errors.

My instruction was:

```text
AFter updating the code this test case is failing please update appropriately
```

**What came back:**

The AI updated `CoursesPage.jsx` to:

- Read `courses`, `status`, `error` and `addCourse` from `useCourses`.
- Display the loading, error and empty states.
- Render the course list.
- Display the AddCourseForm component.
- Pass `addCourse` to the form through the `onAdd` prop.

It also explained that POST errors should be handled by the form, not by the page.

**What I kept, and what I rejected:**

I kept the separation between the page, hook and form. I also kept the idea of passing the callback through props instead of directly connecting the form to the API.

---

## Prompt 5 — generate the missing CoursesView

**Why I sent it:**

The lab required a separate View component that only renders from props. The previous implementation still had the course-list rendering inside `CoursesPage.jsx`.

**Sent:**

I pasted the `CoursesView.jsx` starter file and its complete Vitest test file, covering:

- Loading state.
- Error state.
- Empty state.
- Course list rendering.
- Full courses and one seat left.
- Preserving the order received through props.
- Stable React keys.
- Ensuring the View never makes API requests.

My instruction was:

```text
fill the course view
```

**What came back:**

The AI generated `CoursesView.jsx` with:

- `CoursesView({ courses, status, error })`.
- Conditional rendering based on status.
- An unordered list using `courses.map()`.
- `key={course.id}` for every list item.
- Correct seat-count display.
- No API requests or state management.

It also updated `CoursesPage.jsx` to render the View and pass the required props.

**What I kept, and what I rejected:**

I kept the separate View component and the props-based approach. I kept sorting inside the hook rather than adding sorting logic to the View because the View should display courses in the order it receives them.

---

## Afterwards

- How many prompts did the whole feature take?

  **5 main implementation prompts**, including the initial generation prompt and four follow-up prompts to correct and complete the individual parts.

- Which of your prompts would you write differently now, and how?

  Initially, I provided the main contract and expected the AI to generate the complete feature correctly. Now I would explicitly mention the responsibility of each component and provide the relevant test cases along with the contract. This would reduce incorrect component names and misplaced state.

- One thing the rules in prompt 1 prevented (or failed to prevent):

  The rules prevented the AI from introducing unnecessary libraries, TypeScript, context and advanced hooks such as useMemo and useReducer. However, they did not automatically guarantee that every component was separated correctly. I still had to review the generated code and use the tests to identify missing responsibilities.