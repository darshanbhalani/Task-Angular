import { Component, inject } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModel } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-configurations',
  standalone: true,
  imports: [GridModule,HttpClientModule],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.css'
})
export class ConfigurationsComponent {
  httpClient = inject(HttpClient);
  configurationsList = [];
  modalTitle: string = '';
  id:number=0;
  thresholdValue: number = 0;
  intervalTime: number = 0;
  

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
   this.fetchData();
  }

  fetchData(){
    this.httpClient.get('http://localhost:5226/Configuration/GetAllConfigurations').subscribe((data: any) => {
      this.configurationsList = data['body'];
    });
  }

  openModal(event:Event,content: any, data:any) {
    console.warn(data);
    event.preventDefault();
    this.id=data.configurationId;
    this.modalTitle = data.configurationName;
  
    this.thresholdValue=data.configurationThreshold;
    this.intervalTime=data.configurationInterval;
    console.warn(this.thresholdValue);
    console.warn(this.intervalTime);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title',centered: true, size: 'md' });
  }

  saveChanges(thresholdValue:any,intervalTime:any): void {
    const postData = {
      configurationId: this.id,
      configurationName:this.modalTitle,
      configurationThreshold: Number(thresholdValue),
      configurationInterval: Number(intervalTime)
    };

    this.httpClient.post('http://localhost:5226/Configuration/UpdateConfiguration', postData).subscribe((response:any) => {
      console.log('Response from API:', response);
      this.fetchData();
    }, (error:any) => {
      console.error('Error from API:', error);
    });
  }
}
