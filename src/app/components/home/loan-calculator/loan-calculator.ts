import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan-calculator',
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-calculator.html',
  styleUrl: './loan-calculator.css'
})
export class LoanCalculator {
  private router = inject(Router);
  
  loanAmount = 50000000; // Default 50 million VND
  loanDuration = 6; // Default 6 months
  interestRate = 1.5; // 1.5% per month

  minLoanAmount = 1000000; // 1 million VND
  maxLoanAmount = 100000000; // 100 million VND
  minDuration = 1;
  maxDuration = 12;

  get monthlyInterest(): number {
    return (this.loanAmount * this.interestRate) / 100;
  }

  get totalAmount(): number {
    return this.loanAmount + (this.monthlyInterest * this.loanDuration);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  calculateLoan(): void {
    // Navigate to loan application page
    this.router.navigate(['/hop-dong-vay'], {
      queryParams: {
        amount: this.loanAmount,
        duration: this.loanDuration,
        monthlyInterest: this.monthlyInterest,
        totalAmount: this.totalAmount
      }
    });
  }
}
