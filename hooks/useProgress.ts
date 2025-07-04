import { useState, useEffect } from 'react';
import { database, UserProgress, UserStats, PracticeSession } from '@/utils/database';

export function useProgress(category?: string) {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await database.getProgress(category);
      setProgress(data);
    } catch (err) {
      setError('Failed to load progress data');
      console.error('Error loading progress:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (database.isReady()) {
      loadProgress();
    } else {
      // Wait for database to be ready
      const checkReady = setInterval(() => {
        if (database.isReady()) {
          clearInterval(checkReady);
          loadProgress();
        }
      }, 100);

      return () => clearInterval(checkReady);
    }
  }, [category]);

  const updateProgress = async (progressData: Omit<UserProgress, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await database.updateProgress(progressData);
      await loadProgress(); // Reload to get updated data
    } catch (err) {
      setError('Failed to update progress');
      console.error('Error updating progress:', err);
    }
  };

  const getItemProgress = async (itemId: string): Promise<UserProgress | null> => {
    if (!category) return null;
    try {
      return await database.getItemProgress(category, itemId);
    } catch (err) {
      console.error('Error getting item progress:', err);
      return null;
    }
  };

  return {
    progress,
    loading,
    error,
    updateProgress,
    getItemProgress,
    refreshProgress: loadProgress
  };
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await database.getUserStats();
      setStats(data);
    } catch (err) {
      setError('Failed to load user stats');
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (database.isReady()) {
      loadStats();
    } else {
      const checkReady = setInterval(() => {
        if (database.isReady()) {
          clearInterval(checkReady);
          loadStats();
        }
      }, 100);

      return () => clearInterval(checkReady);
    }
  }, []);

  const addPracticeSession = async (session: Omit<PracticeSession, 'id'>) => {
    try {
      await database.addPracticeSession(session);
      await loadStats(); // Reload stats after adding session
    } catch (err) {
      setError('Failed to add practice session');
      console.error('Error adding practice session:', err);
    }
  };

  return {
    stats,
    loading,
    error,
    addPracticeSession,
    refreshStats: loadStats
  };
}

export function usePracticeHistory(days: number = 30) {
  const [history, setHistory] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await database.getPracticeHistory(days);
      setHistory(data);
    } catch (err) {
      setError('Failed to load practice history');
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (database.isReady()) {
      loadHistory();
    } else {
      const checkReady = setInterval(() => {
        if (database.isReady()) {
          clearInterval(checkReady);
          loadHistory();
        }
      }, 100);

      return () => clearInterval(checkReady);
    }
  }, [days]);

  return {
    history,
    loading,
    error,
    refreshHistory: loadHistory
  };
}