import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  user = {
    email: '',
    password: ''
  };
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  login(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = "Please enter valid email and password";
      return;
    }

    this.loading = true;

    this.auth.login(this.user).subscribe({
      next: (res: any) => {
        this.loading = false;

        this.successMessage = "Login Successful ✅";
        this.errorMessage = '';

        //  Get role from JWT
        const role = this.auth.getRole();
        console.log("Role from Token:", role);

        //  Delay navigation to show success message
        setTimeout(() => {
          this.successMessage = '';

          if (role === 'ADMIN') {
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.router.navigate(['/user-dashboard']);
          }

        }, 1500); // ⏳ 1.5 sec delay
      },

      error: (err) => {
        console.error(err);
        this.loading = false;
        this.successMessage = '';

        if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = "Invalid Email or Password ❌";
        }
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
  onInputChange() {
    this.successMessage = '';
    this.errorMessage = '';
  }
}