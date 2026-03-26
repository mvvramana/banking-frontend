import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-update-account',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-account.component.html',
  styleUrl: './update-account.component.css'
})
export class UpdateAccountComponent implements OnInit {

  accountForm!: FormGroup;
  accountId!: number;
  loading = true;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    this.accountId = Number(this.route.snapshot.paramMap.get('id'));

    this.accountForm = this.fb.group({
      accountHolderName: ['', [Validators.required, Validators.minLength(3)]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      status: ['', Validators.required]
    });

    this.loadAccount();
  }

  loadAccount() {
    this.accountService.getAccountDetails(this.accountId).subscribe({
      next: (data: any) => {
        this.accountForm.patchValue({
          accountHolderName: data.accountHolderName,
          mobileNumber: data.mobileNumber,
          address: data.address,
          status: data.status
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load account', err);
        this.errorMessage = 'Failed to load account ❌';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      this.errorMessage = "Please fill all details correctly";
      return;
    }

    this.accountService.updateAccount(this.accountId, this.accountForm.value)
      .subscribe({
        next: () => {
          this.successMessage = "Account updated successfully ✅";
          this.errorMessage = '';

          // ⏳ show message then navigate
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/view-accounts']);
          }, 1500);
        },
        error: (err) => {
          console.error('Update failed', err);
          this.successMessage = '';

          if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = "Update failed ❌";
          }
        }
      });
  }

  goBack() {
    this.router.navigate(['/view-accounts']);
  }
  onInputChange() {
    this.successMessage = '';
    this.errorMessage = '';
  }
}