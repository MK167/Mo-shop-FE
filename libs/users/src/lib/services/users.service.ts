import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environnment';
import { map, Observable, shareReplay } from 'rxjs';
import { Users } from '../models/user';
import * as countriesLib from 'i18n-iso-countries';
declare const require: (arg0: string) => countriesLib.LocaleData;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  BaseUrl = environment.apiUrl;
  Users = 'users';

  constructor(private Http: HttpClient) {
    countriesLib.registerLocale(require('i18n-iso-countries/langs/en.json'));

   }

  getUsers(): Observable<Users[]> {
    return this.Http.get<Users[]>(this.BaseUrl + this.Users).pipe(
      shareReplay()
    )
  }
  getUsersByID(UsersID: any): Observable<Users> {
    return this.Http.get<Users>(this.BaseUrl + `${this.Users}/${UsersID}`).pipe(
      shareReplay()
    )
  }
  createUsers(data: Users): Observable<Users> {
    return this.Http.post<Users>(this.BaseUrl + this.Users, data).pipe(
      shareReplay()
    )
  }
  deleteUsers(UsersID: any): Observable<Users> {
    return this.Http.delete<Users>(this.BaseUrl + `${this.Users}/${UsersID}`).pipe(
      shareReplay()
    )
  }
  updateUsers(data: Users): Observable<Users> {
    return this.Http.put<Users>(this.BaseUrl + this.Users + '/' + data.id, data).pipe(
      shareReplay()
    )
  }

  getCountries(): { id: string; name: string }[] {
    return Object.entries(countriesLib.getNames('en', { select: 'official' })).map((entry) => {
      return {
        id: entry[0],
        name: entry[1]
      };
    });
  }

  getCountry(countryKey: string): string {
    return countriesLib.getName(countryKey, 'en');
  }

  getUsersCount(): Observable<number> {
    return this.Http
      .get<number>(`${this.BaseUrl + this.Users}/get/count`)
      .pipe(map((objectValue: any) => objectValue.userCount));
  }

}


