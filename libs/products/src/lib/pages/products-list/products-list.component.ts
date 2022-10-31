import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';
import { Category } from '../../models/category';
import { CategoriesService } from '../../services/categories.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'products-product-list',
  templateUrl: './products-list.component.html',

})
export class ProductsListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  endSubs$: Subject<any> = new Subject();
  isCategoryPage: boolean = false;
  categories: Category[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService,
    private categoryService: CategoriesService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params)=>{
      params['categoryid'] ? this.getAllProducts([params['categoryid']]) : this.getAllProducts();
      params['categoryid'] ? (this.isCategoryPage = true) : (this.isCategoryPage = false);
    });
    this.getAllCategories()
  }

  ngOnDestroy(): void {
    this.endSubs$.next(1);
    this.endSubs$.complete();
  }

  getAllProducts(categoryFilter?: string[]) {
    this.productsService.getProducts(categoryFilter)
      .pipe(takeUntil(this.endSubs$))
      .subscribe((product) => {
        this.products = product;
        console.log('data', product)
      })
  }

  getAllCategories() {
    this.categoryService.getCategories()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((category) => {
        this.categories = category;
      })
  }

  categoryFilter() {
    const selectedCategories: any = this.categories.filter(category => category.checked).map(category => category.id);
    this.getAllProducts(selectedCategories);
  }
}
