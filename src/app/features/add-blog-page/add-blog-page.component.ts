import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AddBlogService } from './add-blog.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-add-blog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './add-blog-page.component.html',
  styleUrls: ['./add-blog-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBlogComponent {
  private fb = inject(FormBuilder);
  private api = inject(AddBlogService);
  private router = inject(Router);

  private _busy = signal(false);
  private _error = signal<string | null>(null);

  formTyped = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Z].*/)],
    }),
    content: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(5)],
    }),
  });

  titleCtrl = () => this.formTyped.controls.title;
  contentCtrl = () => this.formTyped.controls.content;
  hasError = () => !!this._error();
  errorMsg = () => this._error();

  submitDisabled() {
    return this._busy() || this.formTyped.invalid;
  }
  async onSubmit() {
    if (this.submitDisabled()) return;
    this._error.set(null);
    this._busy.set(true);
    try {
      await this.api.addBlog({
        title: this.titleCtrl().value,
        content: this.contentCtrl().value,
      });

      this.router.navigate(['/blogs']);
    } catch (e: any) {
      console.error('[AddBlog] POST failed', e);
      const msg = e?.error?.message || e?.message || 'Unbekannter Fehler';
      this._error.set(msg);
    } finally {
      this._busy.set(false);
    }
  }

  onReset() {
    this._error.set(null);
    this.formTyped.reset();
  }
}
