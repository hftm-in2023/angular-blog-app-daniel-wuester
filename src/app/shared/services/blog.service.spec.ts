import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BlogService } from './blog.service';

describe('BlogService', () => {
  let service: BlogService;
  const KEY = 'blog-likes';

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BlogService],
    });
    service = TestBed.inject(BlogService);
  });

  it('should toggle like and reflect via isLiked$ (and persist to localStorage)', () => {
    const id = 42;

    const emissions: boolean[] = [];
    const sub = service.isLiked$(id).subscribe((v) => emissions.push(v));

    expect(emissions[0]).toBeFalse();

    service.toggleLike(id);
    expect(emissions[1]).toBeTrue();

    const storedAfterLike = JSON.parse(localStorage.getItem(KEY) || '{}');
    expect(storedAfterLike[String(id)]).toBeTrue();

    service.toggleLike(id);
    expect(emissions[2]).toBeFalse();

    const storedAfterUnlike = JSON.parse(localStorage.getItem(KEY) || '{}');
    expect(storedAfterUnlike[String(id)] ?? false).toBeFalse();

    sub.unsubscribe();
  });
});
