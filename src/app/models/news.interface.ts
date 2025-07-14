export interface News {
  id: string;
  tieuDe: string;
  tomTat: string;
  noiDung: string;
  anhDaiDien: string;
  tacGia: string;
  ngayDang: Date;
  ngayCapNhat?: Date;
  luotXem: number;
  danhMuc: string;
  tags: string[];
  trangThai: 'published' | 'draft';
  noiDung_html?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface NewsCategory {
  id: string;
  ten: string;
  moTa: string;
  thuTu: number;
}
