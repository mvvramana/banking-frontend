import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-account-details',
  imports: [SharedModule],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.css'
})
export class AccountDetailsComponent implements OnInit {

  account: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAccount(id);
  }

  loadAccount(accountId: number) {
    this.loading = true;
    this.accountService.getAccountDetails(accountId).subscribe({
      next: (data) => {
        this.account = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Failed to load account details');
      }
    });
  }

  goBack() {
    this.router.navigate(['/view-accounts']);
  }
}

