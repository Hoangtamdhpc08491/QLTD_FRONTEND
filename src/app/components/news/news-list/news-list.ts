import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { News, NewsCategory } from '../../../models/news.interface';
import { NewsService } from '../../../services/news.service';
import { NewsCategoryService } from '../../../services/news-category.service';
import { Footer } from '../../shared/footer/footer';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-news-list',
  imports: [CommonModule, RouterModule, FormsModule, Footer, Header],
  templateUrl: './news-list.html',
  styleUrl: './news-list.css'
})
export class NewsList implements OnInit {
  private newsService = inject(NewsService);
  private categoryService = inject(NewsCategoryService);

  selectedCategory: number | null = null;
  searchTerm = '';
  
  categories: NewsCategory[] = [];
  newsList: News[] = [];
  
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
    this.categoryService.getPublicCategories().subscribe({
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
      ...(this.searchTerm && { search: this.searchTerm })
    };

    this.newsService.getPublicNews(params).subscribe({
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
        this.error = 'Có lỗi xảy ra khi tải tin tức';
        console.error('Error loading news:', error);
      }
    });
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.loadNews();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadNews();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadNews();
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
