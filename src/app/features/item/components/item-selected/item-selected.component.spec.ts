import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSelectedComponent } from './item-selected.component';

describe('ItemSelectedComponent', () => {
  let component: ItemSelectedComponent;
  let fixture: ComponentFixture<ItemSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemSelectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
