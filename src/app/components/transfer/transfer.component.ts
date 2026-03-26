import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AccountService } from '../../services/account.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-transfer',
  imports: [SharedModule],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css'
})
export class TransferComponent {
  errorMessage = '';
  successMessage = '';

  transferData = {
    fromAccount: '',
    toAccount: '',
    amount: null
  };

  constructor(private accountService: AccountService) { }

  transfer(form: NgForm) {
    // Clear old messages
    this.successMessage = '';
    this.errorMessage = '';

    if (form.invalid) {
      this.errorMessage = "Please fill all details correctly";
      return;
    }

    // Prevent transfer to same account
    if (this.transferData.fromAccount === this.transferData.toAccount) {
      this.errorMessage = "From and To accounts cannot be the same";
      return;
    }

    this.accountService.transfer(this.transferData)
      .subscribe({
        next: (res) => {
          this.successMessage = "Transfer Successful ✅";
          this.errorMessage = '';
          form.resetForm();

          // ✅ Auto hide success message
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },

        error: (err) => {
          console.error("Transfer Error:", err);
          this.successMessage = '';

          if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = "Transfer Failed ❌";
          }
        }
      });
  }
  onInputChange() {
    this.successMessage = '';
    this.errorMessage = '';
  }
}