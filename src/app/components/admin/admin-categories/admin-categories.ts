import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Category {
  id: string;
  tenDanhMuc: string;
  moTa: string;
  loaiDanhMuc: string; // 'goi-vay' | 'tin-tuc' | 'ho-tro'
  thuTuHienThi: number;
  trangThai: string;
  ngayTao: Date;
  ngayCapNhat: Date;
  nguoiTao: string;
  soLuongBaiViet: number;
  icon: string;
  mauSac: string;
}

@Component({
  selector: 'app-admin-categories',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css'
})
export class AdminCategories implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  
  // Modal states
  showModal = false;
  showDeleteModal = false;
  modalTitle = '';
  isEditMode = false;
  selectedCategory: Category | null = null;
  categoryToDelete: Category | null = null;

  // Form data
  categoryForm: Partial<Category> = {};
  
  // Filters
  searchTerm = '';
  typeFilter = '';
  statusFilter = '';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  // Color options
  colorOptions = [
    { value: '#3498db', label: 'Xanh dương' },
    { value: '#2ecc71', label: 'Xanh lá' },
    { value: '#e74c3c', label: 'Đỏ' },
    { value: '#f39c12', label: 'Cam' },
    { value: '#9b59b6', label: 'Tím' },
    { value: '#1abc9c', label: 'Xanh ngọc' },
    { value: '#34495e', label: 'Xám đen' },
    { value: '#e67e22', label: 'Cam đậm' }
  ];

  // Icon options
  iconOptions = [
    '💰', '🏠', '🚗', '🎓', '💼', '📊', '📋', '📝',
    '🏛️', '💳', '📈', '🔔', '⚡', '🎯', '📱', '💻'
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    // Mock data - thực tế sẽ gọi API
    this.categories = [
      {
        id: 'CAT001',
        tenDanhMuc: 'Vay Cá Nhân',
        moTa: 'Các gói vay dành cho nhu cầu cá nhân',
        loaiDanhMuc: 'goi-vay',
        thuTuHienThi: 1,
        trangThai: 'Hoạt động',
        ngayTao: new Date('2024-01-15'),
        ngayCapNhat: new Date('2025-01-20'),
        nguoiTao: 'Admin01',
        soLuongBaiViet: 5,
        icon: '💰',
        mauSac: '#3498db'
      },
      {
        id: 'CAT002',
        tenDanhMuc: 'Vay Bất Động Sản',
        moTa: 'Các gói vay mua nhà, đất',
        loaiDanhMuc: 'goi-vay',
        thuTuHienThi: 2,
        trangThai: 'Hoạt động',
        ngayCapNhat: new Date('2025-01-18'),
        ngayTao: new Date('2024-02-01'),
        nguoiTao: 'Admin02',
        soLuongBaiViet: 3,
        icon: '🏠',
        mauSac: '#2ecc71'
      },
      {
        id: 'CAT003',
        tenDanhMuc: 'Vay Kinh Doanh',
        moTa: 'Các gói vay dành cho doanh nghiệp',
        loaiDanhMuc: 'goi-vay',
        thuTuHienThi: 3,
        trangThai: 'Hoạt động',
        ngayTao: new Date('2024-02-15'),
        ngayCapNhat: new Date('2025-01-15'),
        nguoiTao: 'Admin01',
        soLuongBaiViet: 4,
        icon: '💼',
        mauSac: '#e74c3c'
      },
      {
        id: 'CAT004',
        tenDanhMuc: 'Tin Tức Ngân Hàng',
        moTa: 'Tin tức và cập nhật từ ngành ngân hàng',
        loaiDanhMuc: 'tin-tuc',
        thuTuHienThi: 1,
        trangThai: 'Hoạt động',
        ngayTao: new Date('2024-03-01'),
        ngayCapNhat: new Date('2025-01-12'),
        nguoiTao: 'Admin03',
        soLuongBaiViet: 12,
        icon: '📊',
        mauSac: '#f39c12'
      },
      {
        id: 'CAT005',
        tenDanhMuc: 'Hướng Dẫn Vay Vốn',
        moTa: 'Các bài viết hướng dẫn về vay vốn',
        loaiDanhMuc: 'tin-tuc',
        thuTuHienThi: 2,
        trangThai: 'Hoạt động',
        ngayTao: new Date('2024-03-15'),
        ngayCapNhat: new Date('2025-01-10'),
        nguoiTao: 'Admin02',
        soLuongBaiViet: 8,
        icon: '📝',
        mauSac: '#9b59b6'
      },
      {
        id: 'CAT006',
        tenDanhMuc: 'Chính Sách & Quy Định',
        moTa: 'Thông tin về chính sách và quy định',
        loaiDanhMuc: 'tin-tuc',
        thuTuHienThi: 3,
        trangThai: 'Hoạt động',
        ngayTao: new Date('2024-04-01'),
        ngayCapNhat: new Date('2025-01-08'),
        nguoiTao: 'Admin01',
        soLuongBaiViet: 6,
        icon: '📋',
        mauSac: '#1abc9c'
      },
      {
        id: 'CAT007',
        tenDanhMuc: 'Hỗ Trợ Kỹ Thuật',
        moTa: 'Hướng dẫn sử dụng hệ thống',
        loaiDanhMuc: 'ho-tro',
        thuTuHienThi: 1,
        trangThai: 'Hoạt động',
        ngayTao: new Date('2024-04-15'),
        ngayCapNhat: new Date('2025-01-05'),
        nguoiTao: 'Admin03',
        soLuongBaiViet: 4,
        icon: '💻',
        mauSac: '#34495e'
      },
      {
        id: 'CAT008',
        tenDanhMuc: 'FAQ',
        moTa: 'Câu hỏi thường gặp',
        loaiDanhMuc: 'ho-tro',
        thuTuHienThi: 2,
        trangThai: 'Tạm dừng',
        ngayTao: new Date('2024-05-01'),
        ngayCapNhat: new Date('2025-01-03'),
        nguoiTao: 'Admin02',
        soLuongBaiViet: 15,
        icon: '❓',
        mauSac: '#e67e22'
      }
    ];

    this.applyFilters();
  }

  applyFilters() {
    this.filteredCategories = this.categories.filter(cat => {
      const matchesSearch = !this.searchTerm || 
        cat.tenDanhMuc.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cat.moTa.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cat.id.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesType = !this.typeFilter || cat.loaiDanhMuc === this.typeFilter;
      const matchesStatus = !this.statusFilter || cat.trangThai === this.statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });

    // Sort by type first, then by display order
    this.filteredCategories.sort((a, b) => {
      if (a.loaiDanhMuc !== b.loaiDanhMuc) {
        return a.loaiDanhMuc.localeCompare(b.loaiDanhMuc);
      }
      return a.thuTuHienThi - b.thuTuHienThi;
    });

    this.totalPages = Math.ceil(this.filteredCategories.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  getPaginatedCategories(): Category[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCategories.slice(startIndex, endIndex);
  }

  getMaxItemDisplay(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredCategories.length);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // CRUD Operations
  openCreateModal() {
    this.isEditMode = false;
    this.modalTitle = 'Thêm Danh Mục Mới';
    this.categoryForm = {
      trangThai: 'Hoạt động',
      thuTuHienThi: this.categories.length + 1,
      icon: '📝',
      mauSac: '#3498db',
      loaiDanhMuc: 'tin-tuc'
    };
    this.showModal = true;
  }

  openEditModal(cat: Category) {
    this.isEditMode = true;
    this.modalTitle = 'Chỉnh Sửa Danh Mục';
    this.selectedCategory = cat;
    this.categoryForm = { ...cat };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedCategory = null;
    this.categoryForm = {};
  }

  saveCategory() {
    if (this.isEditMode && this.selectedCategory) {
      // Update existing category
      const index = this.categories.findIndex(c => c.id === this.selectedCategory!.id);
      if (index !== -1) {
        this.categories[index] = {
          ...this.categories[index],
          ...this.categoryForm as Category,
          ngayCapNhat: new Date()
        };
      }
    } else {
      // Create new category
      const newId = 'CAT' + String(this.categories.length + 1).padStart(3, '0');
      const newCategory: Category = {
        ...this.categoryForm as Category,
        id: newId,
        ngayTao: new Date(),
        ngayCapNhat: new Date(),
        nguoiTao: 'Current Admin',
        soLuongBaiViet: 0
      };
      this.categories.push(newCategory);
    }

    this.applyFilters();
    this.closeModal();
  }

  openDeleteModal(cat: Category) {
    this.categoryToDelete = cat;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.categoryToDelete = null;
  }

  confirmDelete() {
    if (this.categoryToDelete) {
      this.categories = this.categories.filter(c => c.id !== this.categoryToDelete!.id);
      this.applyFilters();
      this.closeDeleteModal();
    }
  }

  // Utility methods
  getTypeLabel(type: string): string {
    switch (type) {
      case 'goi-vay': return 'Gói Vay';
      case 'tin-tuc': return 'Tin Tức';
      case 'ho-tro': return 'Hỗ Trợ';
      default: return type;
    }
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'goi-vay': return 'type-loan';
      case 'tin-tuc': return 'type-news';
      case 'ho-tro': return 'type-support';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Hoạt động': return 'status-active';
      case 'Tạm dừng': return 'status-inactive';
      case 'Ngừng hoạt động': return 'status-disabled';
      default: return '';
    }
  }

  toggleStatus(cat: Category) {
    if (cat.trangThai === 'Hoạt động') {
      cat.trangThai = 'Tạm dừng';
    } else if (cat.trangThai === 'Tạm dừng') {
      cat.trangThai = 'Hoạt động';
    }
    cat.ngayCapNhat = new Date();
    this.applyFilters();
  }

  reorderCategory(cat: Category, direction: 'up' | 'down') {
    const sameTypeCategories = this.categories.filter(c => 
      c.loaiDanhMuc === cat.loaiDanhMuc && c.id !== cat.id
    );
    
    if (direction === 'up' && cat.thuTuHienThi > 1) {
      const previousCat = sameTypeCategories.find(c => 
        c.thuTuHienThi === cat.thuTuHienThi - 1
      );
      if (previousCat) {
        previousCat.thuTuHienThi = cat.thuTuHienThi;
        cat.thuTuHienThi = cat.thuTuHienThi - 1;
      }
    } else if (direction === 'down') {
      const nextCat = sameTypeCategories.find(c => 
        c.thuTuHienThi === cat.thuTuHienThi + 1
      );
      if (nextCat) {
        nextCat.thuTuHienThi = cat.thuTuHienThi;
        cat.thuTuHienThi = cat.thuTuHienThi + 1;
      }
    }
    
    this.applyFilters();
  }

  viewContent(categoryId: string, type: string) {
    if (type === 'goi-vay') {
      this.router.navigate(['/admin/loan-packages'], { queryParams: { categoryId } });
    } else if (type === 'tin-tuc') {
      // Navigate to news management (to be implemented)
      console.log('Navigate to news management for category:', categoryId);
    }
  }

  exportToExcel() {
    console.log('Export categories to Excel functionality');
    // Thực tế sẽ implement export Excel
  }
}
