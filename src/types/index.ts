import type {
  Project,
  ProjectPage,
  TeamMember,
  Partner,
  Service,
  ContactSubmission,
  SiteSettings,
  ProjectCategory,
  PageType,
} from '@prisma/client';

export type {
  Project,
  ProjectPage,
  TeamMember,
  Partner,
  Service,
  ContactSubmission,
  SiteSettings,
  ProjectCategory,
  PageType,
};

export interface LocalizedProject extends Omit<Project, 'titleKa' | 'titleEn'> {
  title: string;
}

export interface LocalizedTeamMember extends Omit<TeamMember, 'nameKa' | 'nameEn' | 'positionKa' | 'positionEn'> {
  name: string;
  position: string;
}

export interface LocalizedService extends Omit<Service, 'titleKa' | 'titleEn' | 'descriptionKa' | 'descriptionEn'> {
  title: string;
  description: string | null;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  cadastralCode?: string;
  buildingFunction?: string;
  area?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
