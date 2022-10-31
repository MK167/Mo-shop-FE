import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart, CartItem } from '../models/cart';
import { BehaviorSubject, map, Subject } from 'rxjs';

// we did it to reduce the hard coded in code file
export const CART_KEY = "cart";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // make observer to add number of quantity to cart in the real time
  // if used Subject cart = 0 after reload page becuase subject is not ready in constructor yet so next = 0, so we used BehaviorSubject
  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());


  constructor() { }

  // D-INJECTION to Inject it to products
  intialCartLocalStorage() {
    const cart: Cart = this.getCart();
    if (!localStorage.getItem(CART_KEY)) {
      const intialCart = {
        items: []
      }
      const intialCartJson = JSON.stringify(intialCart);
      localStorage.setItem(CART_KEY, intialCartJson);
    }
    else {
      this.cart$.next(cart);
    }
  }

  getCart(): Cart {
    const cartJsonString: string = (localStorage.getItem(CART_KEY) || '{}');
    const cart: Cart = JSON.parse(cartJsonString);
    return cart;
  }

  setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
    const cart = this.getCart();
    const cartItemExist = cart.items?.find((item) => item.productId === cartItem.productId);
    if (cartItemExist) {
      cart.items?.map((item: any) => {
        if (item.productId === cartItem.productId) {
          if (updateCartItem) {
            item.quantity = cartItem.quantity;
          } else {
            item.quantity = item.quantity + cartItem.quantity;
          }
          return item;
        }
      });
    }
    else {
      cart.items?.push(cartItem);
    }

    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJson);
    this.cart$.next(cart);
    return cart;
  }

  deleteCartItem(productId: string) {
    const cart = this.getCart();
    const newCart = cart?.items?.filter((item) => item.productId !== productId);

    cart.items = newCart;

    const cartJsonString = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJsonString);

    this.cart$.next(cart);
  }


  emptyCart() {
    const intialCart = {
      items: []
    };
    const intialCartJson = JSON.stringify(intialCart);
    localStorage.setItem(CART_KEY, intialCartJson);
    this.cart$.next(intialCart);
  }

}
