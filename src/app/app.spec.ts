import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { provideRouter } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';

const oidcMock = {
  checkAuth: () => of({ isAuthenticated: false, userData: null, accessToken: '', idToken: '' }),
  authorize: () => {},
  logoff: () => of(null),
};

describe('AppComponent (shell)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), { provide: OidcSecurityService, useValue: oidcMock }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the shell (header + router outlet)', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-header')).toBeTruthy();
    expect(el.querySelector('router-outlet')).toBeTruthy();
  });
});
