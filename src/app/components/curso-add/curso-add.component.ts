import { Component, OnInit } from '@angular/core';
import { Curso } from 'src/app/models/curso.model';
import { CursoService } from 'src/app/services/curso.service';
import { TemasService } from 'src/app/services/temas.service';
import { MaterialesService } from 'src/app/services/materiales.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Material } from 'src/app/models/material.model';

@Component({
  selector: 'app-curso-add',
  templateUrl: './curso-add.component.html',
  styleUrls: ['./curso-add.component.css'],
  providers: [DatePipe]
})
export class CursoAddComponent implements OnInit {
  currentDate: string = '';
  curso: Curso = <Curso>{
    nombre: '',
    fechaInicio: new Date(),
    idDocente: 0, // campo obligatorio
    tema: {
      id: 2 // campo obligatorio
    }
  };
  submitted = false;
  opcionSeleccionado: string = '0';
  verDocente: string = '';

  seleccionIdDocente: number = 0;



  temas: any[] = []; // Declarar e inicializar la propiedad temas
  material: Material = <Material>{
    titulo: '',
    costo: 0,
    idCurso: 0,
    stock: 0
  };
  materiales?: Material[];

  selectedTemaId: number = 0;


  constructor(
    private cursoService: CursoService,
    private temasService: TemasService,
    private materialesService: MaterialesService,
    private datePipe: DatePipe,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.temasService.getTemas().subscribe(data => {
      this.temas = data;
    });
    this.materialesService.getMateriales().subscribe(data => {
      this.materiales = data;
    });
    this.updateMinDate();
  }

  nombreError: boolean = false;
  docenteError: boolean = false;

  saveCurso(): void {
  const fechaActual = new Date();
  fechaActual.setDate(fechaActual.getDate() - 1);

  const fechaActualString = this.datePipe.transform(fechaActual, 'yyyy-MM-ddTHH:mm');
  this.nombreError = !this.curso.nombre;
  this.docenteError = this.curso.idDocente === 0;

  if (this.nombreError || this.docenteError) {
    alert('Por favor, complete todos los campos obligatorios correctamente.');
  } else {
    if (this.curso.fechaInicio != null && fechaActualString != null && fechaActual != null && this.curso.fechaInicio.toString() <= fechaActualString) {
      alert('No puedes seleccionar una fecha menor a la actual.');
    } else {
      const data = {
        "id": this.curso.id,
        "nombre": this.curso.nombre,
        "fechaInicio": this.datePipe.transform(this.curso.fechaInicio, 'yyyy-MM-ddTHH:mm'),
        "idDocente": this.curso.idDocente,
        "tema": this.curso.tema
      };
      this.cursoService.create(data)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.submitted = true;
          },
          error: (e) => {
            console.error(e);
          }
        });
    }
  }
}

  newCurso(): void {
    this.submitted = false;
    this.curso = <Curso>{
      nombre: '',
      fechaInicio: new Date(),
      idDocente: 0, // campo obligatorio 
      tema: {
        id: 0 // campo obligatorio
      }
    };
  }

  materialesTema?: Material[] = [];

  retrieveMaterialesPorCurso(): void {
    this.materialesService.obtenerMaterialesPorIdCurso(this.selectedTemaId)
      .subscribe({
        next: (data) => {
          this.materialesTema = data;
          console.log(this.materialesTema);
          console.log("Materiales recuperados:", this.materialesTema);
        },
        error: (e) => console.error("Materiales no recuperados")
      });
  }

  onTemaSelected(event: any): void {
    const selectedTemaId = event.target.value;
    
    if (!this.curso.tema) {
      this.curso.tema = { id: 1 };
    }
    this.curso.tema.id = selectedTemaId;
    if (selectedTemaId !== '0') {
      this.materialesService.obtenerMaterialesPorIdCurso(selectedTemaId)
        .subscribe((data: Material[]) => {
          this.materialesTema = data;
          console.log(this.materialesTema);
        }, error => {
          console.error(error);
        });
    } else {
      this.materialesTema = [];
    }
  }

  capturarDocente() {
    this.verDocente = this.opcionSeleccionado;
    this.convertirDocenteANumber();
  }

  convertirDocenteANumber() {
    this.seleccionIdDocente = Number(this.verDocente);
  }

  updateMinDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.currentDate = `${year}-${month}-${day}`;
  }

  onNombreChange(): void {
  this.nombreError = !this.curso.nombre;
}
  onDocenteChange(): void {
  this.docenteError = this.curso.idDocente === 0;
}

}
