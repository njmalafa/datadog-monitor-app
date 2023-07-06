import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Necessary import
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// import { createClient } from 'ldapjs-client';
import { ManualUploadComponent } from './manual-upload/manual-upload.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    ManualUploadComponent,
    BulkUploadComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // import HttpClientModule
    FormsModule,
    AppRoutingModule
    // createClient
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
