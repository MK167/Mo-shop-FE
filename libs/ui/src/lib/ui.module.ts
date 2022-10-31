import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiRoutingModule } from './ui-routing.module';
import { BannerComponent } from './banner/banner.component';
import { SliderComponent } from './slider/slider.component';
import {ButtonModule} from 'primeng/button';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    BannerComponent,
    SliderComponent,
  ],
  imports: [
    CommonModule,
    UiRoutingModule,
    ButtonModule,
    RouterModule
  ],
  exports: [
    SliderComponent,
    BannerComponent
  ]
})
export class UiModule { }
