import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ui-slider',
  templateUrl: './slider.component.html',
})
export class SliderComponent implements OnInit {

  selectedImageUrl!: string;

  @Input() imagesURL!: any;

  ngOnInit(): void {
    if (this.hasImages) {
      this.selectedImageUrl = this.imagesURL[0];
    }
  }

  changeSelectedImage(imageUrl: string) {
    this.selectedImageUrl = imageUrl;
  }

  get hasImages() {
    return this.imagesURL?.length > 0;
  }
}
