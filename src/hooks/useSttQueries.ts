import { useMutation, useQuery } from "@tanstack/react-query";
import { sttApi } from "@/api";
import type { SttJob } from "@/types/stt";

export function useUploadSttMutation() {
  return useMutation({
    mutationFn: sttApi.uploadSttFile, // (file: File) => Promise<number>
  });
}

export function useUploadAndRequestReportMutation() {
  return useMutation({ mutationFn: sttApi.uploadAndRequestReport });
}

export function useSttJobQuery(jobId?: number) {
  return useQuery<SttJob>({
    queryKey: ["sttJob", jobId],
    queryFn: () => sttApi.getSttJob(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data as SttJob | undefined; // ✅ v5 방식
      const status = data?.status;
      return !data || status === "RUNNING" || status === "QUEUED"
        ? 2000
        : false;
    },
  });
}
