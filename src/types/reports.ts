// 서버 원본 아이템
export interface ApiReport {
  reportId: number;
  summary: string;
  createdAt: string; // ISO-8601
}

// 목록 응답의 data 페이로드
export type ReportsPayload = {
  reports: ApiReport[];
};

// UI용 매핑 타입
export interface ReportListItem {
  id: number;
  summary: string;
  createdAt: string; // ISO 보존
  dateLabel: string; // YYYY-MM-DD
}
