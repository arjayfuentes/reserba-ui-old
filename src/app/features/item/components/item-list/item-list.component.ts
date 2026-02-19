import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Item } from '../../models/item.model';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { ItemService } from '../../services/item.service';
import { map, Subject, takeUntil, tap } from 'rxjs';
import { ItemFormComponent } from "../item-form/item-form.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-list',
  imports: [CommonModule, ItemFormComponent, FormsModule, KeyValuePipe],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css'
})
export class ItemListComponent implements OnInit, OnDestroy{

  private itemService = inject(ItemService);
  private destroy$ = new Subject<void>();
  
  categories: string[] = [];
  modifiedCategoriesWithCat: string[] = [];

  categorySum: Record<string, number> = {};
  errorMessage: string | null = null;
  filteredByName: string = '';
  filteredItems: Item [] = [];
  isLoading: boolean = false;
  items: Item[] = [];
  selectedItem: Item | null = null;
  selectedCategory: string = '';
  selectedCategories: string[] = [];
  sum: number = 0;
  

  ngOnInit(): void {
    this.getCategories();
    this.getItems();
    this.getSumPriceOfCategories();
  }

  ngOnDestroy(): void { 
    this.destroy$.next(); 
    this.destroy$.complete(); 
  }

  private getCategories() {
     this.itemService.getCategories()
      .pipe(
        takeUntil(this.destroy$),
       // 1. First transformation: Add "-cat"
        map(data => data.map(cat => `${cat}-cat`)),
        tap(catVersion => this.modifiedCategoriesWithCat = catVersion),

        // 2. Second transformation: Remove "-cat" to go back to original
        map(data => data.map(cat => cat.replace('-cat', ''))),
        tap(backToOriginal => console.log('Back to Original:', backToOriginal))
      )
      .subscribe({
        next: (transformedData) => {
          this.categories = transformedData;
        },
        error: (err) => console.log()
      });
  }

  private getItems() {
    this.isLoading = true;
    this.itemService.getItems()
      .pipe(
        tap(res=> console.log('Fetched items: ', res))
      ).subscribe({
        next: (data) => {
          console.log(data);
          this.items = data;
          this.filteredItems = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        }
      });
  }

  private getSumPriceOfCategories() {
    this.itemService.getSumPriceOfCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(data) => {
          this.categorySum = data;
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  filterChangeName() {
    const search = this.filteredByName.toLowerCase().trim();
    if (!search) {
      this.filteredItems = this.items;   // reset to original
      return;
    }
    this.filteredItems = this.items.filter(item =>
      item.name.toLowerCase().includes(search)
    );
  }

  handleAddedItem(item: Item) {
    console.log(item);
    this.getItems();
  }

  handleUpdatedItem(item: Item) {
    console.log(item);
    this.getItems();
  } 

  onDelete(id: string | undefined) {
    this.itemService.deleteItem(id)
        .pipe(
          tap(res=> console.log(res)),
          takeUntil(this.destroy$)
        ).subscribe(() => {
          this.items = this.items.filter(item => item.id != id);
        });
  }

  onEdit(item: Item | null) {
    this.selectedItem = item;
  }

  onGetSumPerCategory() {
    this.itemService.getSumPriceOfCategory(this.selectedCategory)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next:(data) => {
          this.sum = data;
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  onSelectItem(item: Item) {
    this.itemService.updateSelectedItem(item);
  }

  onToggleCategory(category: string, checked: boolean): void {
    let newList = [...this.selectedCategories];

    if (checked) {
      // add category if not already present
      if (!newList.includes(category)) {
        newList.push(category);
      }
    } else {
      // remove category
      newList = newList.filter(c => c !== category);
    }

    this.selectedCategories = newList;
    
    if (newList.length === 0) {
      this.getItems();
    } else {
      this.itemService.filterItemsByCategories(newList)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.items = data;
            this.filteredItems = data;
          },
          error: (err) => {
            console.log('Failed to filter items');
          }
        });
    }
  }
  

}
