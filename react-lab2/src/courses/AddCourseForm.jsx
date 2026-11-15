
import { useState } from "react";

export function AddCourseForm({ onAdd }) {
  const [form, setForm] = useState({
    code: "",
    title: "",
    department: "",
    credits: "",
    capacity: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
  event.preventDefault();

  setSubmitting(true);
  setError(null);

  try {
    await onAdd({
      code: form.code,
      title: form.title,
      department: form.department,
      credits: Number(form.credits),
      capacity: Number(form.capacity),
      description: form.description === ""
        ? null
        : form.description,
    });

    setForm({
      code: "",
      title: "",
      department: "",
      credits: "",
      capacity: "",
      description: "",
    });
  } catch (err) {
    setError(err);
  } finally {
    setSubmitting(false);
  }
}

  const fieldErrors = error?.fieldErrors || {};

  function renderFieldError(field) {
    if (!fieldErrors[field]) {
      return null;
    }

    return (
      <p id={`${field}-error`}>
        {fieldErrors[field]}
      </p>
    );
  }

  return (
    <section>
      <h2>Add a course</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="code">Code</label>
          <input
            id="code"
            name="code"
            value={form.code}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.code)}
            aria-describedby={
              fieldErrors.code ? "code-error" : undefined
            }
          />
          {renderFieldError("code")}
        </div>

        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={
              fieldErrors.title ? "title-error" : undefined
            }
          />
          {renderFieldError("title")}
        </div>

        <div>
          <label htmlFor="department">Department</label>
          <input
            id="department"
            name="department"
            value={form.department}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.department)}
            aria-describedby={
              fieldErrors.department ? "department-error" : undefined
            }
          />
          {renderFieldError("department")}
        </div>

        <div>
          <label htmlFor="credits">Credits</label>
          <input
            id="credits"
            name="credits"
            type="number"
            value={form.credits}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.credits)}
            aria-describedby={
              fieldErrors.credits ? "credits-error" : undefined
            }
          />
          {renderFieldError("credits")}
        </div>

        <div>
          <label htmlFor="capacity">Capacity</label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            value={form.capacity}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.capacity)}
            aria-describedby={
              fieldErrors.capacity ? "capacity-error" : undefined
            }
          />
          {renderFieldError("capacity")}
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.description)}
            aria-describedby={
              fieldErrors.description
                ? "description-error"
                : undefined
            }
          />
          {renderFieldError("description")}
        </div>

        {error && (
          <p role="alert">{error.message}</p>
        )}

        <button type="submit" disabled={submitting}>
          Add course
        </button>
      </form>
    </section>
  );
}
