import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, Pencil, Trash2, FolderKanban } from "lucide-react";
import { useData } from "../context/DataContext";
import Modal from "../components/Common/Modal";
import ConfirmDialog from "../components/Common/ConfirmDialog";
import ProjectForm from "../components/Projects/ProjectForm";
import SuccessMessage from "../components/Common/SuccessMessage";
import ErrorMessage from "../components/Common/ErrorMessage";
import EmptyState from "../components/Common/EmptyState";

export default function ProjectsPage() {
  const { projects, tasks, addProject, editProject, removeProject, loading, error } = useData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [success, setSuccess] = useState("");
  const [formError, setFormError] = useState("");

  const projectsWithStats = useMemo(() => {
    return projects.map((p) => {
      const pTasks = tasks.filter((t) => t.projectId === p.id);
      const completed = pTasks.filter((t) => t.status === "Completed").length;
      return { ...p, taskCount: pTasks.length, completed };
    });
  }, [projects, tasks]);

  function openCreate() {
    setEditing(null);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(project) {
    setEditing(project);
    setFormError("");
    setModalOpen(true);
  }

  async function handleSave(data) {
    setFormError("");
    try {
      if (editing) {
        await editProject(editing.id, data);
        setSuccess("Project updated successfully.");
      } else {
        await addProject(data);
        setSuccess("Project created successfully.");
      }
      setModalOpen(false);
    } catch {
      setFormError("Project could not be saved. Please try again.");
    }
  }

  async function handleDelete() {
    try {
      await removeProject(deleteId);
      setSuccess("Project deleted successfully.");
    } catch {
      setFormError("Project could not be deleted.");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Projects</h2>
          <p className="page-subtitle">Create and manage your software projects</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Create Project
        </button>
      </div>

      {success && <SuccessMessage message={success} onDismiss={() => setSuccess("")} />}
      {formError && <ErrorMessage message={formError} onDismiss={() => setFormError("")} />}
      {error && <ErrorMessage message={error} />}

      {loading ? (
        <p className="text-muted text-center mt-4">Loading projects...</p>
      ) : projectsWithStats.length === 0 ? (
        <EmptyState
          title="No projects yet"
          message="Create your first project to get started."
          action={
            <button className="btn btn-primary" onClick={openCreate}>
              <Plus size={16} /> Create Project
            </button>
          }
        />
      ) : (
        <div className="grid grid-auto">
          {projectsWithStats.map((p) => (
            <div key={p.id} className="card project-card">
              <div className="card-body">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted">#{p.id}</span>
                  <FolderKanban size={18} className="text-muted" />
                </div>
                <h3 className="card-title mb-1">{p.name}</h3>
                <p className="text-sm text-muted mb-2" style={{ minHeight: "2.5em" }}>
                  {p.description}
                </p>
                <div className="flex gap-1 flex-wrap mb-2">
                  {p.techStack.map((tech) => (
                    <span key={tech} className="badge badge-cyan">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted mb-2">
                  <span>{p.taskCount} tasks</span>
                  <span>{p.completed} completed</span>
                  <span>{p.createdAt}</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  <Link to={`/projects/${p.id}`} className="btn btn-secondary btn-sm">
                    <Eye size={14} /> View
                  </Link>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => openEdit(p)}
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setDeleteId(p.id)}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? "Edit Project" : "Create Project"}
        onClose={() => setModalOpen(false)}
      >
        <ProjectForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Project"
        message="This will permanently delete the project and all its tasks. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
