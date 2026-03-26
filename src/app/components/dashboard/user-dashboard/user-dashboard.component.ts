import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { SharedModule } from '../../../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  imports: [SharedModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {

  dashboard: any = null;        // Account summary card
  account: any = null;          // Full account details
  transactions: any[] = [];     // All user transactions

  loadingDashboard = false;
  loadingAccount = false;
  loadingTransactions = false;

  showAccountDetails = false;
  showTransactions = false;

  // Pagination
  pageSize = 7;
  currentPage = 1;
  pagedTransactions: any[] = [];
  totalPages = 1;

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.fetchDashboard();
  }

  fetchDashboard() {
    this.loadingDashboard = true;
    this.accountService.getUserDashboard().subscribe({
      next: (res) => {
        this.dashboard = res;
        this.loadingDashboard = false;
      },
      error: (err) => {
        console.error('Dashboard Error:', err);
        this.loadingDashboard = false;
      }
    });
  }

  fetchAccountDetails() {
    this.loadingAccount = true;
    this.accountService.getUserAccountDetails().subscribe({
      next: (res) => {
        this.account = res;

        // Show account details and hide transactions
        this.showAccountDetails = true;
        this.showTransactions = false;

        this.loadingAccount = false;
      },
      error: (err) => {
        console.error('Account Error:', err);
        this.loadingAccount = false;
      }
    });
  }

  fetchTransactions() {
    if (!this.dashboard || !this.dashboard.accountNumber) return;

    this.loadingTransactions = true;
    this.accountService.getUserTransactions().subscribe({
      next: (res) => {
        this.transactions = res;

        // Show transactions and hide account details
        this.showTransactions = true;
        this.showAccountDetails = false;

        // Initialize pagination
        this.currentPage = 1;
        this.totalPages = Math.ceil(this.transactions.length / this.pageSize);
        this.updatePagedTransactions();

        this.loadingTransactions = false;
      },
      error: (err) => {
        console.error('Transactions Error:', err);
        this.loadingTransactions = false;
      }
    });
  }

  /** -------------------- PAGINATION METHODS -------------------- **/
  updatePagedTransactions() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedTransactions = this.transactions.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedTransactions();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedTransactions();
    }
  }

}