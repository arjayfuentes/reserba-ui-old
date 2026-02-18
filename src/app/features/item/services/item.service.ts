import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Item } from '../models/item.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private http = inject(HttpClient);
  private readonly apiUrl = "http://localhost:8080/api/v1/items";

  private selectedItemSubject = new BehaviorSubject<Item | null>(null);

  //for components listening to selectedItem
  selectedItem$ = this.selectedItemSubject.asObservable();

  //for components updating the selectedItem
  updateSelectedItem(item: Item) {
    this.selectedItemSubject.next(item);
  }

  saveItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, item);
  }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  
  }

  updateItem(id: string | undefined, item: Item | null): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/${id}`, item);
  }

  deleteItem(id: string | undefined ): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  // --------------------- NON CRUD -------------------------
  filterItemsByCategories(categories: string[]): Observable<Item[]> {
    return this.http.post<Item[]>(`${this.apiUrl}/filterItemsByCategories`, categories) ;
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  getSumPriceOfCategory(category: string): Observable<number> {
    const params = new HttpParams().set('category', category);
    return this.http.get<number>(`${this.apiUrl}/getSumPriceOfCategory`, { params });
  }

  getSumPriceOfCategories(): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/getSumPriceOfCategories`) ;
  }

}


