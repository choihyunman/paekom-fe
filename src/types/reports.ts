// API 원본 아이템
export interface ApiReport {
  reportId: number;
  summary: string;
  createdAt: string; // ISO
}

// payload를 배열로 정의
export type ReportsPayload = ApiReport[];

export interface ReportListItem {
  id: number;
  summary: string;
  createdAt: string;
  dateLabel: string;
}

export type Emotion = "POSITIVE" | "NEUTRAL" | "NEGATIVE" | string;

export interface EvidenceRaw {
  POSITIVE?: number;
  NEUTRAL?: number;
  NEGATIVE?: number;
}

export interface ApiReportDetailPayload {
  summary: string;
  issues: string[];
  emotion: Emotion;
  evidence: EvidenceRaw;
  overallAssessment: string;
  createdAt: string;
}

export interface ReportDetail {
  id: number;
  summary: string;
  issues: string[];
  emotion: Emotion;
  evidence: { positive: number; neutral: number; negative: number };
  overallAssessment: string;
  createdAt: string;
  dateLabel: string;
}
