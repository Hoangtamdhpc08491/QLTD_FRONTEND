export interface News {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
  timeUpload?: Date;
  timeActive?: Date;
  hide?: boolean;
  categoryId?: number;
  uploadBy?: string;
  deleteFlag?: boolean;
  createAt?: Date;
  updateAt?: Date;
  Category?: NewsCategory;
}

export interface NewsCategory {
  id: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewsResponse {
  success: boolean;
  message: string;
  data: News[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface NewsCategoryResponse {
  success: boolean;
  message: string;
  data: NewsCategory[];
}
