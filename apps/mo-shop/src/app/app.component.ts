import { Component, OnInit } from '@angular/core';
import { UsersService } from '@mo-shop/users';

@Component({
  selector: 'mo-shop-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'mo-shop';

  constructor(private usersService: UsersService){

  }

  ngOnInit(): void {
    this.usersService.initAppSession();
  }
}
