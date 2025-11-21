
export enum Severity {
  CRITICAL = 'CRITICAL',
  WARNING = 'WARNING',
  INFO = 'INFO',
  GOOD = 'GOOD'
}

export enum Category {
  TECHNICAL = 'TECHNICAL',
  CONTENT = 'CONTENT',
  UX_MOBILE = 'UX_MOBILE',
  AUTHORITY = 'AUTHORITY'
}

export enum AuditType {
  WEB = 'WEB',
  APP = 'APP'
}

export interface CategoryScores {
  technical: number;
  content: number;
  ux: number;
  authority: number;
}

export interface CodeFix {
  current: string;
  optimized: string;
  explanation: string;
}

export interface SeoIssue {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  category: Category;
  recommendation: string;
  codeFix?: CodeFix;
  impact: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface CompetitorMetrics {
  monthlyTraffic: number;
  organicKeywords: number;
  domainAuthority: number;
  backlinks: number;
  topKeywords: string[];
}

export interface Competitor {
  name: string;
  url: string;
  overlapScore: number;
  strengths: string[];
  weaknesses: string[];
  marketPosition: 'LEADER' | 'CHALLENGER' | 'NICHE';
  scores: CategoryScores;
  metrics: CompetitorMetrics; // New detailed metrics
}

export interface RoadmapTask {
  task: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface RoadmapStage {
  stage: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM';
  tasks: RoadmapTask[];
}

export interface ContentAnalysis {
  tone: string;
  readabilityLevel: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  topEntities: string[];
}

export interface KeywordMetric {
  keyword: string;
  count: number;
  density: number; // Percentage 0-100
}

export interface KeywordAnalysis {
  topKeywords: KeywordMetric[];
  recommendation: string;
}

export interface SocialPreview {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
}

export interface TrafficData {
    month: string;
    current: number;
    projected: number;
}

export interface LinkBreakdown {
    dofollow: number;
    nofollow: number;
    broken: number;
}

export interface DeepTechSpecs {
  titleTag: string;
  titleLength: number;
  metaDescription: string;
  metaDescriptionLength: number;
  canonicalTag: string | null;
  robotsMeta: string | null;
  viewportMeta: string | null;
  charset: string | null;
  h1Count: number;
  h1Content: string;
  headingStructure: string;
  wordCount: number;
  textToHtmlRatio: number;
  imageCount: number;
  imagesWithoutAlt: number;
  internalLinkCount: number;
  externalLinkCount: number;
  linkStats?: {
      internal: LinkBreakdown;
      external: LinkBreakdown;
  };
  schemaTypes: string[];
  openGraphTags: boolean;
  twitterCard: boolean;
  favicon: boolean;
}

export interface AsoSpecs {
  appName: string;
  appNameLength: number;
  subtitle: string | null;
  shortDescription: string | null;
  promotionalText: string | null;
  descriptionLength: number;
  keywordsDetected: string[];
  rating: number;
  reviewCount: number;
  lastUpdated: string | null;
  version: string | null;
  hasVideoPreview: boolean;
}

export interface SeoResult {
  id: string;
  timestamp: number;
  url: string;
  auditType: AuditType;
  targetAudience?: string;
  geo?: string;
  overallScore: number;
  categoryScores: CategoryScores;
  summary: string;
  specs: DeepTechSpecs | null;
  asoSpecs: AsoSpecs | null;
  issues: SeoIssue[];
  keywordStrategy: string[];
  keywordAnalysis: KeywordAnalysis | null;
  techStack: string[];
  socialPreview: SocialPreview | null;
  contentGapAnalysis: string;
  competitors: Competitor[];
  trafficForecast: TrafficData[]; // New: Growth chart data
  roadmap: RoadmapStage[];
  contentAnalysis: ContentAnalysis | null;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface HistoryItem {
  id: string;
  url: string;
  timestamp: number;
  score: number;
  errorCount?: number;
  type: AuditType;
}
