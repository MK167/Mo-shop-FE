import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrdersService } from '@mo-shop/orders';
import { ProductsService } from '@mo-shop/products';
import { UsersService } from '@mo-shop/users';
import { combineLatest, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  statistics: any = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private userService: UsersService,
    private productService: ProductsService,
    private ordersService: OrdersService
  ) { }

  ngOnDestroy(): void {
    this.endsubs$.next(1);
    this.endsubs$.complete();
  }

  ngOnInit(): void {
    // combineLatest compile all function as array if all are ready the values are declared in statistics variable
    combineLatest([
      this.ordersService.getOrdersCount(),
      this.productService.getProductsCount(),
      this.userService.getUsersCount(),
      this.ordersService.getTotalSales()
    ]).pipe(takeUntil(this.endsubs$)).subscribe((values) => {
      this.statistics = values;
    });
  }
}
