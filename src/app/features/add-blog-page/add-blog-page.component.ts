import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddBlogService, CreatedBlog } from './add-blog.service';
import { Router } from '@angular/router';

type FormShape = {
  title: FormControl<string>;
  content: FormControl<string>;
};

@Component({
  standalone: true,
  selector: 'app-add-blog-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './add-blog-page.component.html',
  styleUrls: ['./add-blog-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBlogPageComponent {
  private destroyRef = inject(DestroyRef);
  private snack = inject(MatSnackBar);
  private addBlogService = inject(AddBlogService);
  private router = inject(Router);

  readonly submitting = signal<boolean>(false);
  readonly errorMsg = signal<string | null>(null);
  readonly hasError = computed(() => !!this.errorMsg());

  readonly formTyped = new FormGroup<FormShape>({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.pattern('^[A-Z].*')],
    }),
    content: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
  });

  constructor() {
    this.formTyped.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => console.log('Form changed:', v));

    this.formTyped.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((s) => console.log('Form status:', s));
  }

  submitDisabled() {
    return this.submitting() || this.formTyped.invalid;
  }

  async onSubmit() {
    this.errorMsg.set(null);

    if (this.formTyped.invalid) {
      this.formTyped.markAllAsTouched();
      return;
    }

    try {
      this.submitting.set(true);
      const payload = this.formTyped.value as CreatedBlog;
      await this.addBlogService.addBlog(payload);

      this.snack.open('Blog erfolgreich veröffentlicht 🎉', 'OK', { duration: 2500 });

      // optional: Formular leeren (wir navigieren eh gleich weg)
      this.formTyped.reset({ title: '', content: '' });

      // ➜ direkt zur Übersicht
      this.router.navigate(['/blogs']);
    } catch (e: unknown) {
      const msg = (e as Error)?.message ?? 'Netzwerk-/Serverfehler';
      this.errorMsg.set(msg);
      this.snack.open('Speichern fehlgeschlagen. Bitte später erneut versuchen.', 'OK', {
        duration: 4000,
      });
    } finally {
      this.submitting.set(false);
    }
  }

  onReset() {
    this.formTyped.reset({ title: '', content: '' });
    this.errorMsg.set(null);
  }

  titleCtrl = () => this.formTyped.get('title')!;
  contentCtrl = () => this.formTyped.get('content')!;
}
