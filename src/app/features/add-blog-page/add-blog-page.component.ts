import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AddBlogService } from './add-blog.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBlogComponent {
  private fb = inject(FormBuilder);
  private api = inject(AddBlogService);

  // UI-Status
  private _busy = signal(false);
  private _error = signal<string | null>(null);

  // Form
  formTyped = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Z].*/)],
    }),
    content: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(5)],
    }),
  });

  // Template-Helfer (wie im HTML aufgerufen)
  titleCtrl = () => this.formTyped.controls.title;
  contentCtrl = () => this.formTyped.controls.content;
  hasError = () => !!this._error();
  errorMsg = () => this._error();

  submitDisabled = computed(
    () => this._busy() || this.formTyped.invalid || this.formTyped.pristine,
  );

  async onSubmit() {
    if (this.submitDisabled()) return;
    this._error.set(null);
    this._busy.set(true);
    try {
      await this.api.addBlog({
        title: this.titleCtrl().value,
        content: this.contentCtrl().value,
      });
      // Erfolgreich → Formular leeren
      this.formTyped.reset();
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
