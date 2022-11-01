import { Injectable } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as UsersActions from './users.actions';
import * as UsersSelectors from './users.selectors';

@Injectable()
export class UsersFacade {
  // Step 2

  currentUser$: any  = this.store.pipe(select(UsersSelectors.getUser));
  isAuthenticated$ = this.store.pipe(select(UsersSelectors.getUserIsAuth));

  constructor(private readonly store: Store) { }

  bulidUserSession() {
    this.store.dispatch(UsersActions.bulidUsersSession());
  }
}
