import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Category } from '../models/category';
import { environment } from '@env/environnment';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  BaseUrl = environment.apiUrl;
  Category = 'categories';

  constructor(private Http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.Http.get<Category[]>(this.BaseUrl + this.Category).pipe(
      shareReplay()
    )
  }
  getCategoryByID(categoryID: any): Observable<Category> {
    return this.Http.get<Category>(this.BaseUrl + `${this.Category}/${categoryID}`).pipe(
      shareReplay()
    )
  }
  createCategory(data: any): Observable<Category> {
    return this.Http.post<Category>(this.BaseUrl + this.Category, data).pipe(
      shareReplay()
    )
  }
  deleteCategory(categoryID: any): Observable<Category> {
    return this.Http.delete<Category>(this.BaseUrl + `${this.Category}/${categoryID}`).pipe(
      shareReplay()
    )
  }
  updateCategory(data: Category): Observable<Category> {
    return this.Http.put<Category>(this.BaseUrl + this.Category + '/' + data.id, data).pipe(
      shareReplay()
    )
  }
}
