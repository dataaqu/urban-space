import type {
  Project,
  ProjectPage,
  Service,
  ContactSubmission,
  ProjectCategory,
  PageType,
} from '@prisma/client';

export type {
  Project,
  ProjectPage,
  Service,
  ContactSubmission,
  ProjectCategory,
  PageType,
};

export interface LocalizedProject extends Omit<Project, 'titleKa' | 'titleEn'> {
  title: string;
}

export interface LocalizedService extends Omit<Service, 'titleKa' | 'titleEn' | 'descriptionKa' | 'descriptionEn'> {
  title: string;
  description: string | null;
}


export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
