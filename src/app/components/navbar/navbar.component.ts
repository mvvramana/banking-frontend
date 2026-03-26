import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, SharedModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  role: string | null = null;
  showNavbar = false;

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
    // Subscribe to login changes
    this.auth.isLoggedIn$.subscribe(isLogged => {
      this.showNavbar = isLogged;
      // Always refresh role dynamically
      if (isLogged) {
        const userRole = this.auth.getRole(); // get fresh role
        this.role = userRole ? userRole.replace('ROLE_', '') : null;
      } else {
        this.role = null;
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}