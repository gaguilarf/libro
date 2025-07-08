  import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
  import { HttpClient } from '@angular/common/http';
  import { CommonModule } from '@angular/common';
  import { MaterialModule } from '../../../shared/material.module';
  import { FormsModule } from '@angular/forms';
  import { IndexComponent } from './index/index.component'; // Importacion de componente de índice

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
  export class PatientDetailComponent implements OnInit {
    
    patient: PatientDetail | null = null;
    isLoading = false;
    error: string | null = null;
    
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

    private loadPatientDetail(dni: string) {
      this.isLoading = true;
      this.error = null;
      
      console.log('🔄 Cargando detalles del paciente:', dni);
      
      this.http.get<PatientDetail>(`${this.apiUrl}/${dni}`).subscribe({
        next: (patient) => {
          console.log('✅ Paciente cargado:', patient);
          this.patient = patient;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ Error al cargar paciente:', error);
          this.error = 'Error al cargar los datos del paciente';
          this.isLoading = false;
        }
      });
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
          contenido: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book...'
        },
        {
          titulo: 'Título (26/06/25) : 8:00 hrs',
          fecha: '26/06/25', 
          hora: '8:00',
          contenido: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book...'
        }
      ];
    }

/*     scrollToSection(sectionId: string): void {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        
        // Efecto de resaltado (opcional)
        element.classList.add('highlight-section');
        setTimeout(() => {
          element.classList.remove('highlight-section');
        }, 1000);
      }
    } */



  }
