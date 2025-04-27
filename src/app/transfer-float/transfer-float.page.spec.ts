import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransferFloatPage } from './transfer-float.page';

describe('TransferFloatPage', () => {
  let component: TransferFloatPage;
  let fixture: ComponentFixture<TransferFloatPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferFloatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
