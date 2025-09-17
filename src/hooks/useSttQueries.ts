import { useMutation } from "@tanstack/react-query";
import { sttApi } from "@/api";

export function useUploadSttMutation() {
  return useMutation({
    mutationFn: sttApi.uploadSttFile, // (file: File) => Promise<number>
  });
}

export function useUploadAndRequestReportMutation() {
  return useMutation({ mutationFn: sttApi.uploadAndRequestReport });
}
