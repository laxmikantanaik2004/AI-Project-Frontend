import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as api from "../services/api";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, t, i] = await Promise.all([
        api.getProjects(),
        api.getTasks(),
        api.getAIHistory(),
      ]);
      setProjects(p);
      setTasks(t);
      setInteractions(i);
    } catch {
      setError("Unable to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Projects -------------------------------------------------------------
  const addProject = useCallback(async (data) => {
    const created = await api.createProject(data);
    setProjects((prev) => [...prev, created]);
    return created;
  }, []);

  const editProject = useCallback(async (id, data) => {
    const updated = await api.updateProject(id, data);
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    return updated;
  }, []);

  const removeProject = useCallback(async (id) => {
    await api.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
  }, []);

  // Tasks ----------------------------------------------------------------
  const addTask = useCallback(async (data) => {
    const created = await api.createTask(data);
    setTasks((prev) => [...prev, created]);
    return created;
  }, []);

  const editTask = useCallback(async (id, data) => {
    const updated = await api.updateTask(id, data);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    return updated;
  }, []);

  const changeTaskStatus = useCallback(async (id, status) => {
    const updated = await api.updateTaskStatus(id, status);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    return updated;
  }, []);

  const removeTask = useCallback(async (id) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // AI -------------------------------------------------------------------
  const generateAI = useCallback(async (requestData) => {
    return api.generateAIPlan(requestData);
  }, []);

  const saveInteraction = useCallback(async (interaction) => {
    const created = await api.saveAIInteraction(interaction);
    setInteractions((prev) => [created, ...prev]);
    return created;
  }, []);

  const removeInteraction = useCallback(async (id) => {
    await api.deleteAIInteraction(id);
    setInteractions((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const value = {
    projects,
    tasks,
    interactions,
    loading,
    error,
    refresh,
    addProject,
    editProject,
    removeProject,
    addTask,
    editTask,
    changeTaskStatus,
    removeTask,
    generateAI,
    saveInteraction,
    removeInteraction,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
