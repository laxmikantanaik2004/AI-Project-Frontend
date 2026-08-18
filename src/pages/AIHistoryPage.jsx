import { useMemo, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { useData } from "../context/DataContext";
import Modal from "../components/Common/Modal";
import ConfirmDialog from "../components/Common/ConfirmDialog";
import SuccessMessage from "../components/Common/SuccessMessage";
import ErrorMessage from "../components/Common/ErrorMessage";
import EmptyState from "../components/Common/EmptyState";
import { aiTaskTypes } from "../data/mockData";

export default function AIHistoryPage() {
  const { interactions, projects, removeInteraction, loading, error } = useData();

  const [viewing, setViewing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [success, setSuccess] = useState("");

  const [filterProject, setFilterProject] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const filtered = useMemo(() => {
    return interactions.filter((i) => {
      if (filterProject && i.projectId !== Number(filterProject)) return false;
      if (filterType && i.aiTaskType !== filterType) return false;
      if (filterDate && !i.createdAt.startsWith(filterDate)) return false;
      return true;
    });
  }, [interactions, filterProject, filterType, filterDate]);

  async function handleDelete() {
    try {
      await removeInteraction(deleteId);
      setSuccess("AI interaction deleted successfully.");
    } catch {
      // ignore
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">AI History</h2>
          <p className="page-subtitle">Review previous AI mentor interactions</p>
        </div>
      </div>

      {success && <SuccessMessage message={success} onDismiss={() => setSuccess("")} />}
      {error && <ErrorMessage message={error} />}

      {/* Filters */}
      <div className="card section">
        <div className="card-body filters">
          <div className="form-group">
            <label htmlFor="hist-project" className="form-label">
              Project
            </label>
            <select
              id="hist-project"
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
            <label htmlFor="hist-type" className="form-label">
              AI Task Type
            </label>
            <select
              id="hist-type"
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              {aiTaskTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="hist-date" className="form-label">
              Date
            </label>
            <input
              id="hist-date"
              type="date"
              className="form-input"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-muted text-center mt-4">Loading history...</p>
      ) : filtered.length === 0 ? (
        <EmptyState title="No AI interactions found" message="Try adjusting filters or generate a new recommendation." />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Project</th>
                <th>Prompt</th>
                <th>Response Preview</th>
                <th>Task Type</th>
                <th>Model</th>
                <th>Date</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id}>
                  <td className="text-muted">#{i.id}</td>
                  <td>{i.projectName}</td>
                  <td style={{ maxWidth: 200 }}>
                    <span className="text-sm">{i.userPrompt}</span>
                  </td>
                  <td style={{ maxWidth: 220 }}>
                    <span className="text-sm text-muted">
                      {i.response?.requirementUnderstanding?.slice(0, 80)}...
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-indigo">{i.aiTaskType}</span>
                  </td>
                  <td className="text-muted text-xs">{i.modelName}</td>
                  <td className="text-muted text-xs">{i.createdAt}</td>
                  <td className="col-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setViewing(i)}
                    >
                      <Eye size={14} /> View
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteId(i.id)}
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

      {/* View modal */}
      <Modal
        open={!!viewing}
        title="AI Interaction"
        onClose={() => setViewing(null)}
        maxWidth={640}
      >
        {viewing && (
          <div>
            <div className="form-group">
              <span className="form-label">Project</span>
              <p>{viewing.projectName}</p>
            </div>
            <div className="form-group">
              <span className="form-label">Prompt</span>
              <p className="text-sm">{viewing.userPrompt}</p>
            </div>
            <div className="form-group">
              <span className="form-label">Task Type</span>
              <p>
                <span className="badge badge-indigo">{viewing.aiTaskType}</span>
              </p>
            </div>
            <div className="form-group">
              <span className="form-label">Model</span>
              <p className="text-sm text-muted">{viewing.modelName}</p>
            </div>
            {viewing.response && (
              <>
                <div className="ai-section">
                  <div className="ai-section-title">Requirement Understanding</div>
                  <p className="text-sm">{viewing.response.requirementUnderstanding}</p>
                </div>
                {[
                  { label: "Frontend Tasks", items: viewing.response.frontendTasks },
                  { label: "Backend Tasks", items: viewing.response.backendTasks },
                  { label: "Database Tasks", items: viewing.response.databaseTasks },
                  { label: "Testing Steps", items: viewing.response.testingSteps },
                  { label: "Possible Blockers", items: viewing.response.possibleBlockers },
                ].map(
                  (s) =>
                    s.items && (
                      <div className="ai-section" key={s.label}>
                        <div className="ai-section-title">{s.label}</div>
                        <ul>
                          {s.items.map((item, i) => (
                            <li key={i} className="text-sm">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                )}
                <div className="ai-section">
                  <div className="ai-section-title">Recommended Next Action</div>
                  <p className="text-sm">{viewing.response.recommendedNextAction}</p>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete History"
        message="This will permanently delete the AI interaction. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
