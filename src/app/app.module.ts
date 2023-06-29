import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Necessary import
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ManualUploadComponent } from './manual-upload/manual-upload.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    ManualUploadComponent,
    BulkUploadComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // import HttpClientModule
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
