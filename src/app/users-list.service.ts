import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersListService {

  private url: string = "/assets/sample.json";

  private genderCount$ = new BehaviorSubject<any>({});
  selectedCount$ = this.genderCount$.asObservable();

  constructor(private http: HttpClient) { }

  // calling dummy json file
  getUsersList(): Observable<any> {
    return this.http.get(this.url);
  }

  setProduct(list:any) {
    this.genderCount$.next(list);
  }
}
