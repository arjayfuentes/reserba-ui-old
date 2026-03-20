import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemListComponent } from './item-list.component';
import { ItemService } from '../../services/item.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('ItemListComponent', () => {
  let component: ItemListComponent;
  let fixture: ComponentFixture<ItemListComponent>;
  let mockItemService: jasmine.SpyObj<ItemService>;

  beforeEach(async () => {
    // 1. Create a "Spy" (Mock) for the service
    mockItemService = jasmine.createSpyObj('ItemService', [
      'getCategories', 
      'getItems', 
      'getSumPriceOfCategories',
      'deleteItem'
    ]);

    // 2. Set default return values for ngOnInit calls
    mockItemService.getCategories.and.returnValue(of(['Food', 'Drinks']));
    mockItemService.getItems.and.returnValue(of([]));
    mockItemService.getSumPriceOfCategories.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      // Import the standalone component and necessary modules
      imports: [ItemListComponent, FormsModule], 
      // Replace the real ItemService with our Mock
      providers: [
        { provide: ItemService, useValue: mockItemService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // This triggers ngOnInit()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});