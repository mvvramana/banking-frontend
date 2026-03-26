import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AccountService } from '../../services/account.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-withdraw',
  imports: [SharedModule],
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.css'
})
export class WithdrawComponent {

  withdrawData = {
    accountNumber: '',
    amount: null
  };
  errorMessage = '';
  successMessage = '';

  constructor(private accountService: AccountService) { }

  withdraw(form: NgForm) {

    if (form.invalid) {
      this.errorMessage = "Please enter valid details";
      return;
    }

    this.accountService.withdraw(this.withdrawData)
      .subscribe({
        next: (res) => {
          this.successMessage = "Withdraw Successful ✅";
          this.errorMessage = '';
          console.log(res);
          form.resetForm();

          // ✅ Auto hide success message
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },

        error: (err) => {
          console.error("Withdraw Error:", err);
          this.successMessage = '';

          if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else if (err.status === 404) {
            this.errorMessage = "Account not found";
          } else {
            this.errorMessage = "Withdraw Failed ❌";
          }
        }
      });
  }
  onInputChange() {
    this.successMessage = '';
    this.errorMessage = '';
  }

}