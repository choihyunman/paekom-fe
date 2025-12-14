import { http } from "@/lib/http";
import type { ApiResponse } from "@/types/api";
import type {
  ApiMission,
  MissionPayload,
  ApiReportDetailPayload,
  MissionDetail,
} from "@/types/misson";
import { unwrapApi } from "@/types/api";

// 목록 조회
export async function getMissions(): Promise<ApiMission[]> {
  const { data } = await http.get<ApiResponse<MissionPayload>>("/mission/list");
  const list = unwrapApi(data);
  return list.map(mapApiToListItem);
}

// 상세 조회
export async function getMissionDetail(id: number): Promise<MissionDetail> {
  const { data } = await http.get<ApiResponse<ApiReportDetailPayload>>(
    `/mission/${id}`
  );
  const payload = unwrapApi(data);
  return mapApiToDetail(id, payload);
}

// 생성
export async function createMission(
  title: string,
  content: string,
  category: string,
  memo: string
): Promise<void> {
  await http.post<ApiResponse<ApiMission>>("/mission", {
    title,
    content,
    category,
    memo,
  });
}

// 삭제
export async function deleteMission(id: number): Promise<void> {
  await http.delete<ApiResponse<void>>(`/mission/${id}`);
}

// ---- mappers ----
function mapApiToListItem(mission: ApiMission): ApiMission {
  return {
    id: mission.id,
    title: mission.title,
    content: mission.content,
    category: mission.category,
    createdAt: mission.createdAt,
  };
}

function mapApiToDetail(id: number, p: ApiReportDetailPayload): MissionDetail {
  return {
    id,
    title: p.title,
    content: p.content,
    category: p.category,
    memo: p.memo,
    feedback: p.feedback,
    createdAt: p.createdAt,
  };
}
