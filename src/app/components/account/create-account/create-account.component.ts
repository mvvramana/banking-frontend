import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { AccountService } from '../../../services/account.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-account',
  imports: [SharedModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css'
})
export class CreateAccountComponent {

  account = {
    accountHolderName: '',
    accountType: '',
    balance: null,
    mobileNumber: '',
    address: '',
    aadhaarNumber: '',
    panNumber: ''
  };

  errorMessage = '';
  successMessage = '';
  constructor(private accountService: AccountService) { }

  createAccount(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = "Please fill all required fields correctly";
      return;
    }
    this.accountService.createAccount(this.account)
      .subscribe({
        next: (res: any) => {
          this.successMessage = "Account Created Successfully ✅";
          this.errorMessage = '';
          console.log(res);

          // Reset form + object
          form.resetForm();
          this.resetAccount();

          // Auto hide success message
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          console.error("Create Account Error:", err);
          this.successMessage = '';

          if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = "Failed to create account ❌";
          }
        }
      });
  }

  //  Reset object
  resetAccount() {
    this.account = {
      accountHolderName: '',
      accountType: '',
      balance: null,
      mobileNumber: '',
      address: '',
      aadhaarNumber: '',
      panNumber: ''
    };
  }
  onInputChange() {
    this.successMessage = '';
    this.errorMessage = '';
  }
}