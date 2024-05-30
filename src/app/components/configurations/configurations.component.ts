import { Component } from '@angular/core';
import { GridModule } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-configurations',
  standalone: true,
  imports: [GridModule],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.css'
})
export class ConfigurationsComponent {
  configurationsList = [
    {"name":"OverSpeed"},
    {"name":"AQI"},
    {"name":"Street Light"},
    {"name":"Traffic Light"}
  ];

  openEditModal(){
    
  }
}
