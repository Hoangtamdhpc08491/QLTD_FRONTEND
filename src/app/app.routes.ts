import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { LoanPackagesList } from './components/loan-packages/loan-packages-list/loan-packages-list';
import { LoanPackageDetail } from './components/loan-packages/loan-package-detail/loan-package-detail';
import { LoanApplication } from './components/loan-packages/loan-application/loan-application';
import { NewsList } from './components/news/news-list/news-list';
import { NewsDetail } from './components/news/news-detail/news-detail';
import { AdminLayout } from './components/admin/admin-layout/admin-layout';
import { AdminDashboard } from './components/admin/admin-dashboard/admin-dashboard';
import { AdminLoanApplications } from './components/admin/admin-loan-applications/admin-loan-applications';
import { AdminLoanPackages } from './components/admin/admin-loan-packages/admin-loan-packages';
import { AdminCategories } from './components/admin/admin-categories/admin-categories';
import { AdminUserManagement } from './components/admin/admin-user-management/admin-user-management';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'goi-vay', component: LoanPackagesList },
  { path: 'goi-vay/chi-tiet/:id', component: LoanPackageDetail },
  { path: 'dang-ky-vay', component: LoanApplication },
  { path: 'dang-ky-vay/:packageId', component: LoanApplication },
  { path: 'tin-tuc', component: NewsList },
  { path: 'tin-tuc/:id', component: NewsDetail },
  
  // Admin Routes
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'loan-packages', component: AdminLoanPackages },
      { path: 'categories', component: AdminCategories },
    ]
  },
  
  { path: '**', redirectTo: '' }
];
