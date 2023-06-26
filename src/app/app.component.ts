import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  file: File | null = null;
  DD_API_KEY = '<Your Datadog API Key>';
  DD_APP_KEY = '<Your Datadog Application Key>';
  fileToUpload!: File | null;
  title: any;

  constructor(private http: HttpClient, private papa: Papa) {}

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadFileToActivity(): void {
    this.parseCSV();
  }

  parseCSV() {
    if (this.file) {
      const reader = new FileReader();
      reader.readAsText(this.file);
      reader.onload = () => {
        let csvData = reader.result;
        let parsedData = this.papa.parse(csvData as string).data;

        parsedData.forEach((row: any[]) => {
          if (!row || row.length === 0) return;

          let inputData = {
            'Monitor Type': row[0],
            'Environment': row[1],
            'Kafka Topics': row[2],
            'Consumer Group Id': row[3],
            'Alert Threshold': parseFloat(row[4]),
            'Recovery Threshold': parseFloat(row[5]),
            'Notification Email': row[6]
          };

          let monitorType = inputData['Monitor Type'].replace(/ /g, '_');
          let query, name;

          // These should be modified according to your actual query structure
          if (monitorType === 'consumer_down') {
            query = `sum(last_5m):avg:kafka.consumer.${monitorType}.consumer_running{environment:${inputData['Environment']},topic:${inputData['Kafka Topics']},consumer_group_id:${inputData['Consumer Group Id']}} by {host} < 1`;
            name = `${inputData['Kafka Topics']} ${inputData['Consumer Group Id']} ${inputData['Monitor Type']}`;
          } else if (monitorType === 'consumer_lag') {
            query = `avg(last_5m):sum:kafka.consumer.${monitorType}.offset_lag{environment:${inputData['Environment']},topic:${inputData['Kafka Topics']},consumer_group_id:${inputData['Consumer Group Id']}} > ${inputData['Alert Threshold']}`;
            name = `${inputData['Kafka Topics']} ${inputData['Consumer Group Id']} ${inputData['Monitor Type']}`;
          } else if (monitorType === 'producer_error_rate') {
            query = `avg(last_5m):sum:kafka.producer.${monitorType}.produce_error{environment:${inputData['Environment']},topic:${inputData['Kafka Topics']}} > ${inputData['Alert Threshold']}`;
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
  }

  createMonitor(options: any) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('DD-API-KEY', this.DD_API_KEY)
      .set('DD-APPLICATION-KEY', this.DD_APP_KEY);

    this.http.post('https://api.datadoghq.com/api/v1/monitor', JSON.stringify(options), { headers })
      .subscribe(response => {
        console.log(response);
      }, error => {
        console.error(error);
      });
  }
}
