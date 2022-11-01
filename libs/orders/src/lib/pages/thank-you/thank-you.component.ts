import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'orders-thank-you-page',
  templateUrl: './thank-you.component.html',
  styles: [
  ]
})
export class ThankYouComponent implements OnInit {

  constructor(private orderService: OrdersService, private cartService: CartService) { }

  ngOnInit(): void {
    const orderData = this.orderService.getCashedOrderData();
    this.orderService.createOrders(orderData).subscribe((data) => {
      this.cartService.emptyCart();
      this.orderService.removeCashedOrderData();
    })
  }

}
