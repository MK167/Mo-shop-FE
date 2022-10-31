import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@mo-shop/users';
import { CategoriesFormComponent } from './pages/categories/categories-form/categories-form.component';
import { CategoriesTableComponent } from './pages/categories/categories-table/categories-table.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrdersFormComponent } from './pages/orders/orders-form/orders-form.component';
import { OrdersListComponent } from './pages/orders/orders-list/orders-list.component';
import { ProductsFormComponent } from './pages/products/products-form/products-form.component';
import { ProductsListComponent } from './pages/products/products-list/products-list.component';
import { UsersFormComponent } from './pages/users/users-form/users-form.component';
import { UsersListComponent } from './pages/users/users-list/users-list.component';
import { ShellComponent } from './shared/shell/shell.component';


const routes: Routes = [
  {
    path: '', component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '', redirectTo: 'dashboard', pathMatch: 'full'
      },
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'categories', component: CategoriesTableComponent
      },
      {
        path: 'categories/form', component: CategoriesFormComponent
      },
      {
        path: 'categories/form/:id', component: CategoriesFormComponent
      },
      {
        path: 'users', component: UsersListComponent
      },
      {
        path: 'users/form', component: UsersFormComponent
      },
      {
        path: 'users/form/:id', component: UsersFormComponent
      },
      {
        path: 'products', component: ProductsListComponent
      },
      {
        path: 'products/form', component: ProductsFormComponent
      },
      {
        path: 'products/form/:id', component: ProductsFormComponent
      },
      {
        path: 'orders', component: OrdersListComponent
      },
      {
        path: 'orders/form', component: OrdersFormComponent
      },
      {
        path: 'orders/form/:id', component: OrdersFormComponent
      },
    ]
  },

]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
  ],
  exports:[],
  declarations: [],
})
export class AppRoutingModule { }
