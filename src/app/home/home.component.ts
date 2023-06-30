import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Papa } from 'ngx-papaparse';
import { saveAs } from 'file-saver';
import  { ManualUploadComponent } from '../manual-upload/manual-upload.component';
import { BulkUploadComponent } from '../bulk-upload/bulk-upload.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  options = ['Manual Upload','Bulk Upload']
  selectedOption : string = 'Manual Upload';
}
