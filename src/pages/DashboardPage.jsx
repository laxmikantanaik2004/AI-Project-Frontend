import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  ListTodo,
  Clock,
  Loader2,
  CheckCircle2,
  Bot,
  ArrowRight,
} from "lucide-react";
import { useData } from "../context/DataContext";
import StatCard from "../components/Dashboard/StatCard";
import { StatusBadge, PriorityBadge } from "../components/Common/Badges";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import ErrorMessage from "../components/Common/ErrorMessage";
import EmptyState from "../components/Common/EmptyState";

export default function DashboardPage() {
  const { projects, tasks, loading, error } = useData();

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const pending = tasks.filter((t) => t.status === "Pending").length;
    return {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      pending,
      inProgress,
      completed,
    };
  }, [projects, tasks]);

  const projectProgress = useMemo(() => {
    return projects.map((p) => {
      const pTasks = tasks.filter((t) => t.projectId === p.id);
      const done = pTasks.filter((t) => t.status === "Completed").length;
      const pct = pTasks.length ? Math.round((done / pTasks.length) * 100) : 0;
      return { ...p, taskCount: pTasks.length, completed: done, pct };
    });
  }, [projects, tasks]);

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      .slice(0, 5);
  }, [tasks]);

  const aiRecommendation = useMemo(() => {
    // Pick the project with the most pending tasks as a mock recommendation.
    const candidate = projectProgress
      .map((p) => ({
        ...p,
        pending: tasks.filter((t) => t.projectId === p.id && t.status === "Pending").length,
      }))
      .sort((a, b) => b.pending - a.pending)[0];
    if (!candidate) return null;
    const nextPending = tasks.find(
      (t) => t.projectId === candidate.id && t.status === "Pending"
    );
    return {
      project: candidate,
      task: nextPending?.title || "Review project plan",
      reason: nextPending
        ? `This project has ${candidate.pending} pending task(s). Starting "${nextPending.title}" would unblock other work.`
        : "No pending tasks remain; review the project plan for the next phase.",
    };
  }, [projectProgress, tasks]);

  if (loading) {
    return (
      <div className="text-center mt-6">
        <LoadingSpinner size="lg" label="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      {/* Stat cards */}
      <div className="grid grid-stats section">
        <StatCard label="Total Projects" value={stats.totalProjects} icon={FolderKanban} tone="primary" />
        <StatCard label="Total Tasks" value={stats.totalTasks} icon={ListTodo} tone="indigo" />
        <StatCard label="Pending Tasks" value={stats.pending} icon={Clock} tone="warning" />
        <StatCard label="In Progress" value={stats.inProgress} icon={Loader2} tone="cyan" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="success" />
      </div>

      {/* Project progress */}
      <section className="section">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Project Progress</span>
            <Link to="/projects" className="btn btn-ghost btn-sm">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="card-body">
            {projectProgress.length === 0 ? (
              <EmptyState title="No projects yet" message="Create a project to see progress here." />
            ) : (
              <div className="grid grid-2">
                {projectProgress.map((p) => (
                  <Link
                    to={`/projects/${p.id}`}
                    key={p.id}
                    className="progress-row"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium" style={{ color: "var(--neutral-800)" }}>
                        {p.name}
                      </span>
                      <span className="text-xs text-muted">
                        {p.completed}/{p.taskCount} tasks
                      </span>
                    </div>
                    <div className="flex gap-1 mb-1 flex-wrap">
                      {p.techStack.map((tech) => (
                        <span key={tech} className="badge badge-neutral">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="progress">
                      <div className="progress-bar" style={{ width: `${p.pct}%` }} />
                    </div>
                    <span className="text-xs text-muted mt-1">{p.pct}% complete</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent tasks */}
      <section className="section">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Tasks</span>
            <Link to="/tasks" className="btn btn-ghost btn-sm">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="card-body">
            {recentTasks.length === 0 ? (
              <EmptyState title="No tasks yet" message="Add tasks to track your work." />
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Project</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTasks.map((t) => {
                      const project = projects.find((p) => p.id === t.projectId);
                      return (
                        <tr key={t.id}>
                          <td>{t.title}</td>
                          <td>{project?.name || "—"}</td>
                          <td><PriorityBadge priority={t.priority} /></td>
                          <td><StatusBadge status={t.status} /></td>
                          <td className="text-muted text-xs">{t.updatedAt}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AI recommended next task */}
      <section className="section">
        <div className="card">
          <div className="card-header">
            <span className="card-title flex items-center gap-1">
              <Bot size={18} className="text-indigo-600" /> AI Recommended Next Task
            </span>
          </div>
          <div className="card-body">
            {aiRecommendation ? (
              <div className="ai-recommendation">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs text-muted">Project</span>
                    <p className="font-medium" style={{ color: "var(--neutral-800)" }}>
                      {aiRecommendation.project.name}
                    </p>
                  </div>
                  <Link
                    to="/ai-mentor"
                    className="btn btn-primary btn-sm"
                  >
                    View Recommendation <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-muted">Recommended task</span>
                  <p className="font-medium">{aiRecommendation.task}</p>
                </div>
                <p className="text-sm text-muted mt-2">{aiRecommendation.reason}</p>
              </div>
            ) : (
              <EmptyState title="No recommendation available" message="Create projects and tasks to get AI suggestions." />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
