import { Component, OnInit, OnDestroy } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category, Product, ProductsService } from '@mo-shop/products';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html',
  styles: [
  ]
})
export class ProductsFormComponent implements OnInit, OnDestroy {
  editmode = false;
  form!: FormGroup | any;
  isSubmitted = false;
  product: Product[] = [];
  categories: Category[] = [];
  imageDisplay!: string | ArrayBuffer | null | undefined;
  currentProductId!: any;
  endsubs$: Subject<any> = new Subject();


  constructor(private fb: FormBuilder,
    private location: Location,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private ProductsService: ProductsService,
    private CategoriesService: CategoriesService) {

     }
  ngOnDestroy(): void {
    this.endsubs$.next(1);
    this.endsubs$.complete();  }

  ngOnInit(): void {
    this._initForm();
    this.getAllCategories();
    this._checkEditMode();

  }

  getAllCategories() {
    this.CategoriesService.getCategories().pipe(takeUntil(this.endsubs$)).subscribe((category) => {
      this.categories = category;
    })
  }

 private _checkEditMode() {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.editmode = true;
        this.currentProductId = params['id'];
        this.ProductsService.getProductByID(params['id']).subscribe((product) => {
          this.form.controls['name'].setValue(product.name);
          this.form.controls['category'].setValue(product?.category?.id);
          this.form.controls['brand'].setValue(product.brand);
          this.form.controls['price'].setValue(product.price);
          this.form.controls['countInStock'].setValue(product.countInStock);
          this.form.controls['isFeatured'].setValue(product.isFeatured);
          this.form.controls['description'].setValue(product.description);
          this.form.controls['richDescription'].setValue(product.richDescription);
          this.imageDisplay = product?.image;
          this.form.controls['image'].setValidators([]);
          this.form.controls['image'].updateValueAndValidity();
        });
      }
    });
  }
  _initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      description: ['', Validators.required],
      richDescription: [''],
      image: ['', Validators.required],
      isFeatured: [false],
    })
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    else {
      const productFormData = new FormData();
      Object.keys(this.f).map((key) => {
        console.log('key', key);
        productFormData.append(key, this.f[key].value);

      });

      if (this.editmode) {
        this._updateProduct(productFormData);
      }
      else {
        this._addProduct(productFormData);
      }

    }
  }

  private _updateProduct(productFormData: FormData) {
    this.ProductsService.updateProduct(productFormData, this.currentProductId).pipe(takeUntil(this.endsubs$)).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product is updated!'
        });
        timer(2000)
          .toPromise()
          .then(() => {
            this.location.back();
          });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Product is not updated!'
        });
      }
    );
  }

  private _addProduct(productFormData: FormData) {
    this.ProductsService.createProduct(productFormData).pipe(takeUntil(this.endsubs$)).subscribe((data) => {
      console.log('Data Saved', data);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product Added Successfully' });
      timer(2000).toPromise().then(done => {
        this.location.back();
      })
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product not created!' });
      })
  }


  get f() {
    return this.form.controls;
  }

  onImageUpload(event: any) {
    console.log('event', event);
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ image: file });
      this.form.controls['image'].updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result
      }
      fileReader.readAsDataURL(file);
    }
  }

  onCancle() {
    this.location.back();

  }


}
