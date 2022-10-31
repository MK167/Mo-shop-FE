import { Component, OnInit, OnDestroy } from '@angular/core';
import { Category } from '@mo-shop/products';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'product-categories-banner',
  templateUrl: './categories-banner.component.html',
  styles: [
  ]
})
export class CategoriesBannerComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(private categoryService: CategoriesService) { }


  ngOnInit(): void {
    this.getAllCategories();
  }

  ngOnDestroy() {
    this.endsubs$.next(1);
    this.endsubs$.complete();
  }

  getAllCategories() {
    this.categoryService.getCategories().pipe((takeUntil(this.endsubs$))).subscribe((data)=>{
      this.categories = data;
      console.log('CATEGORIES', this.categories);
    })
  }
}
