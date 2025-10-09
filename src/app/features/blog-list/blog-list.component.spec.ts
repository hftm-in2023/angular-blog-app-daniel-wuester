import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { BlogListComponent } from './blog-list.component';
import { BlogService } from '../../shared/services/blog.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';

class BlogServiceMock {
  private blogs = of([
    { id: 1, title: 'A', author: 'Ann', content: '...', createdAt: '2025-10-09' },
    { id: 2, title: 'B', author: 'Bob', content: '...', createdAt: '2025-10-08' },
  ]);

  private likes = new Map<number, BehaviorSubject<boolean>>([
    [1, new BehaviorSubject(false)],
    [2, new BehaviorSubject(true)],
  ]);

  getBlogs() {
    return this.blogs;
  }
  isLiked$(id: number) {
    return this.likes.get(id)!.asObservable();
  }
  toggleLike(id: number) {
    const s = this.likes.get(id)!;
    s.next(!s.value);
  }
}

describe('BlogListComponent', () => {
  let fixture: ComponentFixture<BlogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogListComponent],
      providers: [
        provideRouter([]),
        { provide: BlogService, useClass: BlogServiceMock },
        {
          provide: OidcSecurityService,
          useValue: {
            isAuthenticated$: of({ isAuthenticated: true }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogListComponent);
  });

  it('renders cards', () => {
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('mat-card'));
    expect(cards.length).toBe(2);
  });

  it('toggles like', () => {
    fixture.detectChanges();
    const firstLikeBtn = fixture.debugElement.queryAll(By.css('button[aria-label="Like"]'))[0];
    expect(firstLikeBtn).toBeTruthy();

    const before = fixture.debugElement
      .queryAll(By.css('mat-icon'))
      .map((i) => i.nativeElement.textContent.trim())
      .join(' ');
    expect(before).toContain('favorite_border');

    firstLikeBtn.nativeElement.click();
    fixture.detectChanges();

    const after = fixture.debugElement
      .queryAll(By.css('mat-icon'))
      .map((i) => i.nativeElement.textContent.trim())
      .join(' ');
    expect(after).toContain('favorite');
  });
});
