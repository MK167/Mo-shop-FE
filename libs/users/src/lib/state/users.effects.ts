import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { concatMap, of, map, catchError } from 'rxjs';

import * as UsersActions from './users.actions';
import * as UsersFeature from './users.reducer';
import { LocalstorageService } from '../services/localstorage.service';
import { UsersService } from '../services/users.service';

@Injectable()
export class UsersEffects {
// Step 5

  buildUserSession$ = createEffect(() =>
  this.actions$.pipe(
    ofType(UsersActions.bulidUsersSession),
    concatMap(() => {
      if (this.localstorageService.isValidToken()) {
        const userId = this.localstorageService.getUserIdFromToken();
        if (userId) {
          return this.usersService.getUsersByID(userId).pipe(
            map((user) => {
              console.log('usr in map', user)
              return UsersActions.bulidUsersSuccess({ user: user })
            }),
            catchError(() => of(UsersActions.bulidUsersFailure()))
          )
        }
        else {
          return of(UsersActions.bulidUsersFailure())
        }
      }
      else {
        return of(UsersActions.bulidUsersFailure())
      }
    })
  ))

  constructor(
    private readonly actions$: Actions,
    private localstorageService: LocalstorageService,
    private usersService: UsersService) { }
}
