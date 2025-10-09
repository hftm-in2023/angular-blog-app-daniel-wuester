import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BehaviorSubject, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

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

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let component: SidebarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent, RouterTestingModule],
      providers: [
        { provide: OidcSecurityService, useClass: OidcSecurityServiceMock },
        { provide: BreakpointObserver, useValue: { observe: () => of({ matches: false }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should show Login button when not authenticated', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Login');
  });

  it('should call authorize() on login click', () => {
    const svc = TestBed.inject(OidcSecurityService) as unknown as OidcSecurityServiceMock;

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.auth-actions button');
    btn.click();
    expect(svc.authorize).toHaveBeenCalled();
  });
});
