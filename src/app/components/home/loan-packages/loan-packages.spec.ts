import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPackages } from './loan-packages';

describe('LoanPackages', () => {
  let component: LoanPackages;
  let fixture: ComponentFixture<LoanPackages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanPackages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanPackages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
