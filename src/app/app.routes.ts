import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { ProfileComponent } from './components/dashboard/profile/profile.component';
import { HomeComponent } from './layout/home/home.component';
import { PatientsComponent } from './components/dashboard/patients/patients.component';
import { HelpComponent } from './components/dashboard/help/help.component';
import { DepartmentsComponent } from './components/dashboard/departments/departments.component';
import { PatientDetailComponent } from './components/dashboard/patient-detail/patient-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'patients', pathMatch: 'full' },
      { path: 'patients', component: PatientsComponent },
      { path: 'patient/:dni', component: PatientDetailComponent },
      { path: 'departments', component: DepartmentsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'help', component: HelpComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'error-page', component: ErrorPageComponent },
  { path: '**', redirectTo: '/error-page' }
];

