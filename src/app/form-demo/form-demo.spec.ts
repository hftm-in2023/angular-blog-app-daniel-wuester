import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDemo } from './form-demo';

describe('FormDemo', () => {
  let component: FormDemo;
  let fixture: ComponentFixture<FormDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDemo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
