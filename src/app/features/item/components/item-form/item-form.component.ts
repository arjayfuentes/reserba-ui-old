import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';
import { CommonModule } from '@angular/common';
import { debounceTime, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-item-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.css'
})
export class ItemFormComponent implements OnChanges, OnInit, OnDestroy {
   

  private fb = inject(FormBuilder);
  private itemService = inject(ItemService);
  private destroy$ = new Subject<void>();
  
  activeTheme: 'light' | 'dark' = 'light';
  get themeStyles() {
    return this.activeTheme === 'dark'
      ? { background: '#222', color: '#fff', padding: '10px' }
      : { background: '#eee', color: '#000', padding: '10px' };
  }
  get themeClass() {
    return this.activeTheme === 'dark' ? 'dark-mode' : 'light-mode';
  }

  @Input() itemToEdit: Item | null = null;
  @Output() itemAddedChange = new EventEmitter<Item>();
  @Output() itemEditChange = new EventEmitter<Item>();

  categories = ['Electronics', 'Books', 'Clothing', 'Home'];
  itemForm = this.fb.nonNullable.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required]],
    price:[0, [Validators.required]],
    imageUrl: ['', [Validators.required]],
    category: ['Electronic']
  });

    // No FormBuilder needed here
    // itemForm = new FormGroup({
    //   id: new FormControl(''),
    //   name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    //   description: new FormControl('', [Validators.required]),
    //   price: new FormControl(0, [Validators.required]),
    //   imageUrl: new FormControl('', [Validators.required])
    // });

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['itemToEdit']) {
      const item = this.itemToEdit;
      if(item) {
        this.itemForm.patchValue(item);
      }
    }
  }

  ngOnInit(): void {
    this.itemForm.get('name')?.valueChanges.pipe(
      debounceTime(400), // Wait for the user to stop typing
      takeUntil(this.destroy$)
      // distinctUntilChanged(),   // Only search if the text actually changed
      // switchMap(searchTerm => {
      //   console.log('Starting new search for:', searchTerm);
      //   return this.itemService.getCategories()); // The inner observable
      // }),
    ).subscribe( data=> {
      console.log('name change');
    })
  }

  ngOnDestroy(): void { 
    this.destroy$.next(); 
    this.destroy$.complete(); 
  }

  onSubmit() {
    if(this.itemForm.valid) {
      const item: Item = this.itemForm.getRawValue();

      if(item.id) {
        this.itemService.updateItem(item.id, item)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data)=> {
              this.itemEditChange.emit(data);
              this.itemForm.reset();
            },
            error: (err) => {
              console.log(err);
            }
          });
      } else {
        this.itemService.saveItem(item)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data) => {
              this.itemAddedChange.emit(data);
              this.itemForm.reset();
            },
            error: (err) => {
              console.log(err);
            }
          });
      }
      
    }
  }

  toggleTheme() {
    this.activeTheme = this.activeTheme ==='dark' ? 'light' : 'dark';
  }

}
