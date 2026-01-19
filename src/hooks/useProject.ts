import { useState, useCallback } from 'react';
import { ProjectState, ProjectFile, Decision, GitLogEntry } from '@/types';
import { ProjectStatus } from '@/enums';
import { initialProjectState } from '@/test-utils/project.dummy';
import { initialGitLog } from '@/test-utils/git-log.dummy';

export function useProject() {
  const [project, setProject] = useState<ProjectState>(initialProjectState);
  const [gitLog, setGitLog] = useState<GitLogEntry[]>(initialGitLog);

  const updateFile = useCallback((path: string, content: string) => {
    setProject(prev => ({
      ...prev,
      files: prev.files.map(file =>
        file.path === path ? { ...file, content } : file
      ),
    }));
  }, []);

  const setStatus = useCallback((status: ProjectStatus) => {
    setProject(prev => ({ ...prev, status }));
  }, []);

  const addDecision = useCallback((decision: Decision) => {
    setProject(prev => ({
      ...prev,
      decisions: [...prev.decisions, decision],
    }));
  }, []);

  const addGitLogEntry = useCallback((entry: Omit<GitLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: GitLogEntry = {
      ...entry,
      id: `log-${Date.now()}`,
      timestamp: new Date(),
    };
    setGitLog(prev => [newEntry, ...prev]);
  }, []);

  const getFile = useCallback((path: string): ProjectFile | undefined => {
    return project.files.find(f => f.path === path);
  }, [project.files]);

  return {
    project,
    gitLog,
    updateFile,
    setStatus,
    addDecision,
    addGitLogEntry,
    getFile,
  };
}
