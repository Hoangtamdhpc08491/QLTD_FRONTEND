import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanPackageService, LoanPackage } from '../../../services/loan-package.service';
import { CategoryService, Category } from '../../../services/category.service';

@Component({
  selector: 'app-admin-loan-packages',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="admin-loan-packages">
      <div class="page-header">
        <h1>Quản lý Gói vay</h1>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <i class="fas fa-plus"></i> Thêm gói vay
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
        <button class="btn btn-secondary" (click)="loadLoanPackages()">Thử lại</button>
      </div>

      <!-- Loan Packages Table -->
      <div *ngIf="!loading && !error" class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên gói vay</th>
              <th>Lãi suất cơ bản</th>
              <th>Lãi suất cấp 2</th>
              <th>Lãi suất cấp 3</th>
              <th>Danh mục</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let package of loanPackages">
              <td>{{package.id}}</td>
              <td>{{package.name}}</td>
              <td>{{package.baseInterestRate}}%</td>
              <td>{{package.interestRate2}}%</td>
              <td>{{package.interestRate3}}%</td>
              <td>{{package.category?.name || 'Không có'}}</td>
              <td>{{formatDate(package.createdAt)}}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-warning" (click)="openEditModal(package)">
                    <i class="fas fa-edit"></i> Sửa
                  </button>
                  <button class="btn btn-sm btn-danger" (click)="confirmDelete(package)">
                    <i class="fas fa-trash"></i> Xóa
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="loanPackages.length === 0" class="empty-state">
          <p>Chưa có gói vay nào</p>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div *ngIf="showModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{isEditMode ? 'Sửa gói vay' : 'Thêm gói vay'}}</h3>
            <button class="close-btn" (click)="closeModal()">&times;</button>
          </div>
          
          <form [formGroup]="loanPackageForm" (ngSubmit)="onSubmit()" class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Tên gói vay *</label>
                <input 
                  type="text" 
                  id="name" 
                  formControlName="name"
                  class="form-control"
                  [class.error]="loanPackageForm.get('name')?.invalid && loanPackageForm.get('name')?.touched"
                >
                <div *ngIf="loanPackageForm.get('name')?.invalid && loanPackageForm.get('name')?.touched" class="error-text">
                  Tên gói vay là bắt buộc
                </div>
              </div>

              <div class="form-group">
                <label for="categoryId">Danh mục</label>
                <select id="categoryId" formControlName="categoryId" class="form-control">
                  <option value="">-- Chọn danh mục --</option>
                  <option *ngFor="let category of categories" [value]="category.id">
                    {{category.name}}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="baseInterestRate">Lãi suất cơ bản (%) *</label>
                <input 
                  type="number" 
                  id="baseInterestRate" 
                  formControlName="baseInterestRate"
                  class="form-control"
                  step="0.1"
                  min="0"
                  max="100"
                  [class.error]="loanPackageForm.get('baseInterestRate')?.invalid && loanPackageForm.get('baseInterestRate')?.touched"
                >
                <div *ngIf="loanPackageForm.get('baseInterestRate')?.invalid && loanPackageForm.get('baseInterestRate')?.touched" class="error-text">
                  Lãi suất cơ bản là bắt buộc và phải từ 0-100%
                </div>
              </div>

              <div class="form-group">
                <label for="interestRate2">Lãi suất cấp 2 (%)</label>
                <input 
                  type="number" 
                  id="interestRate2" 
                  formControlName="interestRate2"
                  class="form-control"
                  step="0.1"
                  min="0"
                  max="100"
                >
                <div *ngIf="loanPackageForm.get('interestRate2')?.invalid && loanPackageForm.get('interestRate2')?.touched" class="error-text">
                  Lãi suất cấp 2 phải từ 0-100%
                </div>
              </div>
              <div class="form-group">
                <label for="interestRate3">Lãi suất cấp 3 (%)</label>
                <input 
                  type="number" 
                  id="interestRate3" 
                  formControlName="interestRate3"
                  class="form-control"
                  step="0.1"
                  min="0"
                  max="100"
                >
                <div *ngIf="loanPackageForm.get('interestRate3')?.invalid && loanPackageForm.get('interestRate3')?.touched" class="error-text">
                  Lãi suất cấp 3 phải từ 0-100%
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="maxAmount">Số tiền tối đa (VND) *</label>
              <input 
                type="number" 
                id="maxAmount" 
                formControlName="maxAmount"
                class="form-control"
                step="1000"
                min="0"
                [class.error]="loanPackageForm.get('maxAmount')?.invalid && loanPackageForm.get('maxAmount')?.touched"
              >
              <div *ngIf="loanPackageForm.get('maxAmount')?.invalid && loanPackageForm.get('maxAmount')?.touched" class="error-text">
                Số tiền tối đa là bắt buộc
              </div>
            </div>

            <div class="form-group">
              <label for="description1">Mô tả chính *</label>
              <textarea 
                id="description1" 
                formControlName="description1"
                class="form-control"
                rows="3"
                [class.error]="loanPackageForm.get('description1')?.invalid && loanPackageForm.get('description1')?.touched"
              ></textarea>
              <div *ngIf="loanPackageForm.get('description1')?.invalid && loanPackageForm.get('description1')?.touched" class="error-text">
                Mô tả chính là bắt buộc
              </div>
            </div>

            <div class="form-group">
              <label for="description2">Mô tả bổ sung</label>
              <textarea 
                id="description2" 
                formControlName="description2"
                class="form-control"
                rows="2"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="description3">Mô tả bổ sung 2</label>
              <textarea 
                id="description3" 
                formControlName="description3"
                class="form-control"
                rows="2"
              ></textarea>
              
            </div>
            <div class="form-group">
              <label for="description4">Mô tả bổ sung 3</label>
              <textarea 
                id="description4" 
                formControlName="description4"
                class="form-control"
                rows="2"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="description5">Mô tả bổ sung 4</label>
              <textarea 
                id="description5" 
                formControlName="description5"
                class="form-control"
                rows="2"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="description6">Mô tả bổ sung 5</label>
              <textarea 
                id="description6" 
                formControlName="description6"
                class="form-control"
                rows="2"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="image">Đường dẫn hình ảnh</label>
              <input 
                type="text" 
                id="image" 
                formControlName="image"
                class="form-control"
                placeholder="/images/package-name.jpg"
              >
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Hủy</button>
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="loanPackageForm.invalid || submitting"
              >
                {{submitting ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Tạo mới')}}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Xác nhận xóa</h3>
            <button class="close-btn" (click)="closeDeleteModal()">&times;</button>
          </div>
          
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa gói vay "<strong>{{packageToDelete?.name}}</strong>"?</p>
            <p class="warning-text">Hành động này không thể hoàn tác!</p>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeDeleteModal()">Hủy</button>
            <button 
              type="button" 
              class="btn btn-danger"
              [disabled]="deleting"
              (click)="deleteLoanPackage()"
            >
              {{deleting ? 'Đang xóa...' : 'Xóa'}}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-loan-packages {
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

    .btn-primary { background: #3498db; color: white; }
    .btn-secondary { background: #95a5a6; color: white; }
    .btn-warning { background: #f39c12; color: white; }
    .btn-danger { background: #e74c3c; color: white; }
    .btn-sm { padding: 4px 8px; font-size: 12px; }

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
      min-width: 600px;
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

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
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
export class AdminLoanPackages implements OnInit {
  private loanPackageService = inject(LoanPackageService);
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);

  loanPackages: LoanPackage[] = [];
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
  selectedPackage: LoanPackage | null = null;
  packageToDelete: LoanPackage | null = null;
  
  // Form
  loanPackageForm: FormGroup;

  constructor() {
    this.loanPackageForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      baseInterestRate: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      interestRate2: [''],
      interestRate3: [''],
      maxAmount: ['', [Validators.required]],
      description1: ['', [Validators.required]],
      description2: [''],
      description3: [''],
      description4: [''],
      description5: [''],
      description6: [''],
      image: [''],
      categoryId: ['']
    });
  }

  ngOnInit() {
    this.loadLoanPackages();
    this.loadCategories();
  }

  loadLoanPackages() {
    this.loading = true;
    this.error = null;
    
    this.loanPackageService.getAdminLoanPackages().subscribe({
      next: (response) => {
        if (response.success) {
          this.loanPackages = response.data;
        } else {
          this.error = response.message;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading loan packages:', error);
        this.error = 'Không thể tải danh sách gói vay';
        this.loading = false;
      }
    });
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

  openCreateModal() {
    this.isEditMode = false;
    this.selectedPackage = null;
    this.loanPackageForm.reset();
    this.showModal = true;
  }

  openEditModal(loanPackage: LoanPackage) {
    this.isEditMode = true;
    this.selectedPackage = loanPackage;
    this.loanPackageForm.patchValue({
      name: loanPackage.name,
      maxAmount: loanPackage.maxAmount,
      baseInterestRate: loanPackage.baseInterestRate,
      interestRate2: loanPackage.interestRate2 || '',
      interestRate3: loanPackage.interestRate3 || '',
      description1: loanPackage.description1,
      description2: loanPackage.description2 || '',
      description3: loanPackage.description3 || '',
      description4: loanPackage.description4 || '',
      description5: loanPackage.description5 || '',
      description6: loanPackage.description6 || '',
      image: loanPackage.image || '',
      categoryId: loanPackage.categoryId || ''
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedPackage = null;
    this.loanPackageForm.reset();
  }

  onSubmit() {
    if (this.loanPackageForm.invalid) return;

    this.submitting = true;
    const formData = this.loanPackageForm.value;

    // Convert empty strings to null for optional fields
    Object.keys(formData).forEach(key => {
      if (formData[key] === '') {
        formData[key] = null;
      }
    });

    if (this.isEditMode && this.selectedPackage) {
      // Update existing package
      this.loanPackageService.updateLoanPackage(this.selectedPackage.id, formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadLoanPackages();
            this.closeModal();
          } else {
            this.error = response.message;
          }
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error updating loan package:', error);
          this.error = 'Không thể cập nhật gói vay';
          this.submitting = false;
        }
      });
    } else {
      // Create new package
      this.loanPackageService.createLoanPackage(formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadLoanPackages();
            this.closeModal();
          } else {
            this.error = response.message;
          }
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error creating loan package:', error);
          this.error = 'Không thể tạo gói vay';
          this.submitting = false;
        }
      });
    }
  }

  confirmDelete(loanPackage: LoanPackage) {
    this.packageToDelete = loanPackage;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.packageToDelete = null;
  }

  deleteLoanPackage() {
    if (!this.packageToDelete) return;

    this.deleting = true;
    
    this.loanPackageService.deleteLoanPackage(this.packageToDelete.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadLoanPackages();
          this.closeDeleteModal();
        } else {
          this.error = response.message;
        }
        this.deleting = false;
      },
      error: (error) => {
        console.error('Error deleting loan package:', error);
        this.error = 'Không thể xóa gói vay';
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
