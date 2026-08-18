import { useState } from "react";
import { priorityOptions, statusOptions } from "../../data/mockData";

export default function TaskForm({
  initial,
  projects,
  fixedProjectId,
  onSave,
  onCancel,
}) {
  const [projectId, setProjectId] = useState(
    fixedProjectId || initial?.projectId || ""
  );
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [priority, setPriority] = useState(initial?.priority || "Medium");
  const [status, setStatus] = useState(initial?.status || "Pending");
  const [aiGenerated, setAiGenerated] = useState(initial?.aiGenerated || false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!projectId) e.projectId = "Please select a project.";
    if (!title.trim()) e.title = "Task title is required.";
    if (!description.trim()) e.description = "Description is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    onSave({
      projectId: Number(projectId),
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      aiGenerated,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="task-project" className="form-label">
          Select Project
        </label>
        <select
          id="task-project"
          className="form-select"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          disabled={!!fixedProjectId}
        >
          <option value="">Choose a project...</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {errors.projectId && <p className="form-error">{errors.projectId}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="task-title" className="form-label">
          Task Title
        </label>
        <input
          id="task-title"
          type="text"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        {errors.title && <p className="form-error">{errors.title}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="task-desc" className="form-label">
          Task Description
        </label>
        <textarea
          id="task-desc"
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>

      <div className="grid grid-2">
        <div className="form-group">
          <label htmlFor="task-priority" className="form-label">
            Priority
          </label>
          <select
            id="task-priority"
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {priorityOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="task-status" className="form-label">
            Status
          </label>
          <select
            id="task-status"
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-check">
          <input
            type="checkbox"
            className="checkbox"
            checked={aiGenerated}
            onChange={(e) => setAiGenerated(e.target.checked)}
          />
          <span className="form-label" style={{ marginBottom: 0 }}>
            AI Generated
          </span>
        </label>
      </div>

      <div className="flex justify-end gap-1 mt-3">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Task
        </button>
      </div>
    </form>
  );
}
