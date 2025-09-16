import { TestBed } from '@angular/core/testing';
import { AddBlogPageComponent } from './add-blog-page.component';

describe('AddBlogPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBlogPageComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AddBlogPageComponent);
    const cmp = fixture.componentInstance;
    expect(cmp).toBeTruthy();
  });
});
