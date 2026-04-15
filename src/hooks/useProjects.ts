import { useState, useEffect, useRef } from 'react';
import type { Project } from '@/types';

const cache = new Map<string, { data: Project[]; timestamp: number }>();
const CACHE_TTL = 10_000; // 10 seconds

export function invalidateProjectsCache() {
  cache.clear();
}

export function useProjects(params: Record<string, string>) {
  const key = new URLSearchParams(params).toString();
  const cached = cache.get(key);
  const isFresh = cached && Date.now() - cached.timestamp < CACHE_TTL;

  const [projects, setProjects] = useState<Project[]>(isFresh ? cached.data : []);
  const [isLoading, setIsLoading] = useState(!isFresh);
  const abortRef = useRef<AbortController>(null);

  useEffect(() => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setProjects(cached.data);
      setIsLoading(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);

    fetch(`/api/projects?${key}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        const projects = Array.isArray(data) ? data : [];
        cache.set(key, { data: projects, timestamp: Date.now() });
        setProjects(projects);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Error fetching projects:', err);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [key]);

  return { projects, isLoading };
}
