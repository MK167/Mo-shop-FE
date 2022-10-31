import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { UiModule } from '@mo-shop/ui';
import {AccordionModule} from 'primeng/accordion';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NavComponent } from './shared/components/nav/nav.component';
import { ProductsModule } from '@mo-shop/products';
import { HttpClientModule } from '@angular/common/http';
import { OrdersModule } from '@mo-shop/orders';
import { MessagesComponent } from './shared/messages/messages.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


// Declare Routes
const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
//   {
//     path: 'products',
//     component: ProductListComponent,
//   },
];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    MessagesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AccordionModule,
    RouterModule.forRoot(routes),
    UiModule,
    ProductsModule,
    OrdersModule,
    ToastModule,

  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
  exports: [
    MessagesComponent
  ],
})
export class AppModule {}
