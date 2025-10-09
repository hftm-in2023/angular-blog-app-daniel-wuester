import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BehaviorSubject, of } from 'rxjs';

class OidcSecurityServiceMock {
  isAuthenticated$ = new BehaviorSubject({ isAuthenticated: false, allConfigsAuthenticated: [] });
  userData$ = new BehaviorSubject({ userData: null, allUserData: [] });
  authorize = jasmine.createSpy('authorize');
  logoffLocal = jasmine.createSpy('logoffLocal');
  checkAuth() {
    return of({ isAuthenticated: false, userData: null });
  }
  getIdToken() {
    return of('');
  }
}

describe('AppComponent (shell)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, SidebarComponent, RouterTestingModule],
      providers: [
        { provide: OidcSecurityService, useClass: OidcSecurityServiceMock },
        { provide: BreakpointObserver, useValue: { observe: () => of({ matches: false }) } },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the shell (sidebar + router outlet)', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('app-sidebar')).toBeTruthy();
    expect(el.querySelector('router-outlet')).toBeTruthy();
  });
});
