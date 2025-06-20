import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-menu',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.css'
})
export class SidebarMenuComponent {
  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();

  modules = [
    {
      title: 'Inicio',
      icon: 'bi-house',
      route: '/inicio',
      submodules: []
    },
    {
      title: 'Usuarios',
      icon: 'bi-people',
      route: '',
      submodules: [
        { name: 'Lista de usuarios', route: '/usuarios/lista' },
        { name: 'Roles', route: '/usuarios/roles' }
      ],
      open: false
    },
    {
      title: 'Reportes',
      icon: 'bi-bar-chart',
      route: '',
      submodules: [
        { name: 'Mensuales', route: '/reportes/mensuales' },
        { name: 'Anuales', route: '/reportes/anuales' }
      ],
      open: false
    }
  ];


  constructor(private router: Router) {}

  toggleSubmenu(module: any) {
    if (module.submodules && module.submodules.length > 0) {
      module.open = !module.open;
    } else {
      this.navigate(module.route);
    }
  }

  navigate(route: string) {
    this.router.navigateByUrl(route);
  }
}
