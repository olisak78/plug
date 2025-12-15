// src/types.ts

export interface Project {
  id: string;
  name: string;
  title: string;
  description: string;
  views: string;
  'components-metrics': boolean;
  alerts?: string;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
}