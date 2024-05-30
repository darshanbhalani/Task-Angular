import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ConfigurationsComponent } from './components/configurations/configurations.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, 
    { path: 'dashboard', component: DashboardComponent },
    { path: 'configurations', component: ConfigurationsComponent },
];
