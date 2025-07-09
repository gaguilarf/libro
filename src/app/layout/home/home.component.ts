import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/material.module';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, MatMenuModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  // Datos del usuario (pueden venir luego de un servicio o localStorage)
  user = {
    nombre: 'Dr. Marcelo',
    correo: 'marcelo@email.com'
  };

  constructor(private router: Router) {}

  logout() {
    console.log('Cerrando sesión...');
    // Aquí puedes limpiar datos del almacenamiento si es necesario
    // localStorage.removeItem('token');
    // sessionStorage.clear();

    // Redirige al login
    this.router.navigate(['/login']);
  }
}
