import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Database interface types
export interface UserProgress {
  id?: number;
  category: 'chords' | 'scales' | 'strumming' | 'exercises' | 'lessons';
  itemId: string;
  itemName: string;
  completed: boolean;
  practiceTime: number; // in seconds
  lastPracticed: string; // ISO date string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  score?: number; // 0-100 for exercises
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  id?: number;
  totalPracticeTime: number; // in seconds
  currentStreak: number; // days
  longestStreak: number; // days
  lastPracticeDate: string; // ISO date string
  chordsLearned: number;
  scalesLearned: number;
  exercisesCompleted: number;
  lessonsCompleted: number;
  level: number;
  experience: number;
  createdAt: string;
  updatedAt: string;
}

export interface PracticeSession {
  id?: number;
  category: 'chords' | 'scales' | 'strumming' | 'exercises' | 'lessons';
  itemId: string;
  itemName: string;
  duration: number; // in seconds
  date: string; // ISO date string
  notes?: string;
}

class DatabaseManager {
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      // For web platform, use a different approach
      if (Platform.OS === 'web') {
        // Use localStorage for web platform as a fallback
        this.isInitialized = true;
        return;
      }

      this.db = await SQLite.openDatabaseAsync('guitar_progress.db');
      await this.createTables();
      await this.initializeUserStats();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      this.isInitialized = false;
    }
  }

  private async createTables() {
    if (!this.db) return;

    try {
      // User Progress table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS user_progress (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category TEXT NOT NULL,
          itemId TEXT NOT NULL,
          itemName TEXT NOT NULL,
          completed BOOLEAN DEFAULT FALSE,
          practiceTime INTEGER DEFAULT 0,
          lastPracticed TEXT,
          difficulty TEXT,
          score INTEGER,
          notes TEXT,
          createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
          updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(category, itemId)
        );
      `);

      // User Stats table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS user_stats (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          totalPracticeTime INTEGER DEFAULT 0,
          currentStreak INTEGER DEFAULT 0,
          longestStreak INTEGER DEFAULT 0,
          lastPracticeDate TEXT,
          chordsLearned INTEGER DEFAULT 0,
          scalesLearned INTEGER DEFAULT 0,
          exercisesCompleted INTEGER DEFAULT 0,
          lessonsCompleted INTEGER DEFAULT 0,
          level INTEGER DEFAULT 1,
          experience INTEGER DEFAULT 0,
          createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
          updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Practice Sessions table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS practice_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category TEXT NOT NULL,
          itemId TEXT NOT NULL,
          itemName TEXT NOT NULL,
          duration INTEGER NOT NULL,
          date TEXT NOT NULL,
          notes TEXT
        );
      `);

      console.log('Database tables created successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
    }
  }

  private async initializeUserStats() {
    if (!this.db) return;

    try {
      const result = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM user_stats');
      if ((result as any)?.count === 0) {
        await this.db.runAsync(`
          INSERT INTO user_stats (
            totalPracticeTime, currentStreak, longestStreak, 
            chordsLearned, scalesLearned, exercisesCompleted, 
            lessonsCompleted, level, experience, createdAt, updatedAt
          ) VALUES (0, 0, 0, 0, 0, 0, 0, 1, 0, ?, ?)
        `, [new Date().toISOString(), new Date().toISOString()]);
      }
    } catch (error) {
      console.error('Error initializing user stats:', error);
    }
  }

  // Web fallback methods using localStorage
  private getWebData(key: string): any[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setWebData(key: string, data: any[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Progress tracking methods
  async updateProgress(progress: Omit<UserProgress, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    if (!this.isInitialized) {
      console.warn('Database not initialized');
      return;
    }

    const now = new Date().toISOString();

    if (Platform.OS === 'web') {
      const progressData = this.getWebData('user_progress');
      const existingIndex = progressData.findIndex(
        p => p.category === progress.category && p.itemId === progress.itemId
      );

      const progressItem = {
        ...progress,
        id: existingIndex >= 0 ? progressData[existingIndex].id : Date.now(),
        createdAt: existingIndex >= 0 ? progressData[existingIndex].createdAt : now,
        updatedAt: now
      };

      if (existingIndex >= 0) {
        progressData[existingIndex] = progressItem;
      } else {
        progressData.push(progressItem);
      }

      this.setWebData('user_progress', progressData);
      return;
    }

    if (!this.db) return;

    try {
      await this.db.runAsync(`
        INSERT OR REPLACE INTO user_progress (
          category, itemId, itemName, completed, practiceTime, 
          lastPracticed, difficulty, score, notes, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        progress.category,
        progress.itemId,
        progress.itemName,
        progress.completed,
        progress.practiceTime,
        progress.lastPracticed,
        progress.difficulty,
        progress.score || null,
        progress.notes || null,
        now
      ]);

      // Update user stats
      await this.updateUserStats(progress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }

  async getProgress(category?: string): Promise<UserProgress[]> {
    if (!this.isInitialized) return [];

    if (Platform.OS === 'web') {
      const progressData = this.getWebData('user_progress');
      return category ? progressData.filter(p => p.category === category) : progressData;
    }

    if (!this.db) return [];

    try {
      const query = category 
        ? 'SELECT * FROM user_progress WHERE category = ? ORDER BY updatedAt DESC'
        : 'SELECT * FROM user_progress ORDER BY updatedAt DESC';
      
      const params = category ? [category] : [];
      const result = await this.db.getAllAsync(query, params);
      return result as UserProgress[];
    } catch (error) {
      console.error('Error getting progress:', error);
      return [];
    }
  }

  async getItemProgress(category: string, itemId: string): Promise<UserProgress | null> {
    if (!this.isInitialized) return null;

    if (Platform.OS === 'web') {
      const progressData = this.getWebData('user_progress');
      return progressData.find(p => p.category === category && p.itemId === itemId) || null;
    }

    if (!this.db) return null;

    try {
      const result = await this.db.getFirstAsync(
        'SELECT * FROM user_progress WHERE category = ? AND itemId = ?',
        [category, itemId]
      );
      return result as UserProgress || null;
    } catch (error) {
      console.error('Error getting item progress:', error);
      return null;
    }
  }

  async addPracticeSession(session: Omit<PracticeSession, 'id'>): Promise<void> {
    if (!this.isInitialized) return;

    if (Platform.OS === 'web') {
      const sessions = this.getWebData('practice_sessions');
      sessions.push({ ...session, id: Date.now() });
      this.setWebData('practice_sessions', sessions);
      return;
    }

    if (!this.db) return;

    try {
      await this.db.runAsync(`
        INSERT INTO practice_sessions (category, itemId, itemName, duration, date, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [session.category, session.itemId, session.itemName, session.duration, session.date, session.notes || null]);
    } catch (error) {
      console.error('Error adding practice session:', error);
    }
  }

  async getUserStats(): Promise<UserStats | null> {
    if (!this.isInitialized) return null;

    if (Platform.OS === 'web') {
      const stats = this.getWebData('user_stats');
      return stats[0] || this.getDefaultStats();
    }

    if (!this.db) return null;

    try {
      const result = await this.db.getFirstAsync('SELECT * FROM user_stats LIMIT 1');
      return result as UserStats || this.getDefaultStats();
    } catch (error) {
      console.error('Error getting user stats:', error);
      return this.getDefaultStats();
    }
  }

  private getDefaultStats(): UserStats {
    const now = new Date().toISOString();
    return {
      id: 1,
      totalPracticeTime: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastPracticeDate: now,
      chordsLearned: 0,
      scalesLearned: 0,
      exercisesCompleted: 0,
      lessonsCompleted: 0,
      level: 1,
      experience: 0,
      createdAt: now,
      updatedAt: now
    };
  }

  private async updateUserStats(progress: Omit<UserProgress, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    if (Platform.OS === 'web') {
      const stats = this.getWebData('user_stats');
      const currentStats = stats[0] || this.getDefaultStats();
      
      // Update stats based on progress
      if (progress.completed) {
        switch (progress.category) {
          case 'chords':
            currentStats.chordsLearned += 1;
            break;
          case 'scales':
            currentStats.scalesLearned += 1;
            break;
          case 'exercises':
            currentStats.exercisesCompleted += 1;
            break;
          case 'lessons':
            currentStats.lessonsCompleted += 1;
            break;
        }
      }

      currentStats.totalPracticeTime += progress.practiceTime;
      currentStats.experience += Math.floor(progress.practiceTime / 60) * 10; // 10 XP per minute
      currentStats.level = Math.floor(currentStats.experience / 1000) + 1; // Level up every 1000 XP
      currentStats.updatedAt = new Date().toISOString();

      // Update streak
      const today = new Date().toDateString();
      const lastPractice = new Date(currentStats.lastPracticeDate).toDateString();
      
      if (today !== lastPractice) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastPractice === yesterday.toDateString()) {
          currentStats.currentStreak += 1;
        } else {
          currentStats.currentStreak = 1;
        }
        
        currentStats.longestStreak = Math.max(currentStats.longestStreak, currentStats.currentStreak);
        currentStats.lastPracticeDate = new Date().toISOString();
      }

      if (stats.length === 0) {
        stats.push(currentStats);
      } else {
        stats[0] = currentStats;
      }
      
      this.setWebData('user_stats', stats);
      return;
    }

    if (!this.db) return;

    try {
      const now = new Date().toISOString();
      
      // Get current stats
      const currentStats = await this.getUserStats();
      if (!currentStats) return;

      let newChordsLearned = currentStats.chordsLearned;
      let newScalesLearned = currentStats.scalesLearned;
      let newExercisesCompleted = currentStats.exercisesCompleted;
      let newLessonsCompleted = currentStats.lessonsCompleted;

      // Update completion counts
      if (progress.completed) {
        switch (progress.category) {
          case 'chords':
            newChordsLearned += 1;
            break;
          case 'scales':
            newScalesLearned += 1;
            break;
          case 'exercises':
            newExercisesCompleted += 1;
            break;
          case 'lessons':
            newLessonsCompleted += 1;
            break;
        }
      }

      const newTotalPracticeTime = currentStats.totalPracticeTime + progress.practiceTime;
      const newExperience = currentStats.experience + Math.floor(progress.practiceTime / 60) * 10;
      const newLevel = Math.floor(newExperience / 1000) + 1;

      // Calculate streak
      const today = new Date().toDateString();
      const lastPractice = new Date(currentStats.lastPracticeDate).toDateString();
      let newCurrentStreak = currentStats.currentStreak;
      let newLongestStreak = currentStats.longestStreak;

      if (today !== lastPractice) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastPractice === yesterday.toDateString()) {
          newCurrentStreak += 1;
        } else {
          newCurrentStreak = 1;
        }
        
        newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
      }

      await this.db.runAsync(`
        UPDATE user_stats SET 
          totalPracticeTime = ?,
          currentStreak = ?,
          longestStreak = ?,
          lastPracticeDate = ?,
          chordsLearned = ?,
          scalesLearned = ?,
          exercisesCompleted = ?,
          lessonsCompleted = ?,
          level = ?,
          experience = ?,
          updatedAt = ?
        WHERE id = 1
      `, [
        newTotalPracticeTime,
        newCurrentStreak,
        newLongestStreak,
        now,
        newChordsLearned,
        newScalesLearned,
        newExercisesCompleted,
        newLessonsCompleted,
        newLevel,
        newExperience,
        now
      ]);
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }

  async getPracticeHistory(days: number = 30): Promise<PracticeSession[]> {
    if (!this.isInitialized) return [];

    if (Platform.OS === 'web') {
      const sessions = this.getWebData('practice_sessions');
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      return sessions.filter(session => new Date(session.date) >= cutoffDate)
                   .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    if (!this.db) return [];

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const result = await this.db.getAllAsync(
        'SELECT * FROM practice_sessions WHERE date >= ? ORDER BY date DESC',
        [cutoffDate.toISOString()]
      );
      return result as PracticeSession[];
    } catch (error) {
      console.error('Error getting practice history:', error);
      return [];
    }
  }

  async clearAllData(): Promise<void> {
    if (!this.isInitialized) return;

    if (Platform.OS === 'web') {
      localStorage.removeItem('user_progress');
      localStorage.removeItem('user_stats');
      localStorage.removeItem('practice_sessions');
      return;
    }

    if (!this.db) return;

    try {
      await this.db.execAsync('DELETE FROM user_progress');
      await this.db.execAsync('DELETE FROM user_stats');
      await this.db.execAsync('DELETE FROM practice_sessions');
      await this.initializeUserStats();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

// Create singleton instance
export const database = new DatabaseManager();