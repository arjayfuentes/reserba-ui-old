import { Component, inject, OnInit } from '@angular/core';
import { Item } from '../../models/item.model';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item-selected',
  imports: [],
  templateUrl: './item-selected.component.html',
  styleUrl: './item-selected.component.css'
})
export class ItemSelectedComponent implements OnInit{

  private itemService = inject(ItemService);

  selectedItem: Item | null  = null;

  ngOnInit(): void {
    this.itemService.selectedItem$.subscribe(
      item => this.selectedItem = item
    );
  }

}
