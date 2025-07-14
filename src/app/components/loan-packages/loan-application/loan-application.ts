import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Footer } from '../../shared/footer/footer';
import { Header } from '../../shared/header/header';

interface LoanApplicationData {
  hoTen: string;
  email: string;
  soDienThoai: string;
  cmnd: string;
  diaChi: string;
  ngaySinh: string;
  gioiTinh: string;
  tinhTrangHonNhan: string;
  ngheNghiep: string;
  thuNhapHangThang: number;
  maGoiVay: string;
  soTienVay: number;
  thoiHanVay: number;
  mucDichVay: string;
  ghiChu: string;
}

interface LoanPackage {
  maGoiVay: string;
  tenGoiVay: string;
  laiSuat: number;
  hanMuc: number;
  thoiHan: string;
  icon: string;
}

@Component({
  selector: 'app-loan-application',
  imports: [CommonModule, RouterModule, FormsModule, Footer, Header],
  templateUrl: './loan-application.html',
  styleUrl: './loan-application.css'
})
export class LoanApplication implements OnInit {
  currentStep = 1;
  totalSteps = 4;
  selectedPackage: LoanPackage | null = null;
  
  application: LoanApplicationData = {
    hoTen: '',
    email: '',
    soDienThoai: '',
    cmnd: '',
    diaChi: '',
    ngaySinh: '',
    gioiTinh: '',
    tinhTrangHonNhan: '',
    ngheNghiep: '',
    thuNhapHangThang: 0,
    maGoiVay: '',
    soTienVay: 0,
    thoiHanVay: 12,
    mucDichVay: '',
    ghiChu: ''
  };

  // Mock data cho các gói vay
  loanPackages: LoanPackage[] = [
    {
      maGoiVay: 'VKD001',
      tenGoiVay: 'Vay Kinh Doanh Online',
      laiSuat: 1.2,
      hanMuc: 500000000,
      thoiHan: '6-36 tháng',
      icon: '🏢'
    },
    {
      maGoiVay: 'VCN002',
      tenGoiVay: 'Vay Cá Nhân Tiêu Dùng',
      laiSuat: 1.5,
      hanMuc: 200000000,
      thoiHan: '3-24 tháng',
      icon: '👤'
    },
    {
      maGoiVay: 'VTC003',
      tenGoiVay: 'Vay Thế Chấp Tài Sản',
      laiSuat: 0.9,
      hanMuc: 5000000000,
      thoiHan: '12-120 tháng',
      icon: '🏠'
    },
    {
      maGoiVay: 'VNH004',
      tenGoiVay: 'Vay Nhanh 15 Phút',
      laiSuat: 2.0,
      hanMuc: 50000000,
      thoiHan: '1-6 tháng',
      icon: '⚡'
    }
  ];

  genderOptions = [
    { value: 'nam', label: 'Nam' },
    { value: 'nu', label: 'Nữ' },
    { value: 'khac', label: 'Khác' }
  ];

  maritalOptions = [
    { value: 'doc-than', label: 'Độc thân' },
    { value: 'ket-hon', label: 'Kết hôn' },
    { value: 'ly-hon', label: 'Ly hôn' },
    { value: 'goa', label: 'Góa' }
  ];

  occupationOptions = [
    { value: 'nhan-vien', label: 'Nhân viên văn phòng' },
    { value: 'cong-nhan', label: 'Công nhân' },
    { value: 'kinh-doanh', label: 'Kinh doanh tự do' },
    { value: 'giao-vien', label: 'Giáo viên' },
    { value: 'bac-si', label: 'Bác sĩ' },
    { value: 'ky-su', label: 'Kỹ sư' },
    { value: 'khac', label: 'Khác' }
  ];

  loanPurposeOptions = [
    { value: 'kinh-doanh', label: 'Kinh doanh' },
    { value: 'mua-nha', label: 'Mua nhà' },
    { value: 'mua-xe', label: 'Mua xe' },
    { value: 'giao-duc', label: 'Giáo dục' },
    { value: 'y-te', label: 'Y tế' },
    { value: 'du-lich', label: 'Du lịch' },
    { value: 'tieu-dung', label: 'Tiêu dùng cá nhân' },
    { value: 'khac', label: 'Khác' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const packageId = params['packageId'];
      if (packageId) {
        this.application.maGoiVay = packageId;
        this.selectedPackage = this.loanPackages.find(
          pkg => pkg.maGoiVay === packageId
        ) || null;
      }
    });
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    this.currentStep = step;
  }

  selectPackage(packageId: string) {
    this.application.maGoiVay = packageId;
    this.selectedPackage = this.loanPackages.find(
      pkg => pkg.maGoiVay === packageId
    ) || null;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  calculateMonthlyPayment(): number {
    if (!this.selectedPackage || !this.application.soTienVay || !this.application.thoiHanVay) {
      return 0;
    }
    
    const monthlyRate = this.selectedPackage.laiSuat / 100;
    const months = this.application.thoiHanVay;
    const amount = this.application.soTienVay;
    
    const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
    return payment;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      // Mock submission - trong thực tế sẽ gọi API
      console.log('Loan Application Submitted:', this.application);
      
      // Simulate API call
      setTimeout(() => {
        alert('Đăng ký vay thành công! Chúng tôi sẽ liên hệ với bạn trong vòng 24h.');
        this.router.navigate(['/']);
      }, 1000);
    } else {
      alert('Vui lòng kiểm tra lại thông tin đăng ký!');
    }
  }

  getStepTitle(step: number): string {
    const titles = [
      '',
      'Chọn gói vay',
      'Thông tin cá nhân', 
      'Thông tin vay vốn',
      'Xác nhận đăng ký'
    ];
    return titles[step] || '';
  }

  isStepCompleted(step: number): boolean {
    switch (step) {
      case 1:
        return !!this.application.maGoiVay;
      case 2:
        return !!(this.application.hoTen && this.application.email && 
                 this.application.soDienThoai && this.application.cmnd);
      case 3:
        return !!(this.application.soTienVay && this.application.mucDichVay);
      default:
        return false;
    }
  }
}
