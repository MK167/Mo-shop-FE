import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@mo-shop/users';
import { Cart } from '../../models/cart';
import { OrderItem, Orders } from '../../models/orders';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { take, Subject, takeUntil } from 'rxjs';
import { Users } from '../../../../../users/src/lib/models/user';

@Component({
  selector: 'orders-checkout-page',
  templateUrl: './checkout-page.component.html'
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private ordersService: OrdersService
  ) { }


  checkoutFormGroup!: FormGroup;
  isSubmitted = false;
  orderItems: any;
  countries: any = [];
  unsubscribe$: Subject<any> = new Subject();
  userId: any;
  ngOnInit(): void {
    this._initCheckoutForm();
    this._getCartItems();
    this._getCountries();
    this.autoFillUserData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(1);
    this.unsubscribe$.complete();
  }

  private _initCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
      apartment: ['', Validators.required],
      street: ['', Validators.required]
    });
  }

  private _getCartItems() {
    const cart: Cart = this.cartService.getCart();
    this.orderItems = cart?.items?.map((item) => {
      return {
        product: item.productId,
        quantity: item.quantity
      };
    });
  }

  private autoFillUserData() {
    this.usersService.observeCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe((user) => {
      if(user) {
        this.userId = user.id;
        this.checkoutFormGroup.controls['name'].setValue(user.name);
        this.checkoutFormGroup.controls['email'].setValue(user.email);
        this.checkoutFormGroup.controls['phone'].setValue(user.phone);
        this.checkoutFormGroup.controls['city'].setValue(user.city);
        this.checkoutFormGroup.controls['country'].setValue(user.country);
        this.checkoutFormGroup.controls['zip'].setValue(user.zip);
        this.checkoutFormGroup.controls['apartment'].setValue(user.apartment);
        this.checkoutFormGroup.controls['street'].setValue(user.street);
      }
    })
  }

  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

  backToCart() {
    this.router.navigate(['/cart']);
  }

  placeOrder() {
    this.isSubmitted = true;
    if (this.checkoutFormGroup.invalid) {
      return;
    }

    const order: Orders = {
      orderItems: this.orderItems,
      shippingAddress1: this.checkoutFormGroup.controls['street'].value,
      shippingAddress2: this.checkoutFormGroup.controls['apartment'].value,
      city: this.checkoutFormGroup.controls['city'].value,
      zip: this.checkoutFormGroup.controls['zip'].value,
      country: this.checkoutFormGroup.controls['country'].value,
      phone: this.checkoutFormGroup.controls['phone'].value,
      status: 0,
      user: this.userId,
      dateOrdered: `${Date.now()}`
    };

    this.ordersService.createOrders(order).subscribe(
      () => {
        //redirect to thank you page // payment
        this.cartService.emptyCart();
        this.router.navigate(['/success']);
      },
      () => {
        //display some message to user
      }
    );
  }

  get checkoutForm() {
    return this.checkoutFormGroup.controls;
  }
}
