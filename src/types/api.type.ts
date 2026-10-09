export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedData<T> {
  data: T[];
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}
