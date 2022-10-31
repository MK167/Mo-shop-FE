import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Users, UsersService } from '@mo-shop/users';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'admin-users-list',
  templateUrl: './users-list.component.html',
  styles: [
  ]
})
export class UsersListComponent implements OnInit, OnDestroy {

  user: Users[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(private userService: UsersService,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnDestroy(): void {
    this.endsubs$.next(1);
    this.endsubs$.complete();  }
  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.userService.getUsers().pipe(takeUntil(this.endsubs$)).subscribe((data) => {
      var count = 0;
      data.forEach(element => {
        count += 1;
        element.autoID = count;
      });
      this.user = data;
    })
  }

  deleteUser(id: any) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this User?',
      header: 'Delete User',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUsers(id).pipe(takeUntil(this.endsubs$)).subscribe((data) => {
          console.log('deleted Successfully');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Deleted Successfully' });
          timer(1000).toPromise().then(done => {
            this.getUser();
          })
        },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User not Deleted!' });
          })
      },
      reject: (type: any) => {

      }
    });
  }

  editUser(id: any) {
    this.router.navigateByUrl(`users/form/${id}`)
  }
}
