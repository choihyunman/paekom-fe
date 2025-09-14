import { http } from "@/lib/http";
import type { ApiResponse } from "@/types/api";
import type { SttJob } from "@/types/stt";

// 파일 업로드
export async function uploadSttFile(file: File) {
  const form = new FormData();
  form.append("file", file);

  const res = await http.post<ApiResponse<{ id: number }>>("/stt", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!res.data || res.data.status !== "success") {
    throw new Error(res.data?.error || "Upload failed");
  }
  console.log(res.data);
  console.log(res.data.data.id);
  return res.data.data.id;
}

// 업로드 후 보고서 생성 요청
export async function requestSttReport(
  sttId: number
): Promise<number | undefined> {
  const res = await http.post<ApiResponse<{ reportId: number }>>("/report", {
    sttId,
  });
  if (!res.data || res.data.status !== "success") {
    throw new Error(res.data?.error || "Report create failed");
  }
  console.log(res.data.data.reportId);
  return res.data.data.reportId;
}

/** 체이닝: 업로드 후 즉시 보고서 생성 요청 */
export async function uploadAndRequestReport(
  file: File
): Promise<{ sttId: number; reportId?: number }> {
  console.log("업로드 요청");
  const sttId = await uploadSttFile(file);
  console.log("보고서 생성 요청");
  const reportId = await requestSttReport(sttId);
  return { sttId, reportId };
}

// STT Job 단건 조회 (예: GET /api/stt/jobs/{id})
export async function getSttJob(jobId: number) {
  const res = await http.get<ApiResponse<SttJob>>(`/api/stt/jobs/${jobId}`);
  if (!res.data || res.data.status !== "success") {
    throw new Error(res.data?.error || "Get job failed");
  }
  return res.data.data;
}
