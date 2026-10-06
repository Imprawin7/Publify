export interface About {
  id?: number;
  headline?: string;
  bio?: string;
  location?: string;
  email?: string;
  resumeUrl?: string;
  avatarMediaUrl?: string;
}

export interface Skill {
  id: number;
  name: string;
  category?: string;
  proficiency?: number;
  icon?: string;
  sortOrder?: number;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  techStack?: string;
  repoUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  sortOrder?: number;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content?: string;
  coverImageUrl?: string;
  status: "DRAFT" | "PUBLISHED";
  publishedAt?: string;
  createdAt?: string;
}

export interface Experience {
  id: number;
  title: string;
  organization: string;
  startDate?: string;
  endDate?: string | null;
  description?: string;
  sortOrder?: number;
}

export interface Testimonial {
  id: number;
  authorName: string;
  authorRole?: string;
  message: string;
  avatarUrl?: string;
}

export interface Media {
  id: number;
  filename: string;
  url: string;
  mimeType?: string;
  sizeBytes?: number;
  uploadedAt?: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
}
