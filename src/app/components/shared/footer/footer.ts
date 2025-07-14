import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  workingHours: string;
}

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  currentYear = new Date().getFullYear();
  
  contactInfo: ContactInfo = {
    address: '123 Đường ABC, Quận 1, TP.HCM',
    phone: '+84 123 456 789',
    email: 'support@pyloan.com',
    workingHours: 'T2 - T6: 8:00 - 18:00'
  };
}
