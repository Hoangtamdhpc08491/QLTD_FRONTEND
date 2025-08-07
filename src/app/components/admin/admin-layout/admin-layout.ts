import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {
  isSidebarCollapsed = false;

  menuItems = [
    {
      icon: '🏠',
      label: 'Dashboard',
      route: '/admin/dashboard',
      active: true
    },
    {
      icon: '📦',
      label: 'Quản lý gói vay',
      route: '/admin/loan-packages',
      active: false
    },
    {
        icon: '📦',
        label: 'Quản lý danh mục',
        route: '/admin/categories',
        active: false
    },
    {
      icon: '📰',
      label: 'Quản lý tin tức',
      route: '/admin/news',
      active: false
    },
    {
      icon: '📂',
      label: 'Quản lý danh mục tin tức',
      route: '/admin/news-categories',
      active: false
    },
    {
      icon: '📋',
      label: 'Quản lý đơn vay',
      route: '/admin/loan-applications',
      active: false
    },
    {
      icon: '👥',
      label: 'Quản lý người dùng',
      route: '/admin/users',
      active: false
    },
    {
      icon: '📊',
      label: 'Báo cáo',
      route: '/admin/reports',
      active: false
    },
    {
      icon: '⚙️',
      label: 'Cài đặt',
      route: '/admin/settings',
      active: false
    }
  ];

  constructor(private router: Router) {}

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  navigateTo(route: string) {
    // Update active state
    this.menuItems.forEach(item => {
      item.active = item.route === route;
    });
    
    this.router.navigate([route]);
  }

  logout() {
    // Implement logout logic
    console.log('Logout');
    this.router.navigate(['/']);
  }
}
