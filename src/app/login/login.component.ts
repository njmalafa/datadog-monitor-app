import { Component } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { DataService } from 'src/shared/data-service';
import { Router } from '@angular/router';
// import { createClient } from 'ldapjs-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  DD_API_KEY : any;
  DD_APP_KEY : any;
  loginData:any = {};
  loginError:any = {};
  successMessage:boolean = false;
  errorMessage:boolean = false;
  loadHomepage = false;
  constructor(private http: HttpClient, private dataService:DataService, private router:Router){}

  ngOnInit(){
   
  }

  
  // loginForm(){

  //   if(this.isLoginValid()){
  //     const headers = new HttpHeaders()
  //     .set('Content-Type', 'application/json')
  //     // .set('DD-API-KEY', this.DD_API_KEY)
  //     // .set('DD-APPLICATION-KEY', this.DD_APP_KEY)
  //     .set('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
  
  //     this.http.post('/authenticate', JSON.stringify(this.loginData), { headers })
  //     .subscribe((response : any) => {
  //       console.log(response,"response")
  //       this.successMessage= true;
  //       if(response.message === 'Authentication successful'){
  //         this.loginData = {};
  //         this.successMessage = true;
  //         this.loadHomepage = true;
  //       }
  //       setTimeout(() =>{
  //         this.successMessage = false;
  //       },5000);
  //     }, error => {
  //       this.errorMessage = true;
  //       this.loadHomepage = false;
  //       console.log(error);
  //       this.errorMessage= true;
  //       setTimeout(() =>{
  //         this.errorMessage = false;
  //       },5000);
  //     });
  //   } else{
  //     console.log('Invalid Form');
  //     console.log(this.loginError);
  //   }
  // }

  // isLoginValid():Boolean {
  //   let isValid=true;
  //   return isValid;
  // }

  submit(){
    console.log(this.loginData,"API Key and APP Key Details");
    this.DD_API_KEY = this.loginData.api_key;
    this.DD_APP_KEY = this.loginData.app_key;
    
    this.dataService.setData(this.loginData);
    this.router.navigate(["/home"]);
    
  }
  }
  



