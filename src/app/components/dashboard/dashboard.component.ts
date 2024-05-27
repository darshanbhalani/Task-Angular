import { Component, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CircularCounterComponent } from '../circular-counter/circular-counter.component';
import { GridModule } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule,CircularCounterComponent,GridModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {
  httpClient=inject(HttpClient);
  flag1=false;
  flag2=false;
  incidentAQI:any=[];
  incidentOverSpeed:any=[];

  ngOnInit():void{
    this.httpClient.get('https://localhost:7091/AQI/GetAllIncidents').subscribe((data:any) => {
      this.incidentAQI=data['body'];
    });
    this.httpClient.get('https://localhost:7091/OverSpeed/GetAllIncidents').subscribe((data:any) => {
      this.incidentOverSpeed=data['body'];
    });
  }

  fatchData(message:string){
    if(message==='AQI'){
    this.flag1=false;
    this.flag2=true;
    }
    else if(message==='OverSpeed'){
      this.flag2=false;
      this.flag1=true;
    }
  }
  
  onFilter(){}
 
}
