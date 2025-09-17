import { TestBed } from '@angular/core/testing';
import { AddBlogPageComponent } from './add-blog-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AddBlogPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBlogPageComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AddBlogPageComponent);
    const cmp = fixture.componentInstance;
    expect(cmp).toBeTruthy();
  });
});
