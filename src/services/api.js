import axios from "axios";
import {
  mockProjects,
  mockTasks,
  mockAIInteractions,
} from "../data/mockData";

// Base configuration for the future FastAPI backend.
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// When true the app uses mock data; when false it calls the real backend.
const useMock =
  String(import.meta.env.VITE_USE_MOCK_DATA ?? "false").toLowerCase() === "true";

const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Helper to simulate network latency for mock responses.
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

// In-memory stores so mock CRUD stays consistent during a session.
let projects = [...mockProjects];
let tasks = [...mockTasks];
let interactions = [...mockAIInteractions];

const nextId = (list) => (list.length ? Math.max(...list.map((x) => x.id)) + 1 : 1);

function mapProject(project) {
  return {
    id: project.project_id,
    name: project.project_name,
    description: project.description,
    techStack: project.technology_stack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    createdAt: project.created_at,
  };
}

function toProjectRequest(project) {
  return {
    project_name: project.name,
    description: project.description,
    technology_stack: Array.isArray(project.techStack)
      ? project.techStack.join(", ")
      : project.techStack,
  };
}

function mapTask(task) {
  return {
    id: task.task_id,
    projectId: task.project_id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    aiGenerated: task.ai_generated,
    createdAt: task.created_at,
    updatedAt: task.updated_at,
  };
}

function toTaskRequest(task) {
  return {
    project_id: Number(task.projectId),
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    ai_generated: task.aiGenerated,
  };
}

function mapInteraction(interaction) {
  return {
    id: interaction.interaction_id,
    projectId: interaction.project_id,
    aiTaskType: interaction.task_type,
    userPrompt: interaction.prompt,
    response: mapAIPlanResponse(interaction),
    responseText: interaction.ai_response,
    modelName: interaction.model_name,
    createdAt: interaction.created_at,
  };
}

function toAIPlanRequest(request) {
  return {
    project_id: Number(request.projectId),
    task_type: request.aiTaskType,
    prompt: request.requirement,
  };
}

function mapAIPlanResponse(interaction) {
  const sectionNames = [
    "Requirement Understanding",
    "Frontend Tasks",
    "Backend Tasks",
    "Database Tasks",
    "Testing Steps",
    "Possible Blockers",
    "Recommended Next Action",
  ];
  const sections = {};
  const answer = interaction.ai_response
    .replace(/\*\*/g, "")
    .replace(/\r\n/g, "\n");
  const sectionPattern = new RegExp(
    `(?:^|\\n)\\s*\\d+\\.\\s*(${sectionNames.join("|")})\\s*:?[ \\t]*([\\s\\S]*?)(?=\\n?\\s*\\d+\\.\\s*(?:${sectionNames.join("|")})\\s*:?[ \\t]*|$)`,
    "g"
  );
  let match;

  while ((match = sectionPattern.exec(answer)) !== null) {
    const key = match[1]
      .replace(/(?:^| )([A-Z])/g, (_, letter) => letter.toLowerCase())
      .replace(/ /g, "");
    const lines = match[2]
      .split("\n")
      .map((line) => line.replace(/^\s*(?:[-*]|\d+[.)])\s*/, "").trim())
      .filter(Boolean);
    sections[key] = ["Frontend Tasks", "Backend Tasks", "Database Tasks", "Testing Steps", "Possible Blockers"].includes(match[1])
      ? lines
      : lines.join(" ");
  }

  return {
    ...sections,
    interactionId: interaction.interaction_id,
    projectId: interaction.project_id,
    taskType: interaction.task_type,
    prompt: interaction.prompt,
    responseText: interaction.ai_response,
    modelName: interaction.model_name,
    createdAt: interaction.created_at,
  };
}

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------
export async function checkBackendHealth() {
  if (useMock) {
    await delay(150);
    return { status: "ok", mock: true };
  }
  const { data } = await apiClient.get("/api/health");
  return data;
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
export async function getDashboardStatistics() {
  if (useMock) {
    await delay();
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const pending = tasks.filter((t) => t.status === "Pending").length;
    return {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      pendingTasks: pending,
      inProgressTasks: inProgress,
      completedTasks: completed,
    };
  }
  const { data } = await apiClient.get("/api/dashboard");
  return data;
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export async function getProjects() {
  if (useMock) {
    await delay();
    return [...projects];
  }
  const { data } = await apiClient.get("/api/projects");
  return data.map(mapProject);
}

export async function getProjectById(projectId) {
  if (useMock) {
    await delay();
    return projects.find((p) => p.id === Number(projectId)) || null;
  }
  const { data } = await apiClient.get(`/api/projects/${projectId}`);
  return mapProject(data);
}

export async function createProject(projectData) {
  if (useMock) {
    await delay();
    const project = {
      id: nextId(projects),
      createdAt: new Date().toISOString().slice(0, 10),
      ...projectData,
    };
    projects = [...projects, project];
    return project;
  }
  const { data } = await apiClient.post(
    "/api/projects",
    toProjectRequest(projectData)
  );
  return mapProject(data);
}

export async function updateProject(projectId, projectData) {
  if (useMock) {
    await delay();
    projects = projects.map((p) =>
      p.id === Number(projectId) ? { ...p, ...projectData } : p
    );
    return projects.find((p) => p.id === Number(projectId));
  }
  const { data } = await apiClient.put(
    `/api/projects/${projectId}`,
    toProjectRequest(projectData)
  );
  return mapProject(data);
}

export async function deleteProject(projectId) {
  if (useMock) {
    await delay();
    projects = projects.filter((p) => p.id !== Number(projectId));
    tasks = tasks.filter((t) => t.projectId !== Number(projectId));
    return { success: true };
  }
  await apiClient.delete(`/api/projects/${projectId}`);
  return { success: true };
}

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------
export async function getTasks() {
  if (useMock) {
    await delay();
    return [...tasks];
  }
  const { data } = await apiClient.get("/api/tasks");
  return data.map(mapTask);
}

export async function createTask(taskData) {
  if (useMock) {
    await delay();
    const task = {
      id: nextId(tasks),
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      ...taskData,
    };
    tasks = [...tasks, task];
    return task;
  }
  const { data } = await apiClient.post(
    "/api/tasks",
    toTaskRequest(taskData)
  );
  return mapTask(data);
}

export async function updateTask(taskId, taskData) {
  if (useMock) {
    await delay();
    tasks = tasks.map((t) =>
      t.id === Number(taskId)
        ? { ...t, ...taskData, updatedAt: new Date().toISOString().slice(0, 10) }
        : t
    );
    return tasks.find((t) => t.id === Number(taskId));
  }
  const { data } = await apiClient.put(
    `/api/tasks/${taskId}`,
    toTaskRequest(taskData)
  );
  return mapTask(data);
}

export async function updateTaskStatus(taskId, status) {
  if (useMock) {
    await delay(150);
    tasks = tasks.map((t) =>
      t.id === Number(taskId)
        ? { ...t, status, updatedAt: new Date().toISOString().slice(0, 10) }
        : t
    );
    return tasks.find((t) => t.id === Number(taskId));
  }
  const { data } = await apiClient.patch(`/api/tasks/${taskId}/status`, { status });
  return mapTask(data);
}

export async function deleteTask(taskId) {
  if (useMock) {
    await delay();
    tasks = tasks.filter((t) => t.id !== Number(taskId));
    return { success: true };
  }
  await apiClient.delete(`/api/tasks/${taskId}`);
  return { success: true };
}

// ---------------------------------------------------------------------------
// AI
// ---------------------------------------------------------------------------
export async function generateAIPlan(requestData) {
  if (useMock) {
    await delay(900);
    return buildMockAIResponse(requestData);
  }
  const { data } = await apiClient.post(
    "/api/ai/plan",
    toAIPlanRequest(requestData)
  );
  return mapAIPlanResponse(data);
}

export async function getAIHistory(projectId) {
  if (useMock) {
    await delay();
    if (projectId) {
      return interactions.filter((i) => i.projectId === Number(projectId));
    }
    return [...interactions];
  }
  if (!projectId) return [];
  const url = `/api/ai/history/${projectId}`;
  const { data } = await apiClient.get(url);
  return data.map(mapInteraction);
}

export async function deleteAIInteraction(interactionId) {
  if (useMock) {
    await delay();
    interactions = interactions.filter((i) => i.id !== Number(interactionId));
    return { success: true };
  }
  await apiClient.delete(`/api/ai/history/${interactionId}`);
  return { success: true };
}

export async function saveAIInteraction(interaction) {
  if (useMock) {
    await delay();
    const record = {
      id: nextId(interactions),
      createdAt: new Date().toISOString().slice(0, 10),
      modelName: "GPT-OSS",
      ...interaction,
    };
    interactions = [record, ...interactions];
    return record;
  }
  return interaction;
}

// ---------------------------------------------------------------------------
// Mock AI response generator (frontend-only placeholder)
// ---------------------------------------------------------------------------
function buildMockAIResponse({ aiTaskType, requirement, projectName }) {
  const label = aiTaskType || "Break Requirement into Tasks";
  return {
    requirementUnderstanding: `For the "${projectName || "selected"}" project, the AI mentor interpreted the request as: ${requirement || "general project guidance"}. Task type: ${label}.`,
    frontendTasks: [
      "Create a responsive page for the requested feature.",
      "Add form validation and loading states.",
      "Display success and error messages to the user.",
    ],
    backendTasks: [
      "Add a FastAPI endpoint with input validation.",
      "Return structured JSON the frontend can render.",
      "Log errors for debugging.",
    ],
    databaseTasks: [
      "Create the required table with primary key.",
      "Add indexes for frequently queried columns.",
      "Use parameterised queries to prevent SQL injection.",
    ],
    testingSteps: [
      "Write unit tests for the endpoint.",
      "Test the form with empty and invalid input.",
      "Verify the feature works end to end in the browser.",
    ],
    possibleBlockers: [
      "Backend may not be running during development.",
      "Database schema may still be changing.",
      "AI model responses can vary between calls.",
    ],
    recommendedNextAction:
      "Start with the backend endpoint, then build the frontend form, and finish with tests.",
  };
}

export { useMock };