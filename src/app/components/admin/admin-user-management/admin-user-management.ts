import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, User, CreateUserRequest, UpdateUserRequest } from '../../../services/user.service';

@Component({
  selector: 'app-admin-user-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-user-management.html',
  styleUrl: './admin-user-management.css'
})
export class AdminUserManagement implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  
  // Filters
  searchTerm = '';
  statusFilter = '';
  creditRatingFilter = '';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  // Modal
  showUserModal = false;
  selectedUser: User | null = null;
  modalMode: 'view' | 'edit' | 'create' = 'view';

  // Loading states
  isLoading = false;
  error: string | null = null;

  private router = inject(Router);
  private userService = inject(UserService);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.error = null;
    
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.data;
          this.applyFilters();
        } else {
          this.error = response.message;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.error = 'Lỗi khi tải danh sách người dùng';
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.phone.includes(this.searchTerm);
      
      const matchesCreditRating = !this.creditRatingFilter || user.creditRating === this.creditRatingFilter;
      
      return matchesSearch && matchesCreditRating;
    });

    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  getPaginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  viewUser(user: User) {
    this.selectedUser = { ...user };
    this.modalMode = 'view';
    this.showUserModal = true;
  }

  editUser(user: User) {
    this.selectedUser = { ...user };
    this.modalMode = 'edit';
    this.showUserModal = true;
  }

  createUser() {
    this.selectedUser = {
      id: 0,
      username: '',
      name: '',
      email: '',
      phone: '',
      creditRating: 'unknown',
      role: 'user',
      createdAt: '',
      updatedAt: ''
    };
    this.modalMode = 'create';
    this.showUserModal = true;
  }

  saveUser() {
    if (!this.selectedUser) return;

    if (this.modalMode === 'create') {
      const userData: CreateUserRequest = {
        username: this.selectedUser.username,
        password: this.selectedUser.password || '123456',
        name: this.selectedUser.name,
        email: this.selectedUser.email,
        phone: this.selectedUser.phone,
        creditRating: this.selectedUser.creditRating,
        role: this.selectedUser.role
      };

      this.userService.createUser(userData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadUsers();
            this.closeModal();
            alert('Tạo người dùng thành công!');
          } else {
            alert('Lỗi: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error creating user:', error);
          alert('Lỗi khi tạo người dùng');
        }
      });
    } else if (this.modalMode === 'edit') {
      const userData: UpdateUserRequest = {
        username: this.selectedUser.username,
        name: this.selectedUser.name,
        email: this.selectedUser.email,
        phone: this.selectedUser.phone,
        creditRating: this.selectedUser.creditRating,
        role: this.selectedUser.role
      };

      this.userService.updateUser(this.selectedUser.id, userData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadUsers();
            this.closeModal();
            alert('Cập nhật người dùng thành công!');
          } else {
            alert('Lỗi: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error updating user:', error);
          alert('Lỗi khi cập nhật người dùng');
        }
      });
    }
  }

  deleteUser(user: User) {
    if (confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadUsers();
            alert('Xóa người dùng thành công!');
          } else {
            alert('Lỗi: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('Lỗi khi xóa người dùng');
        }
      });
    }
  }

  closeModal() {
    this.showUserModal = false;
    this.selectedUser = null;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Hoạt động': return 'status-active';
      case 'Tạm khóa': return 'status-locked';
      default: return '';
    }
  }

  getCreditRatingClass(rating: string): string {
    switch (rating) {
      case 'excellent': return 'credit-excellent';
      case 'good': return 'credit-good';
      case 'average': return 'credit-average';
      case 'poor': return 'credit-poor';
      default: return 'credit-unknown';
    }
  }

  getCreditRatingText(rating: string): string {
    switch (rating) {
      case 'excellent': return 'Xuất sắc';
      case 'good': return 'Tốt';
      case 'average': return 'Trung bình';
      case 'poor': return 'Kém';
      default: return 'Chưa xác định';
    }
  }

  getRoleText(role: string): string {
    return role === 'admin' ? 'Quản trị viên' : 'Người dùng';
  }

  exportToExcel() {
    console.log('Export users to Excel functionality');
    // Thực tế sẽ implement export Excel
  }

  viewUserApplications(userId: number) {
    this.router.navigate(['/admin/loan-applications'], { queryParams: { userId } });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('vi-VN');
  }
}
