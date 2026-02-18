import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ItemListComponent } from "./features/item/components/item-list/item-list.component";
import { ItemSelectedComponent } from "./features/item/components/item-selected/item-selected.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ItemListComponent, ItemSelectedComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'reserba-ui-old';
}
