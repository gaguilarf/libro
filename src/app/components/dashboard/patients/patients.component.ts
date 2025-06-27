import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

export interface Paciente {
  dni: string;
  nombre: string;
  edad: number;
  fecha: string;
  hora: string;
  ubicacion: string;
}

export interface ApiResponse {
  data: Paciente[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
  };
}

@Component({
  selector: 'app-patients',
  imports: [CommonModule, RouterModule, MaterialModule, MatIconModule, FormsModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent implements OnInit, AfterViewInit {
  tipoServicio: string = '';

  // API configuration - Volver a intentar conexión real
  private apiUrl = 'https://backhospital.onrender.com/api/pacientes';
  
  // Control flags
  corsError = false;
  showCorsMessage = false;

  // Datos de pacientes cargados desde la API
  pacientes: Paciente[] = [];

  // Paciente seleccionado para mostrar acciones
  selectedPaciente: Paciente | null = null;

  // Configuración de la tabla
  dataSource: MatTableDataSource<Paciente>;
  displayedColumns: string[] = ['dni', 'nombre', 'edad', 'fecha', 'hora', 'ubicacion'];

  // Pagination properties - now handled client-side
  totalRecords = 0;
  pageSize = 5;
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Inicializar el dataSource vacío, se llenará cuando se carguen los datos
    this.dataSource = new MatTableDataSource<Paciente>([]);
  }

  ngOnInit() {
    this.loadPatients();
  }

  ngAfterViewInit() {
    // Configurar el paginador para client-side pagination
    if (this.paginator) {
      this.paginator.pageSize = this.pageSize;
    }
  }

  private loadPatients() {
    this.isLoading = true;
    this.corsError = false;
    this.showCorsMessage = false;
    
    console.log('🔄 Conectando al backend real:', this.apiUrl);
    
    // Intentar conexión directa al backend
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        console.log('✅ ¡ÉXITO! Conectado al backend:', response);
        
        // Extraer datos del backend real
        if (response && response.data && Array.isArray(response.data)) {
          this.pacientes = response.data;
          this.totalRecords = response.pagination ? response.pagination.totalRecords : response.data.length;
          
          console.log('📋 Pacientes del backend real:', this.pacientes);
          console.log('📊 Total real:', this.totalRecords);
        } else {
          console.warn('⚠️ Estructura inesperada:', response);
          this.pacientes = [];
          this.totalRecords = 0;
        }
        
        this.initializeTable();
        this.isLoading = false;
        this.corsError = false;
      },
      error: (error) => {
        console.error('❌ Error de conexión:', error);
        
        if (error.status === 0) {
          this.corsError = true;
          this.showCorsMessage = true;
          console.log('🔒 CORS bloqueando - Instala extensión CORS para desarrollo');
        }
        
        // Usar datos de respaldo mientras se resuelve CORS
        this.useBackupData();
      }
    });
  }

  private useBackupData() {
    // Datos de respaldo que replican la estructura del backend
    const backupPatients = [
      {
        dni: "01234567",
        nombre: "Juan Perez",
        edad: 35,
        fecha: "01/06/2025",
        hora: "07:50 AM",
        ubicacion: "Av. Los Olivos 123"
      },
      {
        dni: "87654321", 
        nombre: "Maria Garcia",
        edad: 28,
        fecha: "02/06/2025",
        hora: "09:30 AM",
        ubicacion: "Calle San Martin 456"
      }
    ];

    console.log('📋 Usando datos de respaldo');
    this.pacientes = backupPatients;
    this.totalRecords = backupPatients.length;
    this.initializeTable();
    this.isLoading = false;
  }

  private initializeTable() {
    // Crear la fuente de datos con los pacientes
    this.dataSource = new MatTableDataSource(this.pacientes);
    
    // Configurar paginación y ordenamiento del lado del cliente
    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        this.paginator.length = this.totalRecords;
        this.paginator.pageSize = this.pageSize;
      }
      
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
      
      console.log('✅ Tabla inicializada con', this.totalRecords, 'pacientes');
    }, 0);
  }

  // Método simplificado para reintentar
  retryApiConnection() {
    console.log('🔄 Reintentando conexión...');
    this.showCorsMessage = false;
    this.loadPatients();
  }

  // Method to dismiss CORS message
  dismissCorsMessage() {
    this.showCorsMessage = false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Reset to first page when filtering
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectPatient(paciente: Paciente) {
    // Mostrar las acciones del paciente seleccionado
    this.selectedPaciente = paciente;
  }

  // Métodos para las acciones del paciente - actualizados según el diseño
  interconsulta() {
    console.log('Interconsulta para:', this.selectedPaciente?.nombre);
    // Aquí se implementará la lógica para interconsulta
  }

  visualizar() {
    if (this.selectedPaciente) {
      console.log('Visualizar historia para:', this.selectedPaciente?.nombre);
      this.router.navigate(['/patient', this.selectedPaciente.dni]);
    }
  }

  agregar() {
    console.log('Agregar nueva entrada para:', this.selectedPaciente?.nombre);
    // Aquí se implementará la lógica para agregar
  }

  // Remover métodos que ya no se necesitan
  // agregarHistoria, nuevaSolicitud, notasEnfermeria, recetaMedica

  cerrarAcciones() {
    this.selectedPaciente = null;
  }
}