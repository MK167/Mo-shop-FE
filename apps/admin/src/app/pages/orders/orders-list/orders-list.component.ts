import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Orders, OrdersService } from '@mo-shop/orders';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

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
  selector: 'admin-orders-list',
  templateUrl: './orders-list.component.html',
  styles: [
  ]
})
export class OrdersListComponent implements OnInit, OnDestroy {
  endsubs$: Subject<any> = new Subject();

  order: Orders[] = [];
  orderStatus = ORDER_STATUS;

  constructor(private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private orderService: OrdersService) { }

  ngOnDestroy(): void {
    this.endsubs$.next(1);
    this.endsubs$.complete();
  }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrders().pipe(takeUntil(this.endsubs$)).subscribe((data) => {
      var count = 0;
      data.forEach(element => {
        count += 1;
        element.autoID = count;
      });
      this.order = data;
    })
  }

  deleteOrder(id: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this Order?',
      header: 'Delete Order',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.orderService.deleteOrders(id).pipe(takeUntil(this.endsubs$)).subscribe((data) => {
          console.log('deleted Successfully');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order Deleted Successfully' });
          timer(1000).toPromise().then(done => {
            this.getOrders();
          })
        },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Order not Deleted!' });
          })
      },
      reject: (type: any) => {

      }
    });
  }
  showOrder(id: string) {
    this.router.navigateByUrl(`orders/form/${id}`)
  }
}
