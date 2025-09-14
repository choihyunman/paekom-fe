export type ApiSuccess<T> = { status: "success"; data: T };
export type ApiError = { status: "error"; error: string };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
