import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Papa } from 'ngx-papaparse';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  file: File | null = null;
  DD_API_KEY = 'XXXX';
  DD_APP_KEY = 'XXXX';
  selectedItem:string;
  listItems:string[] = ['oz','snp-ats','snp-atn','cpz'];
  monitorType :any;

  constructor(private http: HttpClient, private papa: Papa) {
    this.selectedItem = this.listItems[0];
  }

onItemSelected():void{
  // console.log('selected item : ',this.selectedItem)
}
  uploadCSV(csvFileData : HTMLInputElement): void{
    const file: File | any = csvFileData.files && csvFileData.files[0];
    const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        let csvData = reader.result;
        let parsedData = this.papa.parse(csvData as string).data;


        parsedData.forEach((row: any[] , index: number) => {
                  if (!row || row.length === 0 || !index) return;
                  let inputData = {
                    'Kafka Topics': row[0],
                    'Consumer Group Id': row[1],
                    'Monitor Type': row[2],
                    'Alert Threshold': parseFloat(row[3]) || 0,
                    'Recovery Threshold': parseFloat(row[4]) || 0,
                    'Environment': row[5],                    
                    'Notification Email': row[6]
                  };

                  if(inputData['Monitor Type']!= undefined){
                    this.monitorType = inputData['Monitor Type'].replace(/ /g, '_');
                  }
                  
                  // let monitorType = 'consumer_down';
                  let query, name;

                  // These should be modified according to your actual query structure
                  if (this.monitorType === 'consumer_down') {
                    query = `sum(last_5m):avg:kafka.consumer.${this.monitorType}.consumer_running{environment:${inputData['Environment']},topic:${inputData['Kafka Topics']},consumer_group_id:${inputData['Consumer Group Id']}} by {host} < 1`;
                    name = `${inputData['Kafka Topics']} ${inputData['Consumer Group Id']} ${inputData['Monitor Type']}`;
                  } else if (this.monitorType === 'consumer_lag') {
                    query = `avg(last_5m):sum:kafka.consumer.${this.monitorType}.offset_lag{environment:${inputData['Environment']},topic:${inputData['Kafka Topics']},consumer_group_id:${inputData['Consumer Group Id']}} > ${inputData['Alert Threshold']}`;
                    name = `${inputData['Kafka Topics']} ${inputData['Consumer Group Id']} ${inputData['Monitor Type']}`;
                  } else if (this.monitorType === 'producer_error_rate') {
                    query = `avg(last_5m):sum:kafka.producer.${this.monitorType}.produce_error{environment:${inputData['Environment']},topic:${inputData['Kafka Topics']}} > ${inputData['Alert Threshold']}`;
                    name = `${inputData['Kafka Topics']} ${inputData['Monitor Type']}`;
                  }

                  let options = {
                              query,
                              name,
                              type: 'metric alert',
                              message: `${name} is above ${inputData['Alert Threshold']}`,
                              options: {
                                thresholds: {
                                  critical: inputData['Alert Threshold'],
                                  warning: inputData['Recovery Threshold']
                                },
                                notify_no_data: true,
                                no_data_timeframe: 20,
                                require_full_window: false,
                                new_host_delay: 300,
                                include_tags: false,
                                timeout_h: 1,
                                notify_audit: true,
                                notify: [
                                  {
                                    type: 'email',
                                    name: 'Email',
                                    email: inputData['Notification Email']
                                  }
                                ]
                              },
                              tags: [],
                              multi: true
                            };
                            this.createMonitor(options);
                          });
                        };
  }
 
  createMonitor(options: any) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      // .set('DD-API-KEY', this.DD_API_KEY)
      // .set('DD-APPLICATION-KEY', this.DD_APP_KEY)
      .set('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');

      this.http.post('https://jsonplaceholder.typicode.com/posts', JSON.stringify(options), { headers })
      .subscribe((response : any) => {
        console.log(response);
        const responseObj = JSON.stringify(response);
        const blob = new Blob([responseObj],{ type:'application/json'});
        const fileName = response.name;
        saveAs(blob, fileName);
      }, error => {
        console.error(error);
      });
     
  }
}


