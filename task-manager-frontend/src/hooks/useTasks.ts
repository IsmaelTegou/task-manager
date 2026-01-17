import { useState, useCallback } from 'react';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types';
import { apiService } from '../services/api';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  getTask: (id: string) => Promise<Task | null>;
  createTask: (task: CreateTaskDto) => Promise<Task | null>;
  updateTask: (id: string, task: UpdateTaskDto) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // APPEL RÉEL
      const response = await apiService.getTasks();
      setTasks(response.data.data); // Note: response.data.data car notre API retourne ApiResponse<T>
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch tasks';
      setError(errorMessage);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTask = useCallback(async (id: string): Promise<Task | null> => {
    setLoading(true);
    try {
      // APPEL RÉEL
      const response = await apiService.getTask(id);
      return response.data.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch task';
      setError(errorMessage);
      console.error('Error fetching task:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData: CreateTaskDto): Promise<Task | null> => {
    setLoading(true);
    try {
      // APPEL RÉEL
      const response = await apiService.createTask(taskData);
      const newTask = response.data.data;
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create task';
      setError(errorMessage);
      console.error('Error creating task:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id: string, taskData: UpdateTaskDto): Promise<Task | null> => {
    setLoading(true);
    try {
      // APPEL RÉEL
      const response = await apiService.updateTask(id, taskData);
      const updatedTask = response.data.data;
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      return updatedTask;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update task';
      setError(errorMessage);
      console.error('Error updating task:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      // APPEL RÉEL
      await apiService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete task';
      setError(errorMessage);
      console.error('Error deleting task:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    clearError,
  };
};