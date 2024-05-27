import { Component,HostListener } from '@angular/core';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [DashboardComponent,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isClassAdded: boolean = true;
  isDropdownOpen: boolean = false;

  toggleClass(): void {
    this.isClassAdded = !this.isClassAdded;
    if(!this.isClassAdded){
      this.isDropdownOpen=false;
    }
  }

  toggleDropdown() {
    if(!this.isClassAdded){
      this.isClassAdded=true;
    }
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    if (window.innerWidth < 1200) {
      this.isClassAdded = false;
    }
    if (window.innerWidth > 1200) {
      this.isClassAdded = true;
    }
  }
}
