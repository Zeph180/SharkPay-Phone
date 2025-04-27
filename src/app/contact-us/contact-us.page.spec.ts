import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactUSPage } from './contact-us.page';

describe('ContactUSPage', () => {
  let component: ContactUSPage;
  let fixture: ComponentFixture<ContactUSPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactUSPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
