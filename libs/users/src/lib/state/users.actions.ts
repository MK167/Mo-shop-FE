import { createAction, props } from '@ngrx/store';
import { UsersEntity } from './users.models';
import { Users } from '../models/user';

// Step 1
export const bulidUsersSession = createAction('[Users] Build User Session');

export const bulidUsersSuccess = createAction(
  '[Users] Build User Session Success',
  props<{ user: Users }>()
);

export const bulidUsersFailure = createAction(
  '[Users] Build User Session Failure',
);
