import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { News, NewsCategory } from '../../../../models/news.interface';
import { NewsService } from '../../../../services/news.service';
import { NewsCategoryService } from '../../../../services/news-category.service';

@Component({
  selector: 'app-admin-news-form',
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-news-form">
      <div class="page-header">
        <div class="header-content">
          <h1>{{isEdit ? 'Chỉnh sửa tin tức' : 'Thêm tin tức mới'}}</h1>
          <a routerLink="/admin/news" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i>
            Quay về danh sách
          </a>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>{{isEdit ? 'Đang tải thông tin tin tức...' : 'Đang tải form...'}}</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error && !isLoading" class="error-state">
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>{{error}}</p>
          <button (click)="loadNews()" class="btn btn-primary" *ngIf="isEdit">Thử lại</button>
        </div>
      </div>

      <!-- Form -->
      <form *ngIf="!isLoading && !error" (ngSubmit)="onSubmit()" class="news-form">
        <div class="form-section">
          <h3>Thông tin cơ bản</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="title">Tiêu đề <span class="required">*</span></label>
              <input 
                type="text" 
                id="title"
                [(ngModel)]="newsData.title"
                name="title"
                required
                class="form-input"
                placeholder="Nhập tiêu đề tin tức">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="categoryId">Danh mục</label>
              <select 
                id="categoryId"
                [(ngModel)]="newsData.categoryId"
                name="categoryId"
                class="form-select">
                <option [value]="null">Chọn danh mục</option>
                <option *ngFor="let category of categories" [value]="category.id">
                  {{category.name}}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="thumbnail">Ảnh đại diện</label>
              <input 
                type="url" 
                id="thumbnail"
                [(ngModel)]="newsData.thumbnail"
                name="thumbnail"
                class="form-input"
                placeholder="URL ảnh đại diện">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group full-width">
              <label for="content">Nội dung <span class="required">*</span></label>
              <textarea 
                id="content"
                [(ngModel)]="newsData.content"
                name="content"
                required
                rows="15"
                class="form-textarea"
                placeholder="Nhập nội dung tin tức..."></textarea>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="timeActive">Thời gian kích hoạt</label>
              <input 
                type="datetime-local" 
                id="timeActive"
                [(ngModel)]="timeActiveInput"
                name="timeActive"
                class="form-input">
            </div>
            
            <div class="form-group">
              <div class="checkbox-group">
                <input 
                  type="checkbox" 
                  id="hide"
                  [(ngModel)]="newsData.hide"
                  name="hide"
                  class="form-checkbox">
                <label for="hide">Ẩn tin tức này</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" (click)="onCancel()" class="btn btn-outline">
            Hủy
          </button>
          
          <button type="submit" [disabled]="isSaving" class="btn btn-primary">
            <span *ngIf="isSaving" class="spinner"></span>
            {{isSaving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Tạo mới')}}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .admin-news-form {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content h1 {
      margin: 0;
      color: #1f2937;
    }

    .news-form {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .form-section {
      padding: 24px;
    }

    .form-section h3 {
      margin: 0 0 24px 0;
      color: #1f2937;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 12px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      font-weight: 500;
      margin-bottom: 6px;
      color: #374151;
    }

    .required {
      color: #dc2626;
    }

    .form-input,
    .form-select,
    .form-textarea {
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-textarea {
      resize: vertical;
      font-family: inherit;
      line-height: 1.5;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 6px;
    }

    .form-checkbox {
      width: 16px;
      height: 16px;
      margin: 0;
    }

    .checkbox-group label {
      margin: 0;
      font-weight: normal;
      cursor: pointer;
    }

    .form-actions {
      padding: 20px 24px;
      background-color: #f9fafb;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 14px;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #2563eb;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #1d4ed8;
    }

    .btn-secondary {
      background-color: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #4b5563;
    }

    .btn-outline {
      border: 1px solid #d1d5db;
      color: #374151;
      background: white;
    }

    .btn-outline:hover {
      background-color: #f9fafb;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-left: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-state,
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      text-align: center;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f4f6;
      border-left: 4px solid #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    .error-message {
      color: #dc2626;
    }

    .error-message i {
      font-size: 48px;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .admin-news-form {
        padding: 16px;
      }
      
      .header-content {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class AdminNewsFormComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);
  private categoryService = inject(NewsCategoryService);

  isEdit = false;
  newsId: number | null = null;
  categories: NewsCategory[] = [];
  
  newsData: Partial<News> = {
    title: '',
    content: '',
    thumbnail: '',
    categoryId: undefined,
    hide: false
  };
  
  timeActiveInput = '';
  
  isLoading = false;
  isSaving = false;
  error: string | null = null;

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.newsId = +params['id'];
        this.loadNews();
      }
    });
    
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadNews() {
    if (!this.newsId) return;
    
    this.isLoading = true;
    this.error = null;

    this.newsService.getNewsById(this.newsId).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.newsData = response.data;
          
          // Convert timeActive to input format
          if (response.data.timeActive) {
            const date = new Date(response.data.timeActive);
            this.timeActiveInput = date.toISOString().slice(0, 16);
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = 'Không tìm thấy tin tức hoặc có lỗi xảy ra';
        console.error('Error loading news:', error);
      }
    });
  }

  onSubmit() {
    if (!this.newsData.title || !this.newsData.content) {
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung');
      return;
    }

    this.isSaving = true;

    // Prepare data
    const submitData = { ...this.newsData };
    
    // Convert timeActive
    if (this.timeActiveInput) {
      submitData.timeActive = new Date(this.timeActiveInput);
    }

    const request = this.isEdit && this.newsId
      ? this.newsService.updateNews(this.newsId, submitData)
      : this.newsService.createNews(submitData);

    request.subscribe({
      next: (response) => {
        this.isSaving = false;
        if (response.success) {
          alert(this.isEdit ? 'Cập nhật tin tức thành công!' : 'Tạo tin tức thành công!');
          this.router.navigate(['/admin/news']);
        }
      },
      error: (error) => {
        this.isSaving = false;
        alert('Có lỗi xảy ra khi lưu tin tức');
        console.error('Error saving news:', error);
      }
    });
  }

  onCancel() {
    if (confirm('Bạn có chắc chắn muốn hủy? Các thay đổi sẽ không được lưu.')) {
      this.router.navigate(['/admin/news']);
    }
  }
}
