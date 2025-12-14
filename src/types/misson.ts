// API 원본 아이템
export interface ApiMission {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

// payload를 배열로 정의
export type MissionPayload = ApiMission[];

export interface ApiReportDetailPayload {
  id: number;
  title: string;
  content: string;
  category: string;
  memo: string;
  feedback: string;
  createdAt: string;
}

export interface MissionDetail {
  id: number;
  title: string;
  content: string;
  category: string;
  memo: string;
  feedback: string;
  createdAt: string;
}

// 카테고리 라벨 매핑
export const CATEGORY_LABEL: Record<string, string> = {
  SELF_CARE: "자기관리",
  STUDY: "학업",
  HOBBY: "취미",
  SPORTS: "운동",
  OUTDOOR: "외부활동",
  SOCIAL: "사회활동",
  CAREER: "취업준비",
  ETC: "기타",
};
