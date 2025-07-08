import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { FormsModule } from '@angular/forms';
import { IndexComponent, Section } from './index/index.component';

export interface PatientDetail {
  dni: string;
  nombre: string;
  apellidoPaterno: string | null;
  apellidoMaterno: string | null;
  sexo: string;
  fecNac: string;
  edad: number;
  lugarNac: string;
  religion: string;
  direccion: string;
  grupoSanguineo: string;
  estCivil: string;
  factorRH: string;
  gradoInst: string;
  ocupacion: string;
  familiarEncargado: string;
  estadoActual: string;
  cama: string;
  historiaEnfermedad?: {
    fechaIngreso: string;
    fechaHasta: string;
    tiempoEnfermedad: string;
    formaInicio: string;
    curso: string;
    sintomas: string;
  };
  anamnesis?: string;
  funcionesBiologicas?: {
    apetito: string;
    deposicion: string;
    sed: string;
    sueno: string;
    miccion: string;
    deseoSexual: string;
  };
  antecedentes?: {
    personales: string;
    historiaAcademica: string;
    judiciales: string;
    patologicos: any;
    familiares: any;
    personalidadPrevia: string;
    socioeconomicos: any;
  };
  examenFisico?: {
    funcionesVitales: any;
    examenGeneral: string;
  };
  evolucion?: Array<{
    titulo: string;
    fecha: string;
    hora: string;
    contenido: string;
  }>;
}

@Component({
  selector: 'app-patient-detail',
  imports: [CommonModule, MaterialModule, FormsModule, IndexComponent],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.css'
})
export class PatientDetailComponent implements OnInit, AfterViewInit {

  @ViewChild('sidebarRef') sidebarRef!: ElementRef;
  buttonLeft = '2px';
  showSidebar = true;

  patient: PatientDetail | null = null;
  isLoading = false;
  error: string | null = null;
  indexSections: Section[] = [];

  private apiUrl = 'https://backhospital.onrender.com/api/pacientes';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const dni = params.get('dni');
      if (dni) {
        this.loadPatientDetail(dni);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateButtonPosition(), 0);
  }

  @HostListener('window:resize')
  onResize() {
    this.updateButtonPosition();
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
    setTimeout(() => this.updateButtonPosition(), 300);
  }

  updateButtonPosition() {
    if (this.showSidebar && this.sidebarRef) {
      const sidebarWidth = this.sidebarRef.nativeElement.offsetWidth;
      const leftOffset = this.sidebarRef.nativeElement.getBoundingClientRect().left;
      this.buttonLeft = `${sidebarWidth + leftOffset}px`;
    } else {
      this.buttonLeft = '2px';
    }
  }

  private loadPatientDetail(dni: string) {
    this.isLoading = true;
    this.error = null;

    console.log('🔄 Cargando detalles del paciente:', dni);

    this.http.get<PatientDetail>(`${this.apiUrl}/${dni}`).subscribe({
      next: (patient) => {
        console.log('✅ Paciente cargado:', patient);
        this.patient = patient;
        this.indexSections = this.generateIndexSections(patient);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar paciente:', error);
        this.error = 'Error al cargar los datos del paciente';
        this.isLoading = false;
      }
    });
  }

  generateIndexSections(patient: PatientDetail): Section[] {
    return [
      {
        id: 'datos-afiliacion',
        title: 'Datos de Afiliación',
        fecha: '10/07/2025',
        modificado: 'Dra. Rivas'
      },
      {
        id: 'historia-enfermedad',
        title: 'Historia de la Enfermedad',
        fecha: patient.historiaEnfermedad?.fechaIngreso || 'N/D',
        modificado: 'Dr. Pérez'
      },
      {
        id: 'anamnesis',
        title: 'Anamnesis',
        fecha: '09/07/2025',
        modificado: 'Dr. Velarde'
      },
      {
        id: 'funciones-biologicas',
        title: 'Funciones Biológicas',
        fecha: '08/07/2025',
        modificado: 'Dra. Ortega'
      },
      {
        id: 'antecedentes',
        title: 'Antecedentes',
        fecha: '07/07/2025',
        modificado: 'Dra. Ramos',
        subsections: [
          { id: 'a_personales', title: 'Personales', fecha: '07/07/2025', modificado: 'Dra. Ramos' },
          { id: 'a_academicos', title: 'Historia Académica', fecha: '07/07/2025', modificado: 'Dra. Ramos' },
          { id: 'a_judiciales', title: 'Judiciales', fecha: '07/07/2025', modificado: 'Dra. Ramos' },
          { id: 'a_patologicos', title: 'Patológicos', fecha: '07/07/2025', modificado: 'Dra. Ramos' },
          { id: 'a_socioeconomicos', title: 'Socioeconómicos', fecha: '07/07/2025', modificado: 'Dra. Ramos' }
        ]
      },
      {
        id: 'examen-fisico',
        title: 'Examen Físico',
        fecha: '06/07/2025',
        modificado: 'Dr. Cordero'
      },
      {
        id: 'evolucion',
        title: 'Evolución',
        fecha: '06/07/2025',
        modificado: 'Dr. Vega'
      }
    ];
  }

  goBack() {
    this.router.navigate(['/']);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'No especificado';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    } catch {
      return 'Fecha inválida';
    }
  }

  formatValue(value: string | null): string {
    if (!value || value === 'null' || value.toLowerCase().includes('no tiene') || value.toLowerCase().includes('campo no presente')) {
      return 'No especificado';
    }
    return value;
  }

  getDefaultEvolucion() {
    return [
      {
        titulo: 'Título (26/06/25) : 18:00',
        fecha: '26/06/25',
        hora: '18:00',
        contenido: 'Texto de ejemplo para evolución...'
      },
      {
        titulo: 'Título (26/06/25) : 8:00 hrs',
        fecha: '26/06/25',
        hora: '8:00',
        contenido: 'Texto de ejemplo para evolución...'
      }
    ];
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      element.classList.add('highlight-section');
      setTimeout(() => {
        element.classList.remove('highlight-section');
      }, 1000);
    }
  }
}
