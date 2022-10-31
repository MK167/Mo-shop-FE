import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductsService } from '@mo-shop/products';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'admin-products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(private ProductsService: ProductsService,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnDestroy(): void {
    this.endsubs$.next(1);
    this.endsubs$.complete();
  }

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct() {
    this.ProductsService.getProducts().pipe(takeUntil(this.endsubs$)).subscribe((data) => {
      var count = 0;
      data.forEach(element => {
        count += 1;
        element.autoID = count;
      });
      this.products = data;
    })
  }

  deleteProduct(id: any) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this Product?',
      header: 'Delete Product',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ProductsService.deleteProduct(id).pipe(takeUntil(this.endsubs$)).subscribe((data) => {
          console.log('deleted Successfully');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product Deleted Successfully' });
          timer(1000).toPromise().then(done => {
            this.getProduct();
          })
        },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product not Deleted!' });
          })
      },
      reject: (type: any) => {

      }
    });
  }

  editProduct(id: any) {
    this.router.navigateByUrl(`products/form/${id}`)

  }
}
