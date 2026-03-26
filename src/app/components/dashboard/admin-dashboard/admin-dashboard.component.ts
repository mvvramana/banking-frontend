import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-admin-dashboard',
  imports: [SharedModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  dashboard: any = {};

  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.accountService.getDashboard()
      .subscribe((data: any) => {
        this.dashboard = data;
      });
  }

}