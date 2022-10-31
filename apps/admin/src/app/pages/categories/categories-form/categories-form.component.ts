import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from '@mo-shop/products';
import { Category } from '@mo-shop/products';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'mo-shop-categories-form',
  templateUrl: './categories-form.component.html'
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isSubmitted: boolean = false;
  editmode = false;
  categoryID: any;
  endsubs$: Subject<any> = new Subject();

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private CategoriesService: CategoriesService) { }

  ngOnDestroy(): void {
    this.endsubs$.next(1);
    this.endsubs$.complete();
  }

  ngOnInit(): void {

    this._checkEditMode();

    this.form = this.fb.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color: ['', Validators.required],
    })
  }
  private _checkEditMode() {
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.editmode = true;
        this.categoryID = params['id'];
        this.CategoriesService.getCategoryByID(params['id']).pipe(takeUntil(this.endsubs$)).subscribe((data) => {
          console.log('data', data);
          this.form.controls['name'].setValue(data.name);
          this.form.controls['icon'].setValue(data.icon);
          this.form.controls['color'].setValue(data.color);
        })
      }
    })
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    let newData: Category = {
      id: this.categoryID,
      name: this.form.controls['name'].value,
      icon: this.form.controls['icon'].value,
      color: this.form.controls['color'].value,
    }

    if (this.editmode) {
      this.UpdateCategory(newData);
    }
    else {
      this.CreateCategory(newData);
    }
  }

  CreateCategory(newData: Category) {
    this.CategoriesService.createCategory(newData).pipe(takeUntil(this.endsubs$)).subscribe((data) => {
      console.log('Data Saved', data);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category Added Successfully' });
      timer(2000).toPromise().then(done => {
        this.location.back();
      })
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Category not created!' });
      })
  }

  UpdateCategory(newData: Category) {
    this.CategoriesService.updateCategory(newData).pipe(takeUntil(this.endsubs$)).subscribe((data) => {
      console.log('Data Saved', data);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category Updated Successfully' });
      timer(2000).toPromise().then(done => {
        this.location.back();
      })
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Category not Updated!' });
      })
  }
}
