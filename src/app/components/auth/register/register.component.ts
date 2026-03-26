import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { SharedModule } from '../../../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [SharedModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  user = {
    name: '',
    email: '',
    password: '',
    phone: ''
  };
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService,
    private router: Router) { }

  register(form: any) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.errorMessage = "Please fill all details correctly";
      return;
    }

    this.authService.register(this.user)
      .subscribe({
        next: () => {
          this.successMessage = "Registration Successful ✅";
          this.errorMessage = '';

          // ⏳ Show message, then navigate
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/login']);
          }, 1500);
        },

        error: (err) => {
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
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  onInputChange() {
    this.successMessage = '';
    this.errorMessage = '';
  }

}