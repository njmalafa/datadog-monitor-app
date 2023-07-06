import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import  { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { ManualUploadComponent } from './manual-upload/manual-upload.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'home', component:HomeComponent},
  {path: 'bulk-upload/:data',component:BulkUploadComponent},
  {path: 'manual-upload/:data',component:ManualUploadComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
