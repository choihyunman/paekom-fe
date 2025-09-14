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
