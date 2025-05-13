// Auth Types
export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  active?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Project Types
export interface Project {
  id: number;
  name: string;
  description: string;
  status?: string;
  totalMembers?: number;
  updatedAt?: string;
}

export interface ProjectAssignment{
  id: number;
  projectId: number;
  userId: number;
  role: string;
}

export interface ProjectAssignmentUser {
  id: number;
  name: string;
  email: string;
  role?: string;
  active?: boolean;
  projectId?: number;
  projectName?: string;
}

// Work Package Types
export enum WorkPackageStatus {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  ON_HOLD = "ON_HOLD",
  COMPLETED = "COMPLETED",
  CLOSED = "CLOSED",
}

export enum WorkPackagePriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum WorkPackageType {
  TASK = "TASK",
  BUG = "BUG",
  FEATURE = "FEATURE",
  EPIC = "EPIC",
  STORY = "STORY",
}

export interface WorkPackage {
  id: number;
  title: string;
  description: string;
  workPackageType: WorkPackageType;
  assignedTo?: number;
  assignedToName?: string;
  accountableTo?: number;
  accountableToName?: string;
  estimateWork?: string;
  remainingWork?: string;
  spentWork?: string;
  storyPoints?: string;
  earnedStoryPoints?: string;
  projectType?: string;
  startDate?: string;
  endDate?: string;
  percentageComplete?: number;
  category?: string;
  taskType?: string;
  version?: string;
  priority: WorkPackagePriority;
  repositoryName?: string;
  branchName?: string;
  status: WorkPackageStatus;
  projectId: number;
  projectName?: string;
  createdAt?: string;
  isParentAvailable?: boolean;
  parentId?: number;
  parentWorkPackageType?: string;
  createdByName?: string;
  updatedAt?: string;
  updatedByName?: string;
}

// Work Package Response Types
export interface WorkPackageResponseWrapper {
  workPackage: WorkPackage;
  relatedWorkPackages: WorkPackage[];
  childWorkPackages: WorkPackage[];
}

export interface WorkPackageResponse {
  id: number;
  title: string;
  description: string;
  workPackageType: WorkPackageType;
  assignedTo?: number;
  assignedToName?: string;
  accountableTo?: number;
  accountableToName?: string;
  estimateWork?: string;
  remainingWork?: string;
  spentWork?: string;
  storyPoints?: string;
  earnedStoryPoints?: string;
  projectType?: string;
  startDate?: string;
  endDate?: string;
  percentageComplete?: number;
  category?: string;
  taskType?: string;
  version?: string;
  priority: WorkPackagePriority;
  repositoryName?: string;
  branchName?: string;
  status: WorkPackageStatus;
  projectId: number;
  projectName?: string;
  isParentAvailable?: boolean;
}

// Activity Types
export interface ActivityLog {
  id: number;
  userId: number;
  username: string;
  action: string;
  entityType: string;
  entityId: number;
  entityName: string;
  details: string;
  timestamp: string;
}

export interface FieldChangeLog {
  entityId: number;
  entityName: string | null;
  entityType: string;
  name: string;
  updatedAt: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
}


// Comment Types
export interface Comment {
  id: number;
  content: string;
  entityType: string;
  entityId: number;
  mentionedUserId?: number;
  userId: number;
  username: string;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export interface Notification {
  id: number;
  type: string;
  message: string;
  isRead: boolean;
  userId: number;
  relatedEntityType: string;
  relatedEntityId: number;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  statusCode?: string;
  message?: string;
  data?: T;
}

export interface Version {
  sprintName: string;
  startDate: string;
  endDate: string;
  progressPercentage: number;
  closedCount: number;
  closedCountPercentage: number;  
  openCount: number;
  openCountPercentage: number;
}


// Wiki Types
export interface WikiPage {
  id: number;
  title: string;
  description: string;
  updatedAt: string;
}

