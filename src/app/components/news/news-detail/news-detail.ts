import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { News } from '../../../models/news.interface';
import { NewsService } from '../../../services/news.service';
import { Footer } from '../../shared/footer/footer';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-news-detail',
  imports: [CommonModule, RouterModule, FormsModule, Footer, Header],
  templateUrl: './news-detail.html',
  styleUrl: './news-detail.css'
})
export class NewsDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);
  
  news: News | null = null;
  relatedNews: News[] = [];
  isLoading = false;
  error: string | null = null;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadNews(id);
        this.loadRelatedNews(id);
      }
    });
  }

  loadNews(id: number) {
    this.isLoading = true;
    this.error = null;

    this.newsService.getPublicNewsById(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.news = response.data;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.error = 'Không tìm thấy tin tức';
        console.error('Error loading news:', error);
      }
    });
  }

  loadRelatedNews(currentId: number) {
    // Lấy tin tức liên quan (cùng danh mục, loại trừ tin hiện tại)
    this.newsService.getPublicNews({ limit: 4 }).subscribe({
      next: (response) => {
        if (response.success) {
          this.relatedNews = response.data
            .filter(news => news.id !== currentId)
            .slice(0, 3);
        }
      },
      error: (error) => {
        console.error('Error loading related news:', error);
      }
    });
  }

  formatDate(date?: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  shareNews() {
    if (this.news) {
      const shareData = {
        title: this.news.title,
        text: this.news.content.substring(0, 100) + '...',
        url: window.location.href
      };

      if (navigator.share) {
        navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Đã sao chép link vào clipboard');
      }
    }
  }

  getCategoryName(categoryId?: number): string {
    if (!categoryId) return 'Chưa phân loại';
    // In a real app, you might have a separate service to get category names
    // For now, we'll just return a placeholder
    return 'Danh mục';
  }
}
