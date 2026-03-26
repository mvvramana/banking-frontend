import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-transactions',
  imports: [SharedModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {

  accountNumber = '';
  transactions: any[] = [];
  loading: boolean = false;
  searched = false;
  errorMessage: string = '';

  // Pagination variables
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;

  constructor(private accountService: AccountService) { }

  loadTransactions() {
    this.loading = true;
    this.errorMessage = '';
    this.searched = true;

    this.accountService.getTransactions(this.accountNumber, this.currentPage, this.pageSize)
      .subscribe({
        next: (data: any) => {
          this.transactions = data.content;
          this.totalPages = data.totalPages;
          this.loading = false;
        },

        error: (err) => {
          console.error("FULL ERROR:", err);

          this.loading = false;
          this.transactions = []; // clear old data

          if (err?.error?.message) {
            this.errorMessage = err.error.message;
          }
          else if (err.status === 404) {
            this.errorMessage = "Account not found";
          }
          else if (err.status === 0) {
            this.errorMessage = "Server is down / not reachable";
          }
          else {
            this.errorMessage = "Something went wrong ❌";
          }
        }
      });
  }


  // Pagination controls
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadTransactions();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadTransactions();
    }
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadTransactions();
    }
  }

  onAccountChange() {
    if (!this.accountNumber || this.accountNumber.length < 6) {
      this.errorMessage = '';     //  clear error
      this.transactions = [];     // optional
      this.searched = false;      // reset state
    }
  }
}


