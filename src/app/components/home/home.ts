import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../shared/header/header';
import { HeroSlider } from './hero-slider/hero-slider';
import { AboutSection } from './about-section/about-section';
import { LoanPackages } from './loan-packages/loan-packages';
import { StatsSection } from './stats-section/stats-section';
import { Testimonials } from './testimonials/testimonials';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    Header,
    HeroSlider,
    AboutSection,
    LoanPackages,
    StatsSection,
    Testimonials
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
