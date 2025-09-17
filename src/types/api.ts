export type ApiSuccess<T> = { status: "success"; data: T };
export type ApiError = { status: "error"; error: string };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function isApiSuccess<T>(res: ApiResponse<T>): res is ApiSuccess<T> {
  return res.status === "success";
}

/** 편의 함수: 성공이면 data 반환, 실패면 Error throw */
export function unwrapApi<T>(res: ApiResponse<T>): T {
  if (isApiSuccess(res)) return res.data;
  throw new Error(res.error || "API Error");
}
