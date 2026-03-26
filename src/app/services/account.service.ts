import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private baseUrl = "http://localhost:8080/api";

  constructor(private http: HttpClient) { }

  // Utility: Get token from localStorage
  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  // Utility: Prepare headers with Authorization
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });
  }

  // Create Account (Admin only)
  createAccount(account: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/accounts/create`,
      account,
      { headers: this.getHeaders() }
    );
  }

  // Get Accounts with pagination
  getAccounts(page: number = 0, size: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get(`${this.baseUrl}/accounts/get`, { headers: this.getHeaders(), params });
  }

  // Deposit (User + Admin)
  deposit(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/accounts/deposit`, data, { headers: this.getHeaders() });
  }

  // Withdraw (User + Admin)
  withdraw(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/accounts/withdraw`, data, { headers: this.getHeaders() });
  }

  // Transfer (User + Admin)
  transfer(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/accounts/transfer`, data, { headers: this.getHeaders() });
  }

  // Get Transactions with pagination
  getTransactions(accountNumber: string, page: number = 0, size: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get(`${this.baseUrl}/transactions/${accountNumber}`, { headers: this.getHeaders(), params });
  }

  // Dashboard (Admin only)
  getDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/details`, { headers: this.getHeaders() });
  }

  // Get Account Details
  getAccountDetails(accountId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/accounts/${accountId}`, { headers: this.getHeaders() });
  }

  // Update Account (Admin only)
  updateAccount(accountId: number, accountData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/accounts/update/${accountId}`, accountData, { headers: this.getHeaders() });
  }

  // Delete Account (Admin only)
  deleteAccount(accountId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/accounts/delete/${accountId}`, { headers: this.getHeaders() });
  }

  // Search Accounts
  searchAccounts(keyword: string): Observable<any> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get(`${this.baseUrl}/accounts/search`, { headers: this.getHeaders(), params });
  }

  /** -------------------- USER DASHBOARD -------------------- **/

  // User dashboard info (cards)
  getUserDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/dashboard`, { headers: this.getHeaders() });
  }

  // User full account details
  getUserAccountDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/account`, { headers: this.getHeaders() });
  }

  // User transaction history
  getUserTransactions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/transactions`, { headers: this.getHeaders() });
  }
}
