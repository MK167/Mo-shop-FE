import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as UsersActions from './users.actions';
import { UsersEntity } from './users.models';
import { Users } from '../models/user';

export const USERS_FEATURE_KEY = 'users';

// Step 4
export interface UsersState {
  user: Users,
  isAuthenticated: boolean
}

export interface UsersPartialState {
  readonly [USERS_FEATURE_KEY]: UsersState;
}

export const initialUsersState: UsersState = {
  user: null as any,
  isAuthenticated: false
}

const usersReducer = createReducer(
  initialUsersState,
  on(UsersActions.bulidUsersSession, (state) => ({ ...state })),
  on(UsersActions.bulidUsersSuccess, (state, action) => (
    {
      ...state,
      user: action.user,
      isAuthenticated: true
    }
  )),
  on(UsersActions.bulidUsersFailure, (state, action) => (
    {
      ...state,
      user: null as any,
      isAuthenticated: false
    }
  )),
);


export function reducer(state: UsersState | undefined, action: Action) {
  return usersReducer(state, action);
}

