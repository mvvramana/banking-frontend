import { Routes } from '@angular/router';

import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { TransactionsComponent } from './components/transactions/transactions.component';

import { AuthGuard } from './guards/auth.guard';
import { CreateAccountComponent } from './components/account/create-account/create-account.component';
import { ViewAccountsComponent } from './components/account/view-accounts/view-accounts.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { WithdrawComponent } from './components/withdraw/withdraw.component';
import { DepositComponent } from './components/deposit/deposit.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { UpdateAccountComponent } from './components/update-account/update-account.component';
import { RoleGuard } from './guards/role.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './components/dashboard/user-dashboard/user-dashboard.component';

export const routes: Routes = [

  // Default
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // ================= ADMIN DASHBOARD ONLY =================
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: ['ADMIN'] }
  },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: ['USER'] }
  },

  // ================= USER FEATURES =================
  //  ADMIN can also access these
  {
    path: 'deposit',
    component: DepositComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: ['USER', 'ADMIN'] }
  },
  {
    path: 'withdraw',
    component: WithdrawComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: ['USER', 'ADMIN'] }
  },
  {
    path: 'transfer',
    component: TransferComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: ['USER', 'ADMIN'] }
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: ['USER', 'ADMIN'] }
  },
  {
    path: 'my-account',
    component: AccountDetailsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: ['USER', 'ADMIN'] }
  },

  // ================= ADMIN ONLY =================
  {
    path: 'create-account',
    component: CreateAccountComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: ['ADMIN'] }
  },
  {
    path: 'view-accounts',
    component: ViewAccountsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: ['ADMIN'] }
  },
  {
    path: 'accounts/:id',
    component: AccountDetailsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: ['ADMIN'] }
  },
  {
    path: 'accounts/:id/edit',
    component: UpdateAccountComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: ['ADMIN'] }
  },

  // ================= COMMON =================
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  }
];