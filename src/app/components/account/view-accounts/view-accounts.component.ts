import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { SharedModule } from '../../../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-accounts',
  imports: [SharedModule],
  templateUrl: './view-accounts.component.html',
  styleUrl: './view-accounts.component.css'
})
export class ViewAccountsComponent implements OnInit {

  accounts: any[] = [];
  loading = true;
  searchText: string = '';
  errorMessage = '';
  successMessage = '';
  searched = false;

  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  rowMessages: { [key: number]: { error?: string, success?: string } } = {};
  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.loading = true;
    this.errorMessage = '';
    this.accountService.getAccounts(this.currentPage, this.pageSize)
      .subscribe({
        next: (data: any) => {
          this.accounts = data.content;
          this.totalPages = data.totalPages;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;

          if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = "Failed to load accounts ❌";
          }
        }
      });
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadAccounts();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAccounts();
    }
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadAccounts();
    }
  }

  viewDetails(accountId: number) {
    this.router.navigate(['/accounts', accountId]);
  }

  editAccount(accountId: number) {
    this.router.navigate(['/accounts', accountId, 'edit']);
  }

  deleteAccount(accountId: number) {
    const confirmDelete = confirm("⚠️ Are you sure you want to delete this account?");
    if (!confirmDelete) return;
    // ✅ Reset messages before API call
    this.successMessage = '';
    this.errorMessage = '';
    this.accountService.deleteAccount(accountId).subscribe({
      next: () => {
        this.successMessage = "Account deleted successfully ✅";

        // ✅ Auto hide success + reload
        setTimeout(() => {
          this.successMessage = '';
          this.loadAccounts();
        }, 3000);
      },

      error: (err) => {
        console.error("Delete Error:", err);

        if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else if (err.status === 400) {
          this.errorMessage = "Balance must be zero";
        } else if (err.status === 404) {
          this.errorMessage = "Account not found";
        } else {
          this.errorMessage = "Something went wrong ❌";
        }

        // ✅ Auto hide error
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }

  searchAccounts() {
    this.searched = true;
    if (!this.searchText) {
      this.loadAccounts();
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    this.accountService.searchAccounts(this.searchText)
      .subscribe({
        next: (data: any) => {
          this.accounts = data;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.successMessage = '';

          if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else if (err.status === 403) {
            this.errorMessage = "Unauthorized access ❌";
          } else {
            this.errorMessage = "Search failed ❌";
          }
        }
      });
  }
  onInputChange() {
    this.successMessage = '';
    this.errorMessage = '';
  }
}