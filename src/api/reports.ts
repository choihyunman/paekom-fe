import { http } from "@/lib/http";
import { toDateLabel } from "@/lib/date";
import type {
  ApiReport,
  ReportsPayload,
  ReportListItem,
} from "@/types/reports";
import type { ApiResponse } from "@/types/api";
import { unwrapApi } from "@/types/api";

// 목록 조회
export async function getReports(): Promise<ReportListItem[]> {
  const { data } = await http.get<ApiResponse<ReportsPayload>>("/report");
  const payload = unwrapApi(data); // status: "error"면 여기서 throw
  const list: ApiReport[] = payload.reports ?? [];
  return list.map(mapApiToListItem);
}

// 필요 시 단건/기타 API도 같은 패턴으로:
// export async function getReportById(id: number) {
//   const { data } = await http.get<ApiResponse<ApiReport>>(`/reports/${id}`)
//   return mapApiToListItem(unwrapApi(data))
// }

function mapApiToListItem(r: ApiReport): ReportListItem {
  return {
    id: r.reportId,
    summary: r.summary,
    createdAt: r.createdAt,
    dateLabel: toDateLabel(r.createdAt),
  };
}
