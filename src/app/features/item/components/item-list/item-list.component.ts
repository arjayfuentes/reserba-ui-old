import { Component, inject, OnInit } from '@angular/core';
import { Item } from '../../models/item.model';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { ItemService } from '../../services/item.service';
import { tap } from 'rxjs';
import { ItemFormComponent } from "../item-form/item-form.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-list',
  imports: [CommonModule, ItemFormComponent, FormsModule, KeyValuePipe],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css'
})
export class ItemListComponent implements OnInit{

  private itemService = inject(ItemService);

  categories: string[] = [];
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

  private getCategories() {
     this.itemService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.log()
    })
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
    this.itemService.getSumPriceOfCategories().subscribe({
      next:(data) => {
        this.categorySum = data;
      },
      error: (err) => {
        console.log(err);
      }
    })
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
          tap(
            res=> console.log(res)
          )
        ).subscribe(() => {
          this.items = this.items.filter(item => item.id != id);
        });
  }

  onEdit(item: Item | null) {
    this.selectedItem = item;
  }

  onGetSumPerCategory() {
    this.itemService.getSumPriceOfCategory(this.selectedCategory).subscribe({
      next:(data) => {
        this.sum = data;
      },
      error: (err) => {
        console.log(err);
      }
    })
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
      this.itemService.filterItemsByCategories(newList).subscribe({
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
