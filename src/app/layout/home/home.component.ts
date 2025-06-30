import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MaterialModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  constructor(private router: Router) {}

  logout() {
    console.log('Cerrando sesión...');
    // Aquí puedes agregar lógica adicional como limpiar localStorage, sessionStorage, etc.
    // localStorage.removeItem('token');
    // sessionStorage.clear();
    
    // Redirigir al login
    this.router.navigate(['/login']);
  }
}
