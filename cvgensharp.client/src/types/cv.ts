export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
  highlights: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialUrl?: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
}

export interface GenerateCV {
  cvData: CVData;
  optimizationSettings?: {
    format: 'pdf' | 'docx' | 'txt';
    includePhotography: boolean;
    useKeywords: boolean;
  };
}

export interface CVResponse {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  message?: string;
}
