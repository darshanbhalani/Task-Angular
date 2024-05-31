import { Component, inject, Input, Output } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CircularCounterComponent } from '../circular-counter/circular-counter.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { EventEmitter } from 'ws';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule, CircularCounterComponent, GridModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent{
  httpClient = inject(HttpClient);
  flag1 = false;
  flag2 = false;
  incidentAQI: any[] = [];
  incidentOverSpeed: any[] = [];
  modalTitle: string = '';
  @Input() checked: boolean = true;


  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.httpClient.get('http://localhost:5226/AQI/GetAllIncidents').subscribe((data: any) => {
      this.incidentAQI = data['body'];
    });
    this.httpClient.get('http://localhost:5226/OverSpeed/GetAllIncidents').subscribe((data: any) => {
      this.incidentOverSpeed = data['body'];
    });
  }

  fatchData(message: string): void {
    if (message === 'AQI') {
      this.flag1 = false;
      this.flag2 = true;
    } else if (message === 'OverSpeed') {
      this.flag2 = false;
      this.flag1 = true;
    }
  }

  public pageableSettings: any = {
    buttonCount: 5,
    info: true,
    type: 'numeric',
    pageSizes: [10, 20, 40, 50, 100, 'All'],
    previousNext: true
  };
}
