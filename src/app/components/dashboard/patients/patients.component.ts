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

  // Pagination properties - híbrida servidor/cliente
  totalRecords = 0;
  pageSize = 5; // Mostrar de 5 en 5 al usuario
  serverPageSize = 10; // Cargar de 10 en 10 del servidor
  currentServerPage = 0; // Página actual del servidor (0-based)
  isLoading = false;
  
  // Cache de datos cargados
  allLoadedPatients: Paciente[] = []; // Todos los pacientes cargados
  maxLoadedRecords = 0; // Máximo de registros cargados hasta ahora

  // Modal de interconsulta
  showInterconsultaModal = false;
  interconsultaData = {
    especialidad: 'Pediatría'
  };

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
    if (this.paginator) {
      this.paginator.pageSize = this.pageSize;
      // Escuchar eventos de cambio de página
      this.paginator.page.subscribe((event: PageEvent) => {
        this.handlePageChange(event);
      });
    }
  }

  private handlePageChange(event: PageEvent) {
    const newPageIndex = event.pageIndex;
    const recordsNeeded = (newPageIndex + 1) * this.pageSize;
    
    console.log('📄 Página solicitada:', newPageIndex, 'Registros necesarios:', recordsNeeded);
    console.log('📊 Registros cargados:', this.maxLoadedRecords);
    
    // Si necesitamos más datos de los que tenemos cargados
    if (recordsNeeded > this.maxLoadedRecords) {
      console.log('🔄 Necesitamos cargar más datos del servidor');
      this.loadMorePatientsFromServer();
    } else {
      console.log('✅ Usando datos ya cargados');
      this.updateLocalPagination();
    }
  }

  private loadPatients() {
    this.isLoading = true;
    this.corsError = false;
    this.showCorsMessage = false;
    this.currentServerPage = 0;
    this.allLoadedPatients = [];
    this.maxLoadedRecords = 0;
    
    this.loadPatientsFromServer();
  }

  private loadPatientsFromServer() {
    const url = `${this.apiUrl}?page=${this.currentServerPage}&limit=${this.serverPageSize}`;
    console.log('🔄 Cargando del servidor:', url);
    
    this.http.get<any>(url).subscribe({
      next: (response) => {
        console.log('✅ Datos recibidos del servidor:', response);
        
        if (response && response.data && Array.isArray(response.data)) {
          // Agregar nuevos datos al cache
          this.allLoadedPatients.push(...response.data);
          this.maxLoadedRecords = this.allLoadedPatients.length;
          
          // Actualizar totales
          if (response.pagination) {
            this.totalRecords = response.pagination.totalRecords;
          }
          
          console.log('📋 Total cargado:', this.maxLoadedRecords, 'de', this.totalRecords);
          
          this.updateLocalPagination();
        }
        
        this.isLoading = false;
        this.corsError = false;
      },
      error: (error) => {
        console.error('❌ Error de conexión:', error);
        
        if (error.status === 0) {
          this.corsError = true;
          this.showCorsMessage = true;
        }
        
      }
    });
  }

  private loadMorePatientsFromServer() {
    if (this.maxLoadedRecords >= this.totalRecords) {
      console.log('📋 Ya tenemos todos los datos');
      return;
    }
    
    this.currentServerPage++;
    this.isLoading = true;
    this.loadPatientsFromServer();
  }

  private updateLocalPagination() {
    // Tomar solo los datos necesarios para la página actual
    const startIndex = (this.paginator?.pageIndex || 0) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    
    this.pacientes = this.allLoadedPatients.slice(startIndex, endIndex);
    
    console.log('📄 Mostrando registros:', startIndex + 1, 'a', Math.min(endIndex, this.maxLoadedRecords));
    
    this.initializeTable();
  }

  private initializeTable() {
    // Crear la fuente de datos con los pacientes actuales
    this.dataSource = new MatTableDataSource(this.pacientes);
    
    setTimeout(() => {
      if (this.paginator) {
        // No asignar dataSource.paginator para control manual
        this.paginator.length = this.totalRecords;
        this.paginator.pageSize = this.pageSize;
      }
      
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
      
      console.log('✅ Tabla actualizada con', this.pacientes.length, 'pacientes');
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
    
    if (filterValue.trim() === '') {
      // Si no hay filtro, volver a la paginación normal
      this.updateLocalPagination();
    } else {
      // Filtrar sobre todos los datos cargados
      const filteredData = this.allLoadedPatients.filter(patient => 
        patient.dni.toLowerCase().includes(filterValue.toLowerCase()) ||
        patient.nombre.toLowerCase().includes(filterValue.toLowerCase())
      );
      
      this.dataSource = new MatTableDataSource(filteredData);
      
      // Resetear paginador para datos filtrados
      if (this.paginator) {
        this.paginator.length = filteredData.length;
        this.paginator.pageIndex = 0;
      }
    }
  }

  selectPatient(paciente: Paciente) {
    // Mostrar las acciones del paciente seleccionado
    this.selectedPaciente = paciente;
  }

  // Métodos para las acciones del paciente
  interconsulta() {
    if (this.selectedPaciente) {
      console.log('Interconsulta para:', this.selectedPaciente?.nombre);
      this.showInterconsultaModal = true;
    }
  }

  visualizar() {
    if (this.selectedPaciente) {
      console.log('Visualizar historia para:', this.selectedPaciente?.nombre);
      this.router.navigate(['/patient', this.selectedPaciente.dni]);
    }
  }

  agregar() {
    console.log('Agregar nueva entrada para:', this.selectedPaciente?.nombre);
    // Aquí se implementará la lógica para agregar nueva entrada
  }

  cerrarAcciones() {
    this.selectedPaciente = null;
  }

  // Métodos para el modal de interconsulta
  closeInterconsultaModal() {
    this.showInterconsultaModal = false;
    this.resetInterconsultaData();
  }

  continueInterconsulta() {
    console.log('Continuando interconsulta:', this.interconsultaData);
    // Aquí se implementará la lógica para procesar la interconsulta
    this.closeInterconsultaModal();
  }

  private resetInterconsultaData() {
    this.interconsultaData = {
      especialidad: 'Pediatría'
    };
  }

}