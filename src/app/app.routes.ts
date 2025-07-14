import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { LoanPackagesList } from './components/loan-packages/loan-packages-list/loan-packages-list';
import { LoanPackageDetail } from './components/loan-packages/loan-package-detail/loan-package-detail';
import { LoanApplication } from './components/loan-packages/loan-application/loan-application';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'goi-vay', component: LoanPackagesList },
  { path: 'goi-vay/chi-tiet/:id', component: LoanPackageDetail },
  { path: 'dang-ky-vay', component: LoanApplication },
  { path: 'dang-ky-vay/:packageId', component: LoanApplication },
  { path: '**', redirectTo: '' }
];
