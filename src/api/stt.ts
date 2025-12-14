import { http } from "@/lib/http";
import type { ApiResponse } from "@/types/api";
import type { ApiTranscriptPayload } from "@/types/stt";
import { unwrapApi } from "@/types/api";

// 파일 업로드
export async function uploadSttFile(file: File, bookingId?: number) {
  const form = new FormData();
  form.append("file", file);
  if (bookingId !== undefined) {
    form.append("bookingId", bookingId.toString());
  }

  const res = await http.post<ApiResponse<{ id: number }>>("/stt", form);

  if (!res.data || res.data.status !== "success") {
    throw new Error(res.data?.error || "Upload failed");
  }
  console.log(res.data);
  console.log(res.data.data.id);
  return res.data.data.id;
}

// 업로드 후 보고서 생성 요청
export async function requestSttReport(
  sttId: number,
  bookingId?: number
): Promise<number | undefined> {
  const res = await http.post<ApiResponse<{ reportId: number }>>("/report", {
    sttId,
    ...(bookingId !== undefined && { bookingId }),
  });
  if (!res.data || res.data.status !== "success") {
    throw new Error(res.data?.error || "Report create failed");
  }
  console.log(res.data.data.reportId);
  return res.data.data.reportId;
}

/** 체이닝: 업로드 후 즉시 보고서 생성 요청 */
export async function uploadAndRequestReport(
  file: File,
  bookingId?: number
): Promise<{ sttId: number; reportId?: number }> {
  console.log("업로드 요청");
  const sttId = await uploadSttFile(file, bookingId);
  console.log("보고서 생성 요청");
  const reportId = await requestSttReport(sttId, bookingId);
  return { sttId, reportId };
}

// Transcript 조회 (appointmentId 사용)
export async function getReportTranscript(
  appointmentId: number
): Promise<string> {
  const { data } = await http.get<ApiResponse<ApiTranscriptPayload>>(
    `/stt/${appointmentId}`
  );
  const payload = unwrapApi(data);
  return (payload.transcript ?? "").trim();
}
