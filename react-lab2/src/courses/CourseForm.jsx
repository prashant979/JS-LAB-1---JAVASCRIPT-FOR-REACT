
import { useState } from "react";

export function CourseForm({
  onAdd,
  submitting,
  submitError,
  fieldErrors,
}) {
  const [form, setForm] = useState({
    code: "",
    title: "",
    department: "",
    credits: "",
    capacity: "",
    description: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const courseRequest = {
      ...form,
      credits: Number(form.credits),
      capacity: Number(form.capacity),
      description: form.description === ""
        ? null
        : form.description,
    };

    const success = await onAdd(courseRequest);

    if (success) {
      setForm({
        code: "",
        title: "",
        department: "",
        credits: "",
        capacity: "",
        description: "",
      });
    }
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
          />
          {fieldErrors.code && <p>{fieldErrors.code}</p>}
        </div>

        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
          {fieldErrors.title && <p>{fieldErrors.title}</p>}
        </div>

        <div>
          <label htmlFor="department">Department</label>
          <input
            id="department"
            name="department"
            value={form.department}
            onChange={handleChange}
          />
          {fieldErrors.department && <p>{fieldErrors.department}</p>}
        </div>

        <div>
          <label htmlFor="credits">Credits</label>
          <input
            id="credits"
            name="credits"
            type="number"
            value={form.credits}
            onChange={handleChange}
          />
          {fieldErrors.credits && <p>{fieldErrors.credits}</p>}
        </div>

        <div>
          <label htmlFor="capacity">Capacity</label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            value={form.capacity}
            onChange={handleChange}
          />
          {fieldErrors.capacity && <p>{fieldErrors.capacity}</p>}
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          {fieldErrors.description && (
            <p>{fieldErrors.description}</p>
          )}
        </div>

        {submitError && <p>{submitError}</p>}

        <button type="submit" disabled={submitting}>
          Add course
        </button>
      </form>
    </section>
  );
}
