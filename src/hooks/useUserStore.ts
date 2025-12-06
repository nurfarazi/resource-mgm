import { useState, useEffect } from 'react';
import type { User } from '../types';

const USER_STORAGE_KEY = 'resource-mgm-users-v1';

const DEFAULT_ME: User = {
  id: 'user-me',
  name: 'Me',
  color: '#6366f1',
  isMe: true
};

export function useUserStore() {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const item = window.localStorage.getItem(USER_STORAGE_KEY);
      const loaded = item ? JSON.parse(item) : [];
      // Ensure 'Me' always exists
      if (!loaded.find((u: User) => u.isMe)) {
        return [DEFAULT_ME, ...loaded];
      }
      return loaded;
    } catch (error) {
      console.error('Failed to load users:', error);
      return [DEFAULT_ME];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save users:', error);
    }
  }, [users]);

  const addUser = (name: string, color: string) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      color,
      isMe: false
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const removeUser = (id: string) => {
    // Prevent deleting 'Me'
    if (users.find(u => u.id === id)?.isMe) return;
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return {
    users,
    addUser,
    updateUser,
    removeUser
  };
}
