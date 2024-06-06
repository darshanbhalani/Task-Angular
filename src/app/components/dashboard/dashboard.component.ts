import { Component, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CircularCounterComponent } from '../circular-counter/circular-counter.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { SwitchModule, InputsModule } from '@progress/kendo-angular-inputs';
import { FormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule, CircularCounterComponent, GridModule, SwitchModule, FormsModule, DropDownsModule, InputsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {
  httpClient = inject(HttpClient);
  isGridVisible: boolean = false;
  isAutoSync: boolean = false;
  incidentAQI: any[] = [];
  incidentOverSpeed: any[] = [];
  incidentTemperature: any[] = [];
  gridColumns: any[] = [];
  gridData: any[] = [];
  sort: any[] = [];
  lastOverspeedIncidentTime: any;
  lastTemperatureIncidentTime: any;
  lastAqiIncidentTime: any;
  title: any;
  public autoSync: boolean = false;

  public syncIntervals: { label: string, value: number }[] = [
    { label: '1 minute', value: 6000 },
    { label: '5 minutes', value: 30000 },
    { label: '10 minutes', value: 60000 }
  ];
  
  public checked: boolean = true;


  ngOnInit(): void {
    this.fetchOverspeed();
    this.fetchTemperature();
    this.fetchAQI();
  }

  constructor() {
    this.sort = [{ field: 'createdOn', dir: 'desc' }];
  }

  getData(): void {
    this.httpClient.get('http://localhost:5226/AQI/GetAllIncidents').subscribe((data: any) => {
      if (data['success']) {
        this.incidentAQI = data['body'];
      }
    });
    this.httpClient.get('http://localhost:5226/OverSpeed/GetAllIncidents').subscribe((data: any) => {
      if (data['success']) {
        this.incidentOverSpeed = data['body'];
      }
    });
  }

  toggleSync() {
    this.isAutoSync = !this.autoSync;
    if (this.autoSync) {
      this.syncData();
    }
  }

  syncData() {
    console.log("Sync called...");
    this.intervalId = setInterval(() => {
      console.log("Sync Started...");

      this.httpClient.get("http://localhost:5226/OverSpeed/SyncNewIncidents?lastExecutionTime=" + this.lastOverspeedIncidentTime).subscribe((data: any) => {
        if (data['success']) {
          if (data['body'].length > 0) {
            console.log(data['body']);
            this.incidentOverSpeed.push(data['body']);
            this.lastOverspeedIncidentTime = data['lastExecutionTime'];
          }
        }
      });
      this.httpClient.post<any>('http://localhost:5226/Temperature/SyncNewIncidents', { lastExecutionTime: this.lastTemperatureIncidentTime }).subscribe((data: any) => {
        if (data['success']) {
          if (data.length > 0) {
            this.incidentTemperature.push(data['body']);
            this.lastTemperatureIncidentTime = data['lastExecutionTime'];
          }
        }
      });
    }, 10000);
  }

  fetchOverspeed() {
    this.httpClient.get('http://localhost:5226/OverSpeed/GetAllIncidents').subscribe((data: any) => {
      if (data['success']) {
        this.incidentOverSpeed = data['body'];
        this.lastOverspeedIncidentTime = data['lastExecutionTime'];
        console.log(this.lastOverspeedIncidentTime);
      }
    });
  }

  fetchTemperature() {
    this.httpClient.get('http://localhost:5226/Temperature/GetAllIncidents').subscribe((data: any) => {
      if (data['success']) {
        this.incidentTemperature = data['body'];
        this.lastTemperatureIncidentTime = data['lastExecutionTime'];
      }
    });
  }

  fetchAQI() {
    this.httpClient.get('http://localhost:5226/AQI/GetAllIncidents').subscribe((data: any) => {
      if (data['success']) {
        this.incidentAQI = data['body'];
        this.lastAqiIncidentTime = data['lastExecutionTime'];
      }
    });
  }

  showOverspeedGrid() {
    this.title = "Overspeed"
    this.gridData = this.incidentOverSpeed,
      this.gridColumns = [
        { field: 'vehicleNumber', title: 'Vehicle Number' },
        { field: 'thresholdSpeed', title: 'Threshold Speed' },
        { field: 'description', title: 'Description' },
        { field: 'startTime', title: 'Start Time' },
        { field: 'endTime', title: 'End Time' }
      ];
    this.isGridVisible = true;
  }

  showTemperatureGrid() {
    this.title = "Temperature"
    this.gridData = this.incidentTemperature,
      this.gridColumns = [
        { field: 'pollNumber', title: 'Poll Number' },
        { field: 'averageTemperature', title: 'Average Temperature' },
        { field: 'description', title: 'Description' },
        { field: 'startTime', title: 'Start Time' },
        { field: 'endTime', title: 'End Time' }
      ];
    this.isGridVisible = true;
  }

  showAQIGrid() {
    this.title = "AQI"
    this.gridData = this.incidentAQI,
      this.gridColumns = [
        { field: 'area', title: 'Area' },
        { field: 'avg_AQI', title: 'AQI' },
        { field: 'category', title: 'Category' },
        { field: 'city', title: 'City' },
        { field: 'state', title: 'State' },
        { field: 'startTime', title: 'Start Time' },
        { field: 'endTime', title: 'End Time' }
      ];
    this.isGridVisible = true;
  }

  public pageableSettings: any = {
    buttonCount: 5,
    info: true,
    type: 'numeric',
    pageSizes: [10, 20, 40, 50, 100, 'All'],
    previousNext: true
  };
}
