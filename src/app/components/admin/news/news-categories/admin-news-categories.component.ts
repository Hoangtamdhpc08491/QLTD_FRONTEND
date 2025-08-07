import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsCategory } from '../../../../models/news.interface';
import { NewsCategoryService } from '../../../../services/news-category.service';

@Component({
  selector: 'app-admin-news-categories',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-categories">
      <div class="page-header">
        <div class="header-content">
          <h1>Quản lý danh mục tin tức</h1>
          <button (click)="showCreateForm()" class="btn btn-primary">
            <i class="fas fa-plus"></i>
            Thêm danh mục mới
          </button>
        </div>
      </div>

      <!-- Create/Edit Form -->
      <div class="category-form-card" *ngIf="showForm">
        <div class="form-header">
          <h3>{{isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}}</h3>
          <button (click)="hideForm()" class="btn-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form (ngSubmit)="onSubmit()" class="category-form">
          <div class="form-group">
            <label for="name">Tên danh mục <span class="required">*</span></label>
            <input 
              type="text" 
              id="name"
              [(ngModel)]="categoryData.name"
              name="name"
              required
              class="form-input"
              placeholder="Nhập tên danh mục">
          </div>
          
          <div class="form-group">
            <label for="description">Mô tả</label>
            <textarea 
              id="description"
              [(ngModel)]="categoryData.description"
              name="description"
              rows="3"
              class="form-textarea"
              placeholder="Nhập mô tả danh mục"></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" (click)="hideForm()" class="btn btn-outline">
              Hủy
            </button>
            <button type="submit" [disabled]="isSaving" class="btn btn-primary">
              <span *ngIf="isSaving" class="spinner"></span>
              {{isSaving ? 'Đang lưu...' : (isEdit ? 'Cập nhật' : 'Tạo mới')}}
            </button>
          </div>
        </form>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Đang tải danh sách danh mục...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error && !isLoading" class="error-state">
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>{{error}}</p>
          <button (click)="loadCategories()" class="btn btn-primary">Thử lại</button>
        </div>
      </div>

      <!-- Categories Table -->
      <div class="table-container" *ngIf="!isLoading && !error">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên danh mục</th>
              <th>Mô tả</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let category of categories">
              <td>{{category.id}}</td>
              <td class="category-name">{{category.name}}</td>
              <td class="category-description">{{category.description || 'Không có mô tả'}}</td>
              <td>{{formatDate(category.createdAt)}}</td>
              <td class="actions-col">
                <div class="action-buttons">
                  <button (click)="editCategory(category)" 
                          class="btn btn-sm btn-outline-primary"
                          title="Chỉnh sửa">
                    <i class="fas fa-edit"></i>
                  </button>
                  
                  <button (click)="deleteCategory(category)" 
                          class="btn btn-sm btn-outline-danger"
                          title="Xóa">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div *ngIf="categories.length === 0" class="empty-state">
          <div class="empty-content">
            <i class="fas fa-folder-open"></i>
            <h3>Chưa có danh mục nào</h3>
            <p>Bạn chưa tạo danh mục nào. Hãy tạo danh mục đầu tiên!</p>
            <button (click)="showCreateForm()" class="btn btn-primary">
              <i class="fas fa-plus"></i>
              Thêm danh mục mới
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-categories {
      padding: 24px;
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

    .category-form-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 24px;
      overflow: hidden;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
      background-color: #f9fafb;
    }

    .form-header h3 {
      margin: 0;
      color: #1f2937;
    }

    .btn-close {
      background: none;
      border: none;
      color: #6b7280;
      font-size: 18px;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .btn-close:hover {
      background-color: #e5e7eb;
      color: #374151;
    }

    .category-form {
      padding: 24px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-weight: 500;
      margin-bottom: 6px;
      color: #374151;
    }

    .required {
      color: #dc2626;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .form-input:focus,
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

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
    }

    .admin-table th,
    .admin-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    .admin-table th {
      background-color: #f9fafb;
      font-weight: 600;
      color: #374151;
    }

    .category-name {
      font-weight: 500;
      color: #1f2937;
    }

    .category-description {
      color: #6b7280;
      max-width: 300px;
    }

    .actions-col {
      width: 100px;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
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

    .btn-outline {
      border: 1px solid #d1d5db;
      color: #374151;
      background: white;
    }

    .btn-outline:hover {
      background-color: #f9fafb;
    }

    .btn-sm {
      padding: 6px 8px;
      font-size: 12px;
    }

    .btn-outline-primary {
      border: 1px solid #2563eb;
      color: #2563eb;
      background: white;
    }

    .btn-outline-primary:hover {
      background-color: #2563eb;
      color: white;
    }

    .btn-outline-danger {
      border: 1px solid #dc2626;
      color: #dc2626;
      background: white;
    }

    .btn-outline-danger:hover {
      background-color: #dc2626;
      color: white;
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
    .error-state,
    .empty-state {
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

    .empty-content i,
    .error-message i {
      font-size: 48px;
      color: #9ca3af;
      margin-bottom: 16px;
    }

    .error-message {
      color: #dc2626;
    }

    .error-message i {
      color: #dc2626;
    }

    @media (max-width: 768px) {
      .admin-categories {
        padding: 16px;
      }
      
      .header-content {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .admin-table {
        font-size: 12px;
      }
      
      .category-description {
        max-width: 200px;
      }
    }
  `]
})
export class AdminNewsCategoriesComponent implements OnInit {
  private categoryService = inject(NewsCategoryService);

  categories: NewsCategory[] = [];
  
  showForm = false;
  isEdit = false;
  editingId: number | null = null;
  
  categoryData: Partial<NewsCategory> = {
    name: '',
    description: ''
  };
  
  isLoading = false;
  isSaving = false;
  error: string | null = null;

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.error = null;

    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.categories = response.data;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = 'Có lỗi xảy ra khi tải danh sách danh mục';
        console.error('Error loading categories:', error);
      }
    });
  }

  showCreateForm() {
    this.isEdit = false;
    this.editingId = null;
    this.categoryData = {
      name: '',
      description: ''
    };
    this.showForm = true;
  }

  editCategory(category: NewsCategory) {
    this.isEdit = true;
    this.editingId = category.id;
    this.categoryData = { ...category };
    this.showForm = true;
  }

  hideForm() {
    this.showForm = false;
    this.isEdit = false;
    this.editingId = null;
    this.categoryData = {
      name: '',
      description: ''
    };
  }

  onSubmit() {
    if (!this.categoryData.name?.trim()) {
      alert('Vui lòng nhập tên danh mục');
      return;
    }

    this.isSaving = true;

    const request = this.isEdit && this.editingId
      ? this.categoryService.updateCategory(this.editingId, this.categoryData)
      : this.categoryService.createCategory(this.categoryData);

    request.subscribe({
      next: (response) => {
        this.isSaving = false;
        if (response.success) {
          alert(this.isEdit ? 'Cập nhật danh mục thành công!' : 'Tạo danh mục thành công!');
          this.hideForm();
          this.loadCategories();
        }
      },
      error: (error) => {
        this.isSaving = false;
        alert('Có lỗi xảy ra khi lưu danh mục');
        console.error('Error saving category:', error);
      }
    });
  }

  deleteCategory(category: NewsCategory) {
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Xóa danh mục thành công!');
            this.loadCategories();
          }
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          alert('Có lỗi xảy ra khi xóa danh mục. Có thể danh mục đang được sử dụng.');
        }
      });
    }
  }

  formatDate(date?: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  }
}
