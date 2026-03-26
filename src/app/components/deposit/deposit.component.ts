import { Component } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { SharedModule } from '../../shared/shared.module';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-deposit',
  imports: [SharedModule],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css'
})
export class DepositComponent {
  depositData = {
    accountNumber: '',
    amount: null
  };
  errorMessage = '';
  successMessage = '';

  constructor(private accountService: AccountService) { }

  deposit(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = "Please enter valid details";
      return;
    }
    this.accountService.deposit(this.depositData)
      .subscribe({
        next: (res) => {
          this.successMessage = "Deposit Successful ✅";
          this.errorMessage = '';
          form.resetForm();

          // ✅ Auto hide success message
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          console.error("Deposit Error:", err);
          this.successMessage = '';

          if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = "Something went wrong ❌";
          }
        }
      });
  }
  onInputChange() {
    this.successMessage = '';
    this.errorMessage = '';
  }
}