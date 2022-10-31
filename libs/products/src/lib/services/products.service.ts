import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import { environment } from '@env/environnment';
import { Product } from '../models/product';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  BaseUrl = environment.apiUrl;
  Product = 'products';

  constructor(private Http: HttpClient) { }

  getProducts(categoryFilter?: string[]): Observable<Product[]> {
    let params = new HttpParams();
    if (categoryFilter) {
      params = params.append('categories', categoryFilter.join(','));
    }
    return this.Http.get<Product[]>(this.BaseUrl + this.Product, { params: params }).pipe(
      shareReplay()
    )
  }
  getProductByID(ProductID: any): Observable<Product> {
    return this.Http.get<Product>(this.BaseUrl + `${this.Product}/${ProductID}`).pipe(
      shareReplay()
    )
  }
  createProduct(data: any): Observable<Product> {
    return this.Http.post<Product>(this.BaseUrl + this.Product, data).pipe(
      shareReplay()
    )
  }
  deleteProduct(ProductID: any): Observable<Product> {
    return this.Http.delete<Product>(this.BaseUrl + `${this.Product}/${ProductID}`).pipe(
      shareReplay()
    )
  }
  updateProduct(data: any, productid: string): Observable<Product> {
    return this.Http.put<Product>(this.BaseUrl + this.Product + '/' + productid, data).pipe(
      shareReplay()
    )
  }

  getProductsCount(): Observable<number> {
    return this.Http
      .get<number>(`${this.BaseUrl + this.Product}/get/count`)
      .pipe(map((objectValue: any) => objectValue.productCount));
  }

  getFeaturedProducts(count: number): Observable<Product[]> {
    return this.Http.get<Product[]>(`${this.BaseUrl + this.Product}/get/featured/${count}`);
  }


}
