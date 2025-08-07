import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { News, NewsCategory } from '../../../../models/news.interface';
import { NewsService } from '../../../../services/news.service';
import { NewsCategoryService } from '../../../../services/news-category.service';

@Component({
  selector: 'app-admin-news-list',
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-news-list">
      <div class="page-header">
        <div class="header-content">
          <h1>Quản lý tin tức</h1>
          <a routerLink="/admin/news/create" class="btn btn-primary">
            <i class="fas fa-plus"></i>
            Thêm tin tức mới
          </a>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filters-row">
          <div class="filter-group">
            <label>Tìm kiếm:</label>
            <input 
              type="text" 
              [(ngModel)]="searchTerm"
              (keyup.enter)="onSearch()"
              placeholder="Nhập tiêu đề tin tức..."
              class="form-input">
          </div>
          
          <div class="filter-group">
            <label>Danh mục:</label>
            <select [(ngModel)]="selectedCategory" (change)="onCategoryChange()" class="form-select">
              <option [value]="null">Tất cả danh mục</option>
              <option *ngFor="let category of categories" [value]="category.id">
                {{category.name}}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Trạng thái:</label>
            <select [(ngModel)]="selectedStatus" (change)="onStatusChange()" class="form-select">
              <option value="">Tất cả</option>
              <option value="visible">Hiển thị</option>
              <option value="hidden">Ẩn</option>
            </select>
          </div>
          
          <button (click)="onSearch()" class="btn btn-secondary">
            <i class="fas fa-search"></i>
            Tìm kiếm
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Đang tải danh sách tin tức...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error && !isLoading" class="error-state">
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>{{error}}</p>
          <button (click)="loadNews()" class="btn btn-primary">Thử lại</button>
        </div>
      </div>

      <!-- News Table -->
      <div class="table-container" *ngIf="!isLoading && !error">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Danh mục</th>
              <th>Người tạo</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let news of newsList">
              <td>{{news.id}}</td>
              <td class="news-title-col">
                <div class="news-title-content">
                  <h4>{{news.title}}</h4>
                  <p class="news-excerpt">{{news.content | slice:0:100}}...</p>
                </div>
              </td>
              <td>
                <span class="category-badge">
                  {{getCategoryName(news.categoryId)}}
                </span>
              </td>
              <td>{{news.uploadBy || 'N/A'}}</td>
              <td>{{formatDate(news.createAt)}}</td>
              <td>
                <span class="status-badge" [class]="news.hide ? 'status-hidden' : 'status-visible'">
                  {{news.hide ? 'Ẩn' : 'Hiển thị'}}
                </span>
              </td>
              <td class="actions-col">
                <div class="action-buttons">
                  <a [routerLink]="['/admin/news', news.id, 'edit']" 
                     class="btn btn-sm btn-outline-primary"
                     title="Chỉnh sửa">
                    <i class="fas fa-edit"></i>
                  </a>
                  
                  <button (click)="toggleVisibility(news)" 
                          class="btn btn-sm btn-outline-warning"
                          [title]="news.hide ? 'Hiển thị' : 'Ẩn'">
                    <i class="fas" [class]="news.hide ? 'fa-eye' : 'fa-eye-slash'"></i>
                  </button>
                  
                  <button (click)="deleteNews(news)" 
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
        <div *ngIf="newsList.length === 0" class="empty-state">
          <div class="empty-content">
            <i class="fas fa-newspaper"></i>
            <h3>Chưa có tin tức nào</h3>
            <p>Bạn chưa tạo tin tức nào. Hãy tạo tin tức đầu tiên!</p>
            <a routerLink="/admin/news/create" class="btn btn-primary">
              <i class="fas fa-plus"></i>
              Thêm tin tức mới
            </a>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination-wrapper" *ngIf="totalPages > 1">
        <nav class="pagination">
          <button 
            class="pagination-btn"
            [disabled]="currentPage === 1"
            (click)="onPageChange(currentPage - 1)">
            <i class="fas fa-chevron-left"></i>
            Trước
          </button>
          
          <div class="pagination-numbers">
            <button 
              *ngFor="let page of getPaginationPages()"
              class="pagination-number"
              [class.active]="page === currentPage"
              (click)="onPageChange(page)">
              {{page}}
            </button>
          </div>
          
          <button 
            class="pagination-btn"
            [disabled]="currentPage === totalPages"
            (click)="onPageChange(currentPage + 1)">
            Sau
            <i class="fas fa-chevron-right"></i>
          </button>
        </nav>
        
        <div class="pagination-info">
          Hiển thị {{(currentPage - 1) * itemsPerPage + 1}} - 
          {{currentPage * itemsPerPage > totalItems ? totalItems : currentPage * itemsPerPage}} 
          trong tổng số {{totalItems}} tin tức
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-news-list {
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

    .filters-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 24px;
    }

    .filters-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr auto;
      gap: 16px;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
    }

    .filter-group label {
      font-weight: 500;
      margin-bottom: 4px;
      color: #374151;
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

    .news-title-col {
      max-width: 300px;
    }

    .news-title-content h4 {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 600;
    }

    .news-excerpt {
      margin: 0;
      font-size: 12px;
      color: #6b7280;
    }

    .category-badge {
      display: inline-block;
      padding: 4px 8px;
      background-color: #e0f2fe;
      color: #0369a1;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-visible {
      background-color: #dcfce7;
      color: #166534;
    }

    .status-hidden {
      background-color: #fef3c7;
      color: #92400e;
    }

    .actions-col {
      width: 140px;
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
    }

    .btn-primary {
      background-color: #2563eb;
      color: white;
    }

    .btn-primary:hover {
      background-color: #1d4ed8;
    }

    .btn-secondary {
      background-color: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #4b5563;
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

    .btn-outline-warning {
      border: 1px solid #d97706;
      color: #d97706;
      background: white;
    }

    .btn-outline-warning:hover {
      background-color: #d97706;
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

    .form-input,
    .form-select {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
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

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .empty-content i {
      font-size: 48px;
      color: #9ca3af;
      margin-bottom: 16px;
    }

    .pagination-wrapper {
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .pagination {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .pagination-btn,
    .pagination-number {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      background: white;
      color: #374151;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination-number.active {
      background-color: #2563eb;
      color: white;
      border-color: #2563eb;
    }

    .pagination-numbers {
      display: flex;
      gap: 4px;
    }

    .pagination-info {
      color: #6b7280;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .filters-row {
        grid-template-columns: 1fr;
      }
      
      .header-content {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
      
      .admin-table {
        font-size: 12px;
      }
      
      .pagination-wrapper {
        flex-direction: column;
        gap: 16px;
      }
    }
  `]
})
export class AdminNewsListComponent implements OnInit {
  private newsService = inject(NewsService);
  private categoryService = inject(NewsCategoryService);

  newsList: News[] = [];
  categories: NewsCategory[] = [];
  
  // Filters
  searchTerm = '';
  selectedCategory: number | null = null;
  selectedStatus = '';
  
  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 10;
  
  isLoading = false;
  error: string | null = null;

  ngOnInit() {
    this.loadCategories();
    this.loadNews();
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
    this.isLoading = true;
    this.error = null;

    const params = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      ...(this.selectedCategory && { categoryId: this.selectedCategory }),
      ...(this.searchTerm && { search: this.searchTerm }),
      ...(this.selectedStatus && { status: this.selectedStatus === 'hidden' ? 'hidden' : 'visible' })
    };

    this.newsService.getAllNews(params).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.newsList = response.data;
          if (response.pagination) {
            this.currentPage = response.pagination.currentPage;
            this.totalPages = response.pagination.totalPages;
            this.totalItems = response.pagination.totalItems;
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = 'Có lỗi xảy ra khi tải danh sách tin tức';
        console.error('Error loading news:', error);
      }
    });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadNews();
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.loadNews();
  }

  onStatusChange() {
    this.currentPage = 1;
    this.loadNews();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadNews();
  }

  toggleVisibility(news: News) {
    if (confirm(`Bạn có muốn ${news.hide ? 'hiển thị' : 'ẩn'} tin tức này?`)) {
      this.newsService.toggleVisibility(news.id).subscribe({
        next: (response) => {
          if (response.success) {
            news.hide = response.data.hidden;
          }
        },
        error: (error) => {
          console.error('Error toggling visibility:', error);
          alert('Có lỗi xảy ra khi thay đổi trạng thái tin tức');
        }
      });
    }
  }

  deleteNews(news: News) {
    if (confirm(`Bạn có chắc chắn muốn xóa tin tức "${news.title}"?`)) {
      this.newsService.deleteNews(news.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadNews(); // Reload the list
          }
        },
        error: (error) => {
          console.error('Error deleting news:', error);
          alert('Có lỗi xảy ra khi xóa tin tức');
        }
      });
    }
  }

  getPaginationPages(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getCategoryName(categoryId?: number): string {
    if (!categoryId) return 'Chưa phân loại';
    const category = this.categories.find(c => c.id === categoryId);
    return category?.name || 'Chưa phân loại';
  }

  formatDate(date?: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  }
}
