import { useState } from "react";
import { Bot, Sparkles, Save, PlusCircle, Trash2, FileText } from "lucide-react";
import { useData } from "../context/DataContext";
import { aiTaskTypes } from "../data/mockData";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import SuccessMessage from "../components/Common/SuccessMessage";
import ErrorMessage from "../components/Common/ErrorMessage";
import EmptyState from "../components/Common/EmptyState";

export default function AIMentorPage() {
  const { projects, generateAI, saveInteraction, addTask } = useData();

  const [projectId, setProjectId] = useState("");
  const [requirement, setRequirement] = useState("");
  const [aiTaskType, setAiTaskType] = useState(aiTaskTypes[0]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleGenerate(ev) {
    ev.preventDefault();
    setError("");
    setSuccess("");
    if (!projectId) {
      setError("Please select a project.");
      return;
    }
    if (!requirement.trim()) {
      setError("Please enter a requirement or question.");
      return;
    }
    setLoading(true);
    setResponse(null);
    try {
      const result = await generateAI({
        projectId: Number(projectId),
        projectName: projects.find((p) => p.id === Number(projectId))?.name || "",
        requirement: requirement.trim(),
        aiTaskType,
      });
      setResponse(result);
    } catch {
      setError("AI Mentor is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!response) return;
    try {
      await saveInteraction({
        projectId: Number(projectId),
        projectName: projects.find((p) => p.id === Number(projectId))?.name || "",
        userPrompt: requirement,
        aiTaskType,
        response,
      });
      setSuccess("Recommendation saved to AI History.");
    } catch {
      setError("Could not save the recommendation.");
    }
  }

  async function handleCreateTasks() {
    if (!response) return;
    try {
      const allTasks = [
        ...response.frontendTasks.map((t) => ({ title: t, description: "Frontend task from AI recommendation.", category: "Frontend" })),
        ...response.backendTasks.map((t) => ({ title: t, description: "Backend task from AI recommendation.", category: "Backend" })),
        ...response.databaseTasks.map((t) => ({ title: t, description: "Database task from AI recommendation.", category: "Database" })),
      ];
      for (const t of allTasks) {
        await addTask({
          projectId: Number(projectId),
          title: t.title,
          description: t.description,
          priority: "Medium",
          status: "Pending",
          aiGenerated: true,
        });
      }
      setSuccess(`${allTasks.length} tasks created from the recommendation.`);
    } catch {
      setError("Could not create tasks from the recommendation.");
    }
  }

  function handleClear() {
    setResponse(null);
    setRequirement("");
    setProjectId("");
    setAiTaskType(aiTaskTypes[0]);
    setSuccess("");
    setError("");
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">AI Mentor</h2>
          <p className="page-subtitle">
            Ask the AI mentor to break requirements into development tasks
          </p>
        </div>
      </div>

      {success && <SuccessMessage message={success} onDismiss={() => setSuccess("")} />}
      {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}

      <div className="grid grid-2 section">
        {/* Form */}
        <div className="card">
          <div className="card-header">
            <span className="card-title flex items-center gap-1">
              <Bot size={18} className="text-indigo-600" /> Request
            </span>
          </div>
          <div className="card-body">
            <form onSubmit={handleGenerate}>
              <div className="form-group">
                <label htmlFor="ai-project" className="form-label">
                  Select Project
                </label>
                <select
                  id="ai-project"
                  className="form-select"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                >
                  <option value="">Choose a project...</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="ai-requirement" className="form-label">
                  Requirement or Question
                </label>
                <textarea
                  id="ai-requirement"
                  className="form-textarea"
                  rows={4}
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="Describe the feature or question you want the AI mentor to analyse..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="ai-task-type" className="form-label">
                  AI Task Type
                </label>
                <select
                  id="ai-task-type"
                  className="form-select"
                  value={aiTaskType}
                  onChange={(e) => setAiTaskType(e.target.value)}
                >
                  {aiTaskTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                <Sparkles size={16} /> Generate AI Recommendation
              </button>
            </form>
          </div>
        </div>

        {/* Response */}
        <div className="card">
          <div className="card-header">
            <span className="card-title flex items-center gap-1">
              <FileText size={18} className="text-cyan-600" /> AI Response
            </span>
            {response && (
              <div className="flex gap-1">
                <button className="btn btn-secondary btn-sm" onClick={handleSave}>
                  <Save size={14} /> Save
                </button>
                <button className="btn btn-secondary btn-sm" onClick={handleCreateTasks}>
                  <PlusCircle size={14} /> Create Tasks
                </button>
                <button className="btn btn-ghost btn-sm" onClick={handleClear}>
                  <Trash2 size={14} /> Clear
                </button>
              </div>
            )}
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center mt-4 mb-4">
                <LoadingSpinner size="lg" />
                <p className="text-muted mt-2">AI Mentor is analysing your project...</p>
              </div>
            ) : response ? (
              <AIResponse response={response} />
            ) : (
              <EmptyState
                title="No response yet"
                message="Fill in the form and generate a recommendation."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AIResponse({ response }) {
  const sections = [
    { key: "requirementUnderstanding", label: "Requirement Understanding", type: "text" },
    { key: "frontendTasks", label: "Frontend Tasks", type: "list" },
    { key: "backendTasks", label: "Backend Tasks", type: "list" },
    { key: "databaseTasks", label: "Database Tasks", type: "list" },
    { key: "testingSteps", label: "Testing Steps", type: "list" },
    { key: "possibleBlockers", label: "Possible Blockers", type: "list" },
    { key: "recommendedNextAction", label: "Recommended Next Action", type: "text" },
  ];

  const hasSections = sections.some((section) => response[section.key]);

  if (!hasSections && response.responseText) {
    return <pre className="text-sm" style={{ whiteSpace: "pre-wrap" }}>{response.responseText}</pre>;
  }

  return (
    <div>
      {sections.map((s) => {
        const content = response[s.key];
        if (!content) return null;
        return (
          <div className="ai-section" key={s.key}>
            <div className="ai-section-title">
              <Sparkles size={14} /> {s.label}
            </div>
            {s.type === "text" ? (
              <p className="text-sm">{content}</p>
            ) : (
              <ul>
                {content.map((item, i) => (
                  <li key={i} className="text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
