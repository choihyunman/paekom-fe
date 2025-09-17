export type SttStatus = "QUEUED" | "RUNNING" | "DONE" | "FAILED";

export type SttJob = {
  id: number;
  status: SttStatus;
  transcript?: string | null;
  errorMessage?: string | null;
  createdAt: string;
  startedAt?: string | null;
  finishedAt?: string | null;
};

export interface ApiTranscriptPayload {
  id: number;
  status: "DONE" | "PENDING" | string;
  transcript: string;
}
