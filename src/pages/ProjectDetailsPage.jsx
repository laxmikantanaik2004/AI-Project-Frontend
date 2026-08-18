import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Bot,
  Calendar,
  CheckCircle2,
  ListTodo,
} from "lucide-react";
import { useData } from "../context/DataContext";
import Modal from "../components/Common/Modal";
import ProjectForm from "../components/Projects/ProjectForm";
import TaskForm from "../components/Tasks/TaskForm";
import ConfirmDialog from "../components/Common/ConfirmDialog";
import { PriorityBadge } from "../components/Common/Badges";
import SuccessMessage from "../components/Common/SuccessMessage";
import ErrorMessage from "../components/Common/ErrorMessage";
import EmptyState from "../components/Common/EmptyState";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const {
    projects,
    tasks,
    editProject,
    addTask,
    editTask,
    removeTask,
    changeTaskStatus,
  } = useData();

  const project = useMemo(
    () => projects.find((p) => p.id === Number(id)),
    [projects, id]
  );

  const projectTasks = useMemo(
    () => tasks.filter((t) => t.projectId === Number(id)),
    [tasks, id]
  );

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const completed = projectTasks.filter((t) => t.status === "Completed").length;
  const pct = projectTasks.length
    ? Math.round((completed / projectTasks.length) * 100)
    : 0;

  if (!project) {
    return (
      <div>
        <ErrorMessage message="Project could not be found." />
        <Link to="/projects" className="btn btn-secondary mt-3">
          <ArrowLeft size={16} /> Back to Projects
        </Link>
      </div>
    );
  }

  async function handleEditProject(data) {
    try {
      await editProject(project.id, data);
      setSuccess("Project updated successfully.");
      setEditModalOpen(false);
    } catch {
      setError("Project could not be saved.");
    }
  }

  async function handleSaveTask(data) {
    try {
      if (editingTask) {
        await editTask(editingTask.id, data);
        setSuccess("Task updated successfully.");
      } else {
        await addTask({ ...data, projectId: project.id });
        setSuccess("Task created successfully.");
      }
      setTaskModalOpen(false);
      setEditingTask(null);
    } catch {
      setError("Task could not be saved.");
    }
  }

  async function handleDeleteTask() {
    try {
      await removeTask(deleteTaskId);
      setSuccess("Task deleted successfully.");
    } catch {
      setError("Task could not be deleted.");
    } finally {
      setDeleteTaskId(null);
    }
  }

  function openCreateTask() {
    setEditingTask(null);
    setTaskModalOpen(true);
  }

  function openEditTask(task) {
    setEditingTask(task);
    setTaskModalOpen(true);
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Link to="/projects" className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} /> Projects
        </Link>
      </div>

      {success && <SuccessMessage message={success} onDismiss={() => setSuccess("")} />}
      {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}

      <div className="card section">
        <div className="card-body">
          <div className="flex justify-between flex-wrap gap-2">
            <div>
              <h2 className="page-title">{project.name}</h2>
              <p className="text-muted mt-1">{project.description}</p>
            </div>
            <div className="flex gap-1 flex-wrap">
              <button className="btn btn-primary" onClick={openCreateTask}>
                <Plus size={16} /> Add Task
              </button>
              <button className="btn btn-secondary" onClick={() => setEditModalOpen(true)}>
                <Pencil size={16} /> Edit Project
              </button>
              <Link to="/ai-mentor" className="btn btn-secondary">
                <Bot size={16} /> Ask AI Mentor
              </Link>
              <Link to="/projects" className="btn btn-ghost">
                <ArrowLeft size={16} /> Return
              </Link>
            </div>
          </div>

          <div className="grid grid-3 mt-3">
            <div className="flex items-center gap-1">
              <Calendar size={16} className="text-muted" />
              <span className="text-sm text-muted">Created {project.createdAt}</span>
            </div>
            <div className="flex items-center gap-1">
              <ListTodo size={16} className="text-muted" />
              <span className="text-sm">{projectTasks.length} total tasks</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 size={16} className="text-muted" />
              <span className="text-sm">{completed} completed</span>
            </div>
          </div>

          <div className="flex gap-1 flex-wrap mt-2">
            {project.techStack.map((tech) => (
              <span key={tech} className="badge badge-cyan">
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted">Overall progress</span>
              <span className="font-medium">{pct}%</span>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      <section>
        <h3 className="section-title">Tasks</h3>
        {projectTasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            message="Add a task to start tracking work on this project."
            action={
              <button className="btn btn-primary" onClick={openCreateTask}>
                <Plus size={16} /> Add Task
              </button>
            }
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>AI</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projectTasks.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span className="font-medium">{t.title}</span>
                      <br />
                      <span className="text-xs text-muted">{t.description}</span>
                    </td>
                    <td><PriorityBadge priority={t.priority} /></td>
                    <td>
                      <select
                        className="form-select"
                        style={{ width: "auto", minWidth: 130 }}
                        value={t.status}
                        onChange={(e) => changeTaskStatus(t.id, e.target.value)}
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
                    <td className="col-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditTask(t)}
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteTaskId(t.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        open={editModalOpen}
        title="Edit Project"
        onClose={() => setEditModalOpen(false)}
      >
        <ProjectForm
          initial={project}
          onSave={handleEditProject}
          onCancel={() => setEditModalOpen(false)}
        />
      </Modal>

      <Modal
        open={taskModalOpen}
        title={editingTask ? "Edit Task" : "Add Task"}
        onClose={() => { setTaskModalOpen(false); setEditingTask(null); }}
      >
        <TaskForm
          initial={editingTask}
          projects={projects}
          fixedProjectId={project.id}
          onSave={handleSaveTask}
          onCancel={() => { setTaskModalOpen(false); setEditingTask(null); }}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTaskId}
        title="Delete Task"
        message="This will permanently delete the task. This cannot be undone."
        onConfirm={handleDeleteTask}
        onCancel={() => setDeleteTaskId(null)}
      />
    </div>
  );
}
