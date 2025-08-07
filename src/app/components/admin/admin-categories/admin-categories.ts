import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService, Category } from '../../../services/category.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="admin-categories">
      <div class="page-header">
        <h1>Quản lý Danh mục</h1>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <i class="fas fa-plus"></i> Thêm danh mục
        </button>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Đang tải...</p>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="error-message">
        <p>{{error}}</p>
        <button class="btn btn-secondary" (click)="loadCategories()">Thử lại</button>
      </div>

      <!-- Categories Table -->
      <div *ngIf="!loading && !error" class="table-container">
        <table class="data-table">
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
              <td>{{category.name}}</td>
              <td>{{category.description || 'Không có mô tả'}}</td>
              <td>{{formatDate(category.createdAt || '')}}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-warning" (click)="openEditModal(category)">
                    <i class="fas fa-edit"></i> Sửa
                  </button>
                  <button class="btn btn-sm btn-danger" (click)="confirmDelete(category)">
                    <i class="fas fa-trash"></i> Xóa
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="categories.length === 0" class="empty-state">
          <p>Chưa có danh mục nào</p>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{isEditMode ? 'Sửa danh mục' : 'Thêm danh mục'}}</h3>
            <button class="close-btn" (click)="closeModal()">&times;</button>
          </div>
          
          <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="modal-body">
            <div class="form-group">
              <label for="name">Tên danh mục *</label>
              <input 
                type="text" 
                id="name" 
                formControlName="name"
                class="form-control"
                [class.error]="categoryForm.get('name')?.invalid && categoryForm.get('name')?.touched"
              >
              <div *ngIf="categoryForm.get('name')?.invalid && categoryForm.get('name')?.touched" class="error-text">
                Tên danh mục là bắt buộc
              </div>
            </div>

            <div class="form-group">
              <label for="description">Mô tả</label>
              <textarea 
                id="description" 
                formControlName="description"
                class="form-control"
                rows="3"
                placeholder="Mô tả danh mục (tùy chọn)"
              ></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Hủy</button>
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="categoryForm.invalid || submitting"
              >
                {{submitting ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Tạo mới')}}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteModal" class="modal-overlay" (click)="closeDeleteModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Xác nhận xóa</h3>
            <button class="close-btn" (click)="closeDeleteModal()">&times;</button>
          </div>
          
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa danh mục "<strong>{{categoryToDelete?.name}}</strong>"?</p>
            <p class="warning-text">Hành động này không thể hoàn tác!</p>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeDeleteModal()">Hủy</button>
            <button 
              type="button" 
              class="btn btn-danger"
              [disabled]="deleting"
              (click)="deleteCategory()"
            >
              {{deleting ? 'Đang xóa...' : 'Xóa'}}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-categories {
      padding: 20px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e0e0e0;
    }

    .page-header h1 {
      margin: 0;
      color: #2c3e50;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover {
      background: #2980b9;
    }

    .btn-secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-warning {
      background: #f39c12;
      color: white;
    }

    .btn-danger {
      background: #e74c3c;
      color: white;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
    }

    .loading {
      text-align: center;
      padding: 50px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 15px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-message {
      text-align: center;
      padding: 30px;
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      color: #721c24;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th,
    .data-table td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }

    .data-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #2c3e50;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .empty-state {
      text-align: center;
      padding: 50px;
      color: #7f8c8d;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      min-width: 500px;
      max-width: 90vw;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 20px 15px;
      border-bottom: 1px solid #e0e0e0;
    }

    .modal-header h3 {
      margin: 0;
      color: #2c3e50;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #7f8c8d;
    }

    .modal-body {
      padding: 20px;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 15px 20px 20px;
      border-top: 1px solid #e0e0e0;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #2c3e50;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.3s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
    }

    .form-control.error {
      border-color: #e74c3c;
    }

    .error-text {
      color: #e74c3c;
      font-size: 12px;
      margin-top: 5px;
    }

    .warning-text {
      color: #e67e22;
      font-style: italic;
      margin-top: 10px;
    }
  `]
})
export class AdminCategories implements OnInit {
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);

  categories: Category[] = [];
  loading = false;
  error: string | null = null;
  
  // Modal states
  showModal = false;
  showDeleteModal = false;
  isEditMode = false;
  submitting = false;
  deleting = false;
  
  // Selected items
  selectedCategory: Category | null = null;
  categoryToDelete: Category | null = null;
  
  // Form
  categoryForm: FormGroup;

  constructor() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.error = null;
    
    this.categoryService.getAdminCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data;
        } else {
          this.error = response.message;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.error = 'Không thể tải danh sách danh mục';
        this.loading = false;
      }
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.selectedCategory = null;
    this.categoryForm.reset();
    this.showModal = true;
  }

  openEditModal(category: Category) {
    this.isEditMode = true;
    this.selectedCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description || ''
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedCategory = null;
    this.categoryForm.reset();
  }

  onSubmit() {
    if (this.categoryForm.invalid) return;

    this.submitting = true;
    const formData = this.categoryForm.value;

    if (this.isEditMode && this.selectedCategory) {
      // Update existing category
      this.categoryService.updateCategory(this.selectedCategory.id, formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadCategories();
            this.closeModal();
          } else {
            this.error = response.message;
          }
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error updating category:', error);
          this.error = 'Không thể cập nhật danh mục';
          this.submitting = false;
        }
      });
    } else {
      // Create new category
      this.categoryService.createCategory(formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadCategories();
            this.closeModal();
          } else {
            this.error = response.message;
          }
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error creating category:', error);
          this.error = 'Không thể tạo danh mục';
          this.submitting = false;
        }
      });
    }
  }

  confirmDelete(category: Category) {
    this.categoryToDelete = category;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.categoryToDelete = null;
  }

  deleteCategory() {
    if (!this.categoryToDelete) return;

    this.deleting = true;
    
    this.categoryService.deleteCategory(this.categoryToDelete.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadCategories();
          this.closeDeleteModal();
        } else {
          this.error = response.message;
        }
        this.deleting = false;
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this.error = 'Không thể xóa danh mục';
        this.deleting = false;
      }
    });
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';
    try {
      return new Intl.DateTimeFormat('vi-VN').format(new Date(date));
    } catch {
      return 'N/A';
    }
  }
}
