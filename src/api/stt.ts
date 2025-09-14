import { http } from "@/lib/http";
import type { ApiResponse } from "@/types/api";
import type { SttJob } from "@/types/stt";

// 파일 업로드 (스프링: @PostMapping("/api/stt/upload") @RequestParam("file"))
export async function uploadSttFile(file: File) {
  const form = new FormData();
  form.append("file", file);

  const res = await http.post<ApiResponse<{ id: number }>>("/stt", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!res.data || res.data.status !== "success") {
    throw new Error(res.data?.error || "Upload failed");
  }
  return res.data.data.id; // jobId
}

// STT Job 단건 조회 (예: GET /api/stt/jobs/{id})
export async function getSttJob(jobId: number) {
  const res = await http.get<ApiResponse<SttJob>>(`/api/stt/jobs/${jobId}`);
  if (!res.data || res.data.status !== "success") {
    throw new Error(res.data?.error || "Get job failed");
  }
  return res.data.data;
}
