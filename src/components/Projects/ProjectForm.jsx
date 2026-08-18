import { useState } from "react";

export default function ProjectForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [techStack, setTechStack] = useState(initial?.techStack?.join(", ") || "");
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!name.trim()) e.name = "Project name is required.";
    if (!description.trim()) e.description = "Description is required.";
    if (!techStack.trim()) e.techStack = "Technology stack is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      techStack: techStack.split(",").map((s) => s.trim()).filter(Boolean),
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="project-name" className="form-label">
          Project Name
        </label>
        <input
          id="project-name"
          type="text"
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="project-desc" className="form-label">
          Project Description
        </label>
        <textarea
          id="project-desc"
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="project-tech" className="form-label">
          Technology Stack
        </label>
        <input
          id="project-tech"
          type="text"
          className="form-input"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          placeholder="React, FastAPI, SQL Server"
        />
        <p className="form-hint">Separate technologies with commas.</p>
        {errors.techStack && <p className="form-error">{errors.techStack}</p>}
      </div>

      <div className="flex justify-end gap-1 mt-3">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Project
        </button>
      </div>
    </form>
  );
}
