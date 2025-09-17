import { http } from "@/lib/http";
import { toDateLabel } from "@/lib/date";
import type {
  ApiReport,
  ReportsPayload,
  ReportListItem,
  ApiReportDetailPayload,
  ReportDetail,
} from "@/types/reports";
import type { ApiResponse } from "@/types/api";
import { unwrapApi } from "@/types/api";

// 목록 조회
export async function getReports(): Promise<ReportListItem[]> {
  const { data } = await http.get<ApiResponse<ReportsPayload>>("/report");
  const list = unwrapApi(data); // ApiReport[]
  return list.map(mapApiToListItem);
}

// 상세 조회
export async function getReportDetail(id: number): Promise<ReportDetail> {
  const { data } = await http.get<ApiResponse<ApiReportDetailPayload>>(
    `/report/${id}`
  );
  const payload = unwrapApi(data);
  return mapApiToDetail(id, payload);
}

// ---- mappers ----
function mapApiToListItem(r: ApiReport): ReportListItem {
  return {
    id: r.reportId,
    summary: r.summary,
    createdAt: r.createdAt,
    dateLabel: toDateLabel(r.createdAt),
  };
}

function mapApiToDetail(id: number, p: ApiReportDetailPayload): ReportDetail {
  const positive = p.evidence.POSITIVE ?? 0;
  const neutral = p.evidence.NEUTRAL ?? 0;
  const negative = p.evidence.NEGATIVE ?? 0;

  return {
    id,
    summary: p.summary,
    issues: p.issues ?? [],
    emotion: p.emotion,
    evidence: { positive, neutral, negative },
    overallAssessment: p.overallAssessment,
    createdAt: p.createdAt,
    dateLabel: toDateLabel(p.createdAt),
  };
}
