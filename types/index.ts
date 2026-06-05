export interface FactoryFeature {
  id: string;
  name: string;
  description: string;
  programCodes?: string[];
  modelYears?: number[];
  isGlobal?: boolean;
  createdAt: string;
}

export interface SystemRequirement {
  id: string;
  description: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface UserStory {
  id: string;
  role: string;
  action: string;
  benefit: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface Requirements {
  systemRequirements: SystemRequirement[];
  userStories: UserStory[];
  acceptanceCriteria: string[];
}

export interface ServiceDesign {
  name: string;
  responsibility: string;
  components: string[];
  dependencies: string[];
  pattern: string;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  responseType: string;
}

export interface UnitTest {
  id: string;
  name: string;
  scenario: string;
  expected: string;
  status: 'passing' | 'failing' | 'pending';
}

export interface DevelopmentArtifacts {
  serviceDesign: ServiceDesign;
  apiContract: ApiEndpoint[];
  unitTests: UnitTest[];
}

export interface FailureCategory {
  category: string;
  count: number;
  color: string;
}

export interface RootCause {
  id: string;
  cause: string;
  affectedVehicles: number;
  severity: 'Critical' | 'Major' | 'Minor';
  recommendation: string;
}

export interface ValidationResult {
  totalVehicles: number;
  passed: number;
  failed: number;
  passRate: number;
  failureDistribution: FailureCategory[];
  rootCauses: RootCause[];
  aiInsights: string;
}

export interface QualityMetrics {
  traceabilityScore: number;
  testCoverageScore: number;
  cybersecurityScore: number;
  complianceScore: number;
  overallScore: number;
  recommendations: string[];
}

export interface DeploymentPhase {
  phase: string;
  label: string;
  vehicles: number;
  percentage: number;
  duration: string;
  criteria: string;
  status: 'complete' | 'active' | 'pending';
}

export interface ReleasePackage {
  packageId: string;
  version: string;
  summary: string;
  targetVehicles: number;
  deploymentPlan: DeploymentPhase[];
  changeLog: string[];
}

export interface FleetCluster {
  id: string;
  region: string;
  model: string;
  issueType: string;
  affectedVehicles: number;
  severity: 'Critical' | 'Warning' | 'Info';
}

export interface TrendPoint {
  day: string;
  successRate: number;
  activeVehicles: number;
}

export interface FleetIntelligence {
  successRate: number;
  totalDeployed: number;
  failureClusters: FleetCluster[];
  trends: TrendPoint[];
  aiRecommendations: string[];
}

export interface FactoryStats {
  featuresProcessed: number;
  requirementsGenerated: number;
  storiesGenerated: number;
  validationRuns: number;
  releasePackages: number;
  fleetInsights: number;
}

export type FactoryStage =
  | 'idle'
  | 'intake'
  | 'requirements'
  | 'development'
  | 'validation'
  | 'quality'
  | 'release'
  | 'fleet';

export interface FactoryState {
  feature: FactoryFeature | null;
  requirements: Requirements | null;
  development: DevelopmentArtifacts | null;
  validation: ValidationResult | null;
  quality: QualityMetrics | null;
  release: ReleasePackage | null;
  fleet: FleetIntelligence | null;
  currentStage: FactoryStage;
  stats: FactoryStats;
}

export interface FeatureRecord {
  feature: FactoryFeature;
  requirements: Requirements | null;
  development: DevelopmentArtifacts | null;
  validation: ValidationResult | null;
  quality: QualityMetrics | null;
  release: ReleasePackage | null;
  fleet: FleetIntelligence | null;
  stage: FactoryStage;
  updatedAt: string;
}

export type GenerateType =
  | 'requirements'
  | 'development'
  | 'quality'
  | 'release'
  | 'fleet';
