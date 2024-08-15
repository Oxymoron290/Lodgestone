import { HttpClient } from '@angular/common/http';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  claims: any = {};
  public forecasts: WeatherForecast[] = [];

  constructor(private http: HttpClient, private authService: MsalService, private msalBroadcastService: MsalBroadcastService) {
    this.msalBroadcastService.inProgress$
    .pipe(filter((status: InteractionStatus) => status === InteractionStatus.None))
    .subscribe(() => {
      const account = this.authService.instance.getAllAccounts()[0];
      if (account) {
        this.authService.instance.setActiveAccount(account);
        this.loadClaims();
      }
    });
  }

  ngOnInit() {
    this.getForecasts();
    this.loadClaims();
  }

  getForecasts() {
    this.http.get<WeatherForecast[]>('/weatherforecast').subscribe(
      (result) => {
        this.forecasts = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  loadClaims() {
    const account = this.authService.instance.getActiveAccount();
    if (account && account.idTokenClaims) {
      console.log(JSON.stringify(account));
      this.claims = account.idTokenClaims;
    }
  }

  isLoggedIn(): boolean {
    return this.authService.instance.getActiveAccount() != null;
  }

  login() {
    this.authService.loginRedirect({
      scopes: ['user.read']
    });
  }

  logout() {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: 'https://localhost:4200'
    });
  }

  title = 'lodgestone.client';
}
