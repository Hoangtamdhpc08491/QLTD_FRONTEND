import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SlideData {
  backgroundImage: string;
  subtitle: string;
  title: string;
  buttonText: string;
  buttonLink: string;
}

@Component({
  selector: 'app-hero-slider',
  imports: [CommonModule, RouterModule],
  templateUrl: './hero-slider.html',
  styleUrl: './hero-slider.css'
})
export class HeroSlider implements AfterViewInit {
  slides: SlideData[] = [
    {
      backgroundImage: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
      subtitle: 'Simple & Secure Payment Process',
      title: 'Giải Pháp Tài Chính Hoàn Hảo',
      buttonText: 'Đăng kí vay ngay',
      buttonLink: '/hop-dong-vay'
    },
    {
      backgroundImage: 'linear-gradient(135deg, #059669, #10b981)',
      subtitle: 'Simple & Secure Payment Process',
      title: 'Giải Pháp Tài Chính Hoàn Hảo',
      buttonText: 'Đăng kí vay ngay',
      buttonLink: '/hop-dong-vay'
    }
  ];

  swiperOptions = JSON.stringify({
    slidesPerView: 1,
    loop: true,
    effect: 'fade',
    autoplay: {
      delay: 5000
    },
    navigation: {
      nextEl: '#main-slider__swiper-button-next',
      prevEl: '#main-slider__swiper-button-prev'
    }
  });

  ngAfterViewInit(): void {
    // Initialize Swiper after view init
    this.initializeSwiper();
  }

  private initializeSwiper(): void {
    // This would initialize Swiper.js if included
    // For now, we'll handle this with CSS animations
    console.log('Slider initialized');
  }
}
