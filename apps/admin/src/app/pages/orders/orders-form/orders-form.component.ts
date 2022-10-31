import { Component, OnInit, OnDestroy } from '@angular/core';
import { Orders, OrdersService } from '@mo-shop/orders';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';
import { Location } from '@angular/common';

const ORDER_STATUS: any = {
  0: {
    lable: 'Pending',
    color: 'primary'
  },
  1: {
    lable: 'Processed',
    color: 'warning'
  },
  2: {
    lable: 'Shipped',
    color: 'warning'
  },
  3: {
    lable: 'Delivered',
    color: 'success'
  },
  4: {
    lable: 'Failed',
    color: 'danger'
  }
}
@Component({
  selector: 'admin-orders-form',
  templateUrl: './orders-form.component.html',
  styles: [
  ]
})
export class OrdersFormComponent implements OnInit, OnDestroy {
  endsubs$: Subject<any> = new Subject();

  order!: Orders;
  orderStatuses: any = [];
  selectedStatus: any;
  orderID: any;

  constructor(private orderService: OrdersService, private route: ActivatedRoute, private messageService: MessageService, private location: Location,
  ) {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.orderID = params['id'];
      }
    })
  }
  ngOnDestroy(): void {
    this.endsubs$.next(1);
    this.endsubs$.complete();
  }

  ngOnInit(): void {
    this.getOrderByID();
    this.mapOrderStatus();
  }

  mapOrderStatus() {
    this.orderStatuses = Object.keys(ORDER_STATUS).map(key => {
      return {
        id: key,
        name: ORDER_STATUS[key].lable
      }
    })
  }

  getOrderByID() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.orderService.getOrdersByID(params['id']).pipe(takeUntil(this.endsubs$)).subscribe((data) => {
          this.order = data;
          this.selectedStatus = data.status;
          console.log('s', this.selectedStatus)
        })
      }
    })
  }

  onStatusChange(event: any) {
    this.orderService.updateOrders({ status: event.value }, this.orderID).pipe(takeUntil(this.endsubs$)).subscribe((order) => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order Status Updated Successfully' });
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Order Status not Updated!' });
      })
  }
}
