import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommissionTransactionsPage } from './commission-transactions.page';

describe('CommissionTransactionsPage', () => {
  let component: CommissionTransactionsPage;
  let fixture: ComponentFixture<CommissionTransactionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionTransactionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
