export type Role = 'STUDENT' | 'EMPLOYER' | 'ADMIN';

export type CompetencyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'JOB_READY';

export type SubmissionStatus =
  | 'SUBMITTED'
  | 'UNDER_EVALUATION'
  | 'EVALUATION_COMPLETE'
  | 'VERIFIED'
  | 'NEEDS_IMPROVEMENT';

export interface User {
  id: string;
  email: string;
  role: Role;
  fullName?: string;
  companyName?: string;
  profileCompletion?: number;
  carevaId?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ path: string; message: string }>;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  trade: string;
  description?: string;
}

export interface StudentSkill {
  id: string;
  skillId: string;
  selfAssessedLevel?: CompetencyLevel;
  verifiedLevel?: CompetencyLevel;
  competencyScore?: number;
  isVerified: boolean;
  verificationDate?: string;
  credentialId?: string;
  experienceNotes?: string;
  skill: Skill;
  credential?: {
    credentialId: string;
    issuedAt: string;
    status: string;
  };
}

export interface Certificate {
  id: string;
  title: string;
  issuer?: string;
  issueDate?: string;
  fileUrl?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  skillsUsed: string[];
  url?: string;
  createdAt: string;
}

export interface SkillEvaluation {
  id: string;
  rubricScores: Record<string, number>;
  overallScore: number;
  level: CompetencyLevel;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  isDemo: boolean;
  evaluatedAt: string;
}

export interface SkillSubmission {
  id: string;
  skillId: string;
  title: string;
  description: string;
  toolsUsed?: string;
  steps?: string;
  mediaType?: string;
  mediaUrl?: string;
  status: SubmissionStatus;
  createdAt: string;
  skill: Skill;
  evaluations: SkillEvaluation[];
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  phone?: string;
  location?: string;
  institute?: string;
  course?: string;
  trade?: string;
  graduationYear?: number;
  about?: string;
  profileImage?: string;
  profileCompletion: number;
  carevaId: string;
  experienceYears: number;
  skills: StudentSkill[];
  certificates: Certificate[];
  projects: Project[];
  submissions?: SkillSubmission[];
  feedbackReceived?: Array<{
    id: string;
    practicalScore: number;
    technicalScore: number;
    safetyScore: number;
    reliabilityScore: number;
    communicationScore: number;
    workplaceScore: number;
    writtenFeedback?: string;
    createdAt: string;
  }>;
  user?: { email: string };
}

export interface DashboardStats {
  profileCompletion: number;
  verifiedSkillsCount: number;
  totalSkillsCount: number;
  overallCompetencyScore: number;
  jobMatchesCount: number;
  submissionsCount: number;
  pendingSubmissions: number;
  recentMatches: Array<{
    id: string;
    overallScore: number;
    skillMatch: number;
    competencyMatch: number;
    job: {
      id: string;
      title: string;
      location?: string;
      trade: string;
      requiredCompetency: CompetencyLevel;
      employer: { companyName: string };
      requirements: Array<{ skill: Skill; requiredLevel: CompetencyLevel }>;
    };
  }>;
}
