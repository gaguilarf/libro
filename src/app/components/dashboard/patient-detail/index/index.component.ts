import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {
  sections = [
    { id: 'datos-afiliacion', title: 'Datos de Afiliación' },
    { id: 'historia-enfermedad', title: 'Historia de la Enfermedad' },
    { id: 'anamnesis', title: 'Anamnesis' },
    { id: 'funciones-biologicas', title: 'Funciones Biológicas' },
    { id: 'antecedentes', title: 'Antecedentes' },
    { id: 'examen-fisico', title: 'Examen Físico' },
    { id: 'evolucion', title: 'Evolución' }
  ];

  @Output() sectionSelected = new EventEmitter<string>();

  scrollTo(sectionId: string): void {
    this.sectionSelected.emit(sectionId);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}