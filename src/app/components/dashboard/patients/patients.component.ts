import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

export interface Paciente {
  dni: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  lugarNacimiento: string;
  direccion: string;
  estadoCivil: string;
  gradoInstruccion: string;
  edad: number;
  sexo: string;
  religion: string;
  grupoSanguineo: string;
  factorRH: string;
  ocupacion: string;
  familiarEncargado: string;
  estadoActual: string;
  fechaIngreso: string;
  fechaDesde: string;
  fechaHasta: string;
  tiempoEnfermedad: string;
  formaInicio: string;
  curso: string;
  sintomasPrincipales: string;
  anamnesis: string;
  funcionesBiologicas: {
    apetito: string;
    sed: string;
    sueño: string;
    deposicion: string;
    miccion: string;
    deseoSexual: string;
  };
  antecedentes: {
    personales: string;
    inicioRelacionesSexuales: string;
    mac: string;
    parejasSentimentales: string;
    rc: string;
    abusoSexual: string;
    fur: string;
    historiaAcademica: string;
  };
  fecha?: string;
  hora?: string;
  ubicacion?: string;
}

@Component({
  selector: 'app-patients',
  imports: [CommonModule, RouterModule, MaterialModule, ReactiveFormsModule, MatIconModule, FormsModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent implements OnInit, AfterViewInit {
  tipoServicio: string = '';
  selectedPatient: Paciente | null = null;
  patientForm: FormGroup;
  estados = [
    {value: 'hospitalizacion', viewValue: 'Hospitalización'},
    {value: 'consulta', viewValue: 'Consulta Externa'},
    {value: 'emergencia', viewValue: 'Emergencia'}
  ];
  servicios = [
    {value: 'medicina', viewValue: 'Medicina'},
    {value: 'cirugia', viewValue: 'Cirugía'},
    {value: 'pediatria', viewValue: 'Pediatría'}
  ];
  profesionales = [
    {value: 'dr1', viewValue: 'Dr. Juan Pérez'},
    {value: 'dr2', viewValue: 'Dra. María Gómez'},
    {value: 'dr3', viewValue: 'Dr. Carlos López'}
  ];
  // Datos de pacientes cargados desde el archivo JSON
  pacientes: Paciente[] = [];

  // Configuración de la tabla
  dataSource: MatTableDataSource<Paciente>;
  displayedColumns: string[] = ['dni', 'nombre', 'edad', 'fecha', 'hora', 'ubicacion'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    // Inicializar el dataSource vacío, se llenará cuando se carguen los datos
    this.dataSource = new MatTableDataSource<Paciente>([]);
    
    // Inicializar el formulario con todos los controles necesarios y deshabilitados
    this.patientForm = this.fb.group({
      nombre: {value: '', disabled: true},
      apellidoPaterno: {value: '', disabled: true},
      apellidoMaterno: {value: '', disabled: true},
      fechaNacimiento: {value: '', disabled: true},
      lugarNacimiento: {value: '', disabled: true},
      direccion: {value: '', disabled: true},
      estadoCivil: {value: '', disabled: true},
      gradoInstruccion: {value: '', disabled: true},
      dni: {value: '', disabled: true},
      sexo: {value: '', disabled: true},
      edad: {value: '', disabled: true},
      religion: {value: '', disabled: true},
      grupoSanguineo: {value: '', disabled: true},
      factorRH: {value: '', disabled: true},
      ocupacion: {value: '', disabled: true},
      familiarEncargado: {value: '', disabled: true},
      estadoActual: {value: '', disabled: true},
      fechaIngreso: {value: '', disabled: true},
      fechaDesde: {value: '', disabled: true},
      fechaHasta: {value: '', disabled: true},
      tiempoEnfermedad: {value: '', disabled: true},
      formaInicio: {value: '', disabled: true},
      curso: {value: '', disabled: true},
      sintomasPrincipales: {value: '', disabled: true},
      anamnesis: {value: '', disabled: true},
      apetito: {value: '', disabled: true},
      sed: {value: '', disabled: true},
      sueño: {value: '', disabled: true},
      deposicion: {value: '', disabled: true},
      miccion: {value: '', disabled: true},
      deseoSexual: {value: '', disabled: true},
      personales: {value: '', disabled: true},
      inicioRelacionesSexuales: {value: '', disabled: true},
      mac: {value: '', disabled: true},
      parejasSentimentales: {value: '', disabled: true},
      rc: {value: '', disabled: true},
      abusoSexual: {value: '', disabled: true},
      fur: {value: '', disabled: true},
      historiaAcademica: {value: '', disabled: true}
    });
  }

  ngOnInit() {
    this.loadPatients();
  }

  ngAfterViewInit() {
    this.initializeTable();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private loadPatients() {
    this.http.get<any>('assets/data/patients.json').subscribe({
      next: (data) => {
        this.pacientes = data.pacientes;
        this.initializeTable();
      },
      error: (error) => {
        console.error('Error al cargar los pacientes:', error);
      }
    });
  }

  private initializeTable() {
    this.dataSource = new MatTableDataSource(this.pacientes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectPatient(paciente: Paciente) {
    this.selectedPatient = paciente;
    this.patientForm.patchValue({
      ...paciente,
      apetito: paciente.funcionesBiologicas?.apetito || '',
      sed: paciente.funcionesBiologicas?.sed || '',
      sueño: paciente.funcionesBiologicas?.sueño || '',
      deposicion: paciente.funcionesBiologicas?.deposicion || '',
      miccion: paciente.funcionesBiologicas?.miccion || '',
      deseoSexual: paciente.funcionesBiologicas?.deseoSexual || '',
      personales: paciente.antecedentes?.personales || '',
      inicioRelacionesSexuales: paciente.antecedentes?.inicioRelacionesSexuales || '',
      mac: paciente.antecedentes?.mac || '',
      parejasSentimentales: paciente.antecedentes?.parejasSentimentales || '',
      rc: paciente.antecedentes?.rc || '',
      abusoSexual: paciente.antecedentes?.abusoSexual || '',
      fur: paciente.antecedentes?.fur || '',
      historiaAcademica: paciente.antecedentes?.historiaAcademica || ''
    });
  }
}
