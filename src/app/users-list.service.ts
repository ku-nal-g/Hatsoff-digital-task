import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersListService {

  private baseUrl: string = "http://localhost:3000/people";

  private genderCount$ = new BehaviorSubject<any>({});
  selectedCount$ = this.genderCount$.asObservable();

  constructor(private http: HttpClient) { }

  // calling dummy json file
  getUsersList(): Observable<any> {
    return this.http.get(this.baseUrl);
  }
  // put data in json file
  putUsersList(id:string,reqObj:any){
    return this.http.put(this.baseUrl+'/'+id,reqObj);
  }
  //delete data in json file
  deleteUser(id:String){
    return this.http.delete(this.baseUrl+'/'+id);
  }
  setProduct(list:any) {
    this.genderCount$.next(list);
  }
}
