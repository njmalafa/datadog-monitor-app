import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-manual-upload',
  templateUrl: './manual-upload.component.html',
  styleUrls: ['./manual-upload.component.scss']
})
export class ManualUploadComponent {
  selectedMointorItem:string;
  selectedEnvItem:string;
  monitorListItems:string[] = ['consumer down','consumer lag','producer error rate'];
  envListItems:string[] = ['oz','snp-ats','snp-atn','cpz'];
  formData: any = {};
  formErrors : any = {};
  successMessage:boolean=false;
  errorMessage:boolean=false;

  constructor(private http: HttpClient, private papa: Papa) {
    this.selectedMointorItem = this.monitorListItems[0];
    this.selectedEnvItem = this.envListItems[0];
  }


  onMonitorTypeSelected():void{
    // console.log('selected item : ',this.selectedMointorItem)
  }

  onEnvSelected():void{
    // console.log('selected item : ',this.selectedEnvItem)
  }

  submitForm(){

    if(this.isFormValid()){
      const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      // .set('DD-API-KEY', this.DD_API_KEY)
      // .set('DD-APPLICATION-KEY', this.DD_APP_KEY)
      .set('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
  
      this.http.post('https://jsonplaceholder.typicode.com/posts', JSON.stringify(this.formData), { headers })
      .subscribe((response : any) => {
        console.log(response,"response")
        this.successMessage= true;
        setTimeout(() =>{
          this.successMessage = false;
        },5000);
      }, error => {
        console.error(error);
        this.errorMessage= true;
        setTimeout(() =>{
          this.errorMessage = false;
        },5000);
      });
    } else{
      console.log('Invalid Form');
      console.log(this.formErrors);
    }

   
    
  }

  isFormValid():Boolean{
    this.formErrors = {};
    let isValid = true;

    if (!this.formData.selectedMointorItem) {
      this.formErrors.selectedMointorItem = '*Required';
      isValid = false;
    }

    if (!this.formData.selectedEnvItem) {
      this.formErrors.selectedEnvItem = '*Required';
      isValid = false;
    }

    if (!this.formData.notificationEmail || !this.isValidEmail(this.formData.notificationEmail)) {
      this.formErrors.notificationEmail = '*Invalid email';
      isValid = false;
    }
    return isValid;
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

}
