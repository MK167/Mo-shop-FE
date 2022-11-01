import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environnment';
import { map, Observable, shareReplay, switchMap } from 'rxjs';
import { OrderItem, Orders } from '../models/orders';
import { StripeService } from 'ngx-stripe';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  BaseUrl = environment.apiUrl;
  orders = 'orders';
  products = 'products';

  constructor(private Http: HttpClient, private stripeService: StripeService) { }

  getOrders(): Observable<Orders[]> {
    return this.Http.get<Orders[]>(this.BaseUrl + this.orders).pipe(
      shareReplay()
    )
  }
  getOrdersByID(ordersID: any): Observable<Orders> {
    return this.Http.get<Orders>(this.BaseUrl + `${this.orders}/${ordersID}`).pipe(
      shareReplay()
    )
  }
  createOrders(data: any): Observable<Orders> {
    return this.Http.post<Orders>(this.BaseUrl + this.orders, data).pipe(
      shareReplay()
    )
  }
  deleteOrders(ordersID: any): Observable<Orders> {
    return this.Http.delete<Orders>(this.BaseUrl + `${this.orders}/${ordersID}`).pipe(
      shareReplay()
    )
  }
  updateOrders(orderStatus: { status: string }, orderID: string): Observable<Orders> {
    return this.Http.put<Orders>(this.BaseUrl + this.orders + '/' + orderID, orderStatus).pipe(
      shareReplay()
    )
  }

  // We add get products here to solve problem of Circular Dependancies Between libs (solution 1)
  // We can solve this problem to create a ne base library has products and orders models and services (solution 2)

  getProduct(productId: any): Observable<any> {
    return this.Http.get<any>(`${this.BaseUrl + this.products}/${productId}`);
  }

  getOrdersCount(): Observable<number> {
    return this.Http
      .get<number>(`${this.BaseUrl + this.orders}/get/count`)
      .pipe(map((objectValue: any) => objectValue.orderCount));
  }

  getTotalSales(): Observable<number> {
    return this.Http
      .get<number>(`${this.BaseUrl + this.orders}/get/totalsales`)
      .pipe(map((objectValue: any) => objectValue.totalsales));
  }

  createCheckoutSession(orderItem: OrderItem[]): Observable<any> {
    return this.Http.post<any>(`${this.BaseUrl + this.orders}/create-checkout-session`, orderItem).pipe(
      shareReplay(),
      switchMap((session: { id: string }) => {
        return this.stripeService.redirectToCheckout({ sessionId: session.id })
      })
    )
  }

  cacheOrderData(order: Orders) {
    localStorage.setItem('orderData', JSON.stringify(order));
  }

  getCashedOrderData() {
    return JSON.parse(localStorage.getItem('orderData') || '{}')
  }

  removeCashedOrderData() {
    localStorage.removeItem('orderData')
  }
}
