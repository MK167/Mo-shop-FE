import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '@mo-shop/products';
import { CategoriesService } from '@mo-shop/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'admin-categories-table',
  templateUrl: './categories-table.component.html'
})
export class CategoriesTableComponent implements OnInit, OnDestroy {

  category: Category[] = [];
  endsubs$: Subject<any> = new Subject();
  constructor(private CategoriesService: CategoriesService,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
  ) { }
  ngOnInit(): void {
    this.getCategory();
  }

  ngOnDestroy() {
    this.endsubs$.next(1);
    this.endsubs$.complete();
  }
  getCategory() {
    this.CategoriesService.getCategories().pipe(takeUntil(this.endsubs$)).subscribe((data) => {
      let count = 0;
      data.forEach(element => {
        count += 1;
        element.autoID = count;
      });
      this.category = data;
    })
  }

  deleteCategory(id: any) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this Category?',
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.CategoriesService.deleteCategory(id).pipe(takeUntil(this.endsubs$)).subscribe((data) => {
          console.log('deleted Successfully');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category Deleted Successfully' });
          timer(1000).toPromise().then(done => {
            this.getCategory();
          })
        },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Category not Deleted!' });
          })
      },

    });
  }

  editCategory(id: any) {
    this.router.navigateByUrl(`categories/form/${id}`)
  }
}
