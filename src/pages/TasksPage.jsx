import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useData } from "../context/DataContext";
import Modal from "../components/Common/Modal";
import ConfirmDialog from "../components/Common/ConfirmDialog";
import TaskForm from "../components/Tasks/TaskForm";
import { PriorityBadge } from "../components/Common/Badges";
import SuccessMessage from "../components/Common/SuccessMessage";
import ErrorMessage from "../components/Common/ErrorMessage";
import EmptyState from "../components/Common/EmptyState";

export default function TasksPage() {
  const { tasks, projects, addTask, editTask, removeTask, changeTaskStatus, loading, error } =
    useData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [success, setSuccess] = useState("");
  const [formError, setFormError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [filterProject, setFilterProject] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filterProject && t.projectId !== Number(filterProject)) return false;
      if (filterPriority && t.priority !== filterPriority) return false;
      if (filterStatus && t.status !== filterStatus) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tasks, filterProject, filterPriority, filterStatus, search]);

  function openCreate() {
    setEditing(null);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(task) {
    setEditing(task);
    setFormError("");
    setModalOpen(true);
  }

  async function handleSave(data) {
    setFormError("");
    try {
      if (editing) {
        await editTask(editing.id, data);
        setSuccess("Task updated successfully.");
      } else {
        await addTask(data);
        setSuccess("Task created successfully.");
      }
      setModalOpen(false);
    } catch {
      setFormError("Task could not be saved. Please try again.");
    }
  }

  async function handleDelete() {
    try {
      await removeTask(deleteId);
      setSuccess("Task deleted successfully.");
    } catch {
      setFormError("Task could not be deleted.");
    } finally {
      setDeleteId(null);
    }
  }

  function projectName(id) {
    return projects.find((p) => p.id === id)?.name || "—";
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Tasks</h2>
          <p className="page-subtitle">Track and update development tasks</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Task
        </button>
      </div>

      {success && <SuccessMessage message={success} onDismiss={() => setSuccess("")} />}
      {formError && <ErrorMessage message={formError} onDismiss={() => setFormError("")} />}
      {error && <ErrorMessage message={error} />}

      {/* Filters */}
      <div className="card section">
        <div className="card-body filters">
          <div className="form-group">
            <label htmlFor="filter-search" className="form-label">
              Search
            </label>
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "0.6rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-subtle)",
                }}
              />
              <input
                id="filter-search"
                type="search"
                className="form-input"
                style={{ paddingLeft: "2rem" }}
                placeholder="Search task titles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="filter-project" className="form-label">
              Project
            </label>
            <select
              id="filter-project"
              className="form-select"
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="filter-priority" className="form-label">
              Priority
            </label>
            <select
              id="filter-priority"
              className="form-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="filter-status" className="form-label">
              Status
            </label>
            <select
              id="filter-status"
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-muted text-center mt-4">Loading tasks...</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No tasks found"
          message="Try adjusting your filters or add a new task."
          action={
            <button className="btn btn-primary" onClick={openCreate}>
              <Plus size={16} /> Add Task
            </button>
          }
        />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Status</th>
                <th>AI</th>
                <th>Updated</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className="text-muted">#{t.id}</td>
                  <td>
                    <span className="font-medium">{t.title}</span>
                    <br />
                    <span className="text-xs text-muted">{t.description}</span>
                  </td>
                  <td>{projectName(t.projectId)}</td>
                  <td><PriorityBadge priority={t.priority} /></td>
                  <td>
                    <select
                      className="form-select"
                      style={{ width: "auto", minWidth: 130 }}
                      value={t.status}
                      onChange={(e) => changeTaskStatus(t.id, e.target.value)}
                      aria-label={`Change status for ${t.title}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    {t.aiGenerated ? (
                      <span className="badge badge-indigo">AI</span>
                    ) : (
                      <span className="text-muted text-xs">—</span>
                    )}
                  </td>
                  <td className="text-muted text-xs">{t.updatedAt}</td>
                  <td className="col-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEdit(t)}
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteId(t.id)}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? "Edit Task" : "Add Task"}
        onClose={() => setModalOpen(false)}
      >
        <TaskForm
          initial={editing}
          projects={projects}
          onSave={handleSave}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Task"
        message="This will permanently delete the task. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
