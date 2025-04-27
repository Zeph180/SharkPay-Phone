import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MomoPage } from './momo.page';

describe('MomoPage', () => {
  let component: MomoPage;
  let fixture: ComponentFixture<MomoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MomoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
