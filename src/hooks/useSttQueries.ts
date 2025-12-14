import { useMutation } from "@tanstack/react-query";
import { sttApi } from "@/api";

export function useUploadSttMutation() {
  return useMutation({
    mutationFn: ({ file, bookingId }: { file: File; bookingId?: number }) =>
      sttApi.uploadSttFile(file, bookingId),
  });
}

export function useUploadAndRequestReportMutation() {
  return useMutation({ mutationFn: sttApi.uploadAndRequestReport });
}
