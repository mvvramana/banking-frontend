import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  showNavbar = false;

  constructor(private router: Router, private auth: AuthService) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        const url = event.urlAfterRedirects;

        //  Hide navbar
        if (url.includes('login') || url.includes('register')) {
          this.showNavbar = false;
        } else {
          this.showNavbar = this.auth.isLoggedIn();
        }
      }
    });
  }
}