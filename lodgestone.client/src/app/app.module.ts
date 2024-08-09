import { MsalModule, MsalService, MsalGuard, MsalInterceptor } from '@azure/msal-angular';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

const msalConfig = {
  auth: {
    clientId: 'fd2ecb90-9039-4e15-ac93-e1258adef6c0',
    authority: 'https://TrialTenantumJBly2n.ciamlogin.com/8b6d3571-99f8-4fc1-88f8-5b196a9e5ae3',
    redirectUri: 'https://localhost:4200',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule,
    MsalModule.forRoot(new PublicClientApplication(msalConfig), {
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: ['user.read', 'api://f5065c99-cb6f-47d1-9274-f8bcb17603d5/User.Access'],
      }
    },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          ['https://localhost:4200/', ['api://f5065c99-cb6f-47d1-9274-f8bcb17603d5/User.Access']]
        ])
      }
    )
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: MsalInterceptor,
    multi: true
  },
    MsalService,
    MsalGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
