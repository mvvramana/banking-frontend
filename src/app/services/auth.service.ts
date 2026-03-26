import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, BehaviorSubject } from 'rxjs';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface MyToken extends JwtPayload {
  role: string;
  sub: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = "http://localhost:8080/api/users";

  // NEW: reactive login state
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) { }

  //  Login
  login(user: any) {
    return this.http.post(this.baseUrl + "/login", user).pipe(
      map((res: any) => {
        if (res && res.token) {
          this.setToken(res.token); // store JWT first
          this.loggedIn.next(true); // THEN notify subscribers
        }
        return res;
      })
    );
  }
  // Register
  register(user: any): Observable<any> {
    return this.http.post(this.baseUrl + "/register", user);
  }

  // Store JWT
  setToken(token: string) {
    localStorage.setItem('jwtToken', token);
  }

  // Get JWT
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  //  Logout
  logout() {
    localStorage.removeItem('jwtToken');
    this.loggedIn.next(false);   // 🔥 HIDE NAVBAR instantly
  }

  //  Decode role from JWT
  getRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: MyToken = jwtDecode<MyToken>(token);
        console.log("Decoded Token:", decoded);
        return decoded.role || null;

      } catch (error) {
        console.error('Invalid JWT token', error);
        return null;
      }
    }
    return null;
  }

  //  Check token existence
  isLoggedIn(): boolean {
    return this.hasToken();
  }

  //  Helper
  private hasToken(): boolean {
    return !!localStorage.getItem('jwtToken');
  }
}