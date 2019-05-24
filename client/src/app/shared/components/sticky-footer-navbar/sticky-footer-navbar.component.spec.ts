import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StickyFooterNavbarComponent } from './sticky-footer-navbar.component';

describe('StickyFooterNavbarComponent', () => {
  let component: StickyFooterNavbarComponent;
  let fixture: ComponentFixture<StickyFooterNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StickyFooterNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StickyFooterNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
