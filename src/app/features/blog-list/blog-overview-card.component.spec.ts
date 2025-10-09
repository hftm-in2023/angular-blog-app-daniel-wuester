import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-blog-overview-card',
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card (click)="open.emit()">
      <mat-card-title data-testid="title">{{ title }}</mat-card-title>
      <mat-card-subtitle data-testid="meta">von {{ author }} am {{ date }}</mat-card-subtitle>
      <mat-card-content data-testid="content">{{ content }}</mat-card-content>

      <button
        *ngIf="showLike"
        mat-icon-button
        data-testid="like-btn"
        (click)="toggleLike.emit(); $event.stopPropagation()"
        aria-label="Like"
      >
        <mat-icon>{{ liked ? 'favorite' : 'favorite_border' }}</mat-icon>
      </button>
    </mat-card>
  `,
})
class BlogOverviewCardComponent {
  @Input() title = '';
  @Input() author = '';
  @Input() date = '';
  @Input() content = '';
  @Input() showLike = false;
  @Input() liked = false;

  @Output() open = new EventEmitter<void>();
  @Output() toggleLike = new EventEmitter<void>();
}

describe('BlogOverviewCardComponent (dumb)', () => {
  let fixture: ComponentFixture<BlogOverviewCardComponent>;
  let component: BlogOverviewCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogOverviewCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogOverviewCardComponent);
    component = fixture.componentInstance;
  });

  it('should render title, meta and content', () => {
    component.title = 'Hello';
    component.author = 'Alice';
    component.date = '2025-10-09';
    component.content = 'Preview text';
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('[data-testid="title"]')).nativeElement.textContent,
    ).toContain('Hello');
    expect(
      fixture.debugElement.query(By.css('[data-testid="meta"]')).nativeElement.textContent,
    ).toContain('Alice');
    expect(
      fixture.debugElement.query(By.css('[data-testid="content"]')).nativeElement.textContent,
    ).toContain('Preview text');
  });

  it('should emit "open" when card clicked', () => {
    spyOn(component.open, 'emit');
    fixture.detectChanges();

    fixture.debugElement.query(By.css('mat-card')).nativeElement.click();
    expect(component.open.emit).toHaveBeenCalled();
  });

  it('should show like button when showLike=true and emit toggle on click', () => {
    component.showLike = true;
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('[data-testid="like-btn"]'));
    expect(btn).toBeTruthy();

    spyOn(component.toggleLike, 'emit');
    btn.nativeElement.click();
    expect(component.toggleLike.emit).toHaveBeenCalled();
  });
});
