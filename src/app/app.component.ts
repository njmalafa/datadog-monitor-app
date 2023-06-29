import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Papa } from 'ngx-papaparse';
import { saveAs } from 'file-saver';
import  { ManualUploadComponent } from './manual-upload/manual-upload.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  options = ['Manual Upload','Bulk Upload']
  selectedOption : string = 'Manual Upload';
}


