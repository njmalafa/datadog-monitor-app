import { Component } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { OnInit } from '@angular/core';
import  axios  from 'axios';
import { Observable } from 'rxjs';
// import { createClient } from 'ldapjs-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginData:any = {};
  loginError:any = {};
  successMessage:boolean = false;
  errorMessage:boolean = false;
  loadHomepage = false;
  selectedUser:any;
  userRoleBindings:any = {}; 
  username: any;
  user: any;
  constructor(private http: HttpClient){}

  ngOnInit(){
   
  }

  getUser(username: string, password: string): Observable<any> {
    const url = `/users/${username}/${password}`;
    return this.http.get<any>(url);
  }

  searchUser() {
    this.getUser(this.loginData.username,this.loginData.password).subscribe(
      (response) => {
        this.user = response;
        console.log(this.user,"user");
      },
      (error) => {
        console.log(error);
      }
      
    );
  }
  }
  




