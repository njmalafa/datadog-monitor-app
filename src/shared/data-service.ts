import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  sharedData: string = '';     

  setData(data: string) {
    this.sharedData = data;
  }

  getData() {
    return this.sharedData;
  }
}
