import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso.service';
import { Curso } from 'src/app/models/curso.model';
import { Tema } from 'src/app/models/tema.model';
import { TemasService } from 'src/app/services/temas.service';
import { MaterialesService } from 'src/app/services/materiales.service';
import { Material } from 'src/app/models/material.model';

@Component({
  selector: 'app-curso-details',
  templateUrl: './curso-details.component.html',
  styleUrls: ['./curso-details.component.css'],
})
export class CursoDetailsComponent implements OnInit {
  @Input() viewMode = false;
  @Input() currentElement: Curso = <Curso>{
    title: '',
    status: 'draft',
    content: '',
  };
  
  temaSeleccionado: Tema | null = null;
  docentes: any[] = [
    { id: 1, nombre: 'Sergio Viera' },
    { id: 2, nombre: 'Santiago Raggazzo' },
    { id: 3, nombre: 'Marcelo Badino' },
    { id: 4, nombre: 'Jorge Vidal' },
    { id: 5, nombre: 'Guillermo Cherencio' },
    { id: 6, nombre: 'Juan Carlos Romero' },
    { id: 7, nombre: 'Carlos Henseler' },
  ];

  getNombreDocente(idDocente: number): string {
    const docenteEncontrado = this.docentes.find(docente => docente.id === idDocente);
    return docenteEncontrado ? docenteEncontrado.nombre : '-';
  }

  message = '';
  submitted = false;
  selectedTemaId: number = 0;
  currentDate: string = '';
   
  constructor(
    private cursoService: CursoService,
    private temasService: TemasService,
    private route: ActivatedRoute,
    private router: Router,
    private materialesService: MaterialesService,
  ) { }

  material: Material = <Material>{
    titulo: '',
    costo: 0,
    idCurso: 0,
    stock: 0
  };

  materiales?: Material[];
  temas: any[] = [];
  materialesRecuperados: Material[] = [];

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getElement(this.route.snapshot.params['id']);
    }
    this.temasService.getTemas().subscribe(data => {
      this.temas = data;
    });
    this.materialesService.getMateriales().subscribe(data => {
      this.materiales = data;
    })
    
    this.updateMinDate();
  }

  getElement(id: string): void {
    this.cursoService.get(id)
      .subscribe({
        next: (data) => {
          this.currentElement = data;
          console.log(data);
        },
        error: (e) => console.error(e),
      });
  }

  updateElement(): void {
    if (!this.currentElement.nombre) {
      alert('El campo Nombre no puede estar vacío.');
    } else {
      this.message = '';
      if (this.temaSeleccionado) {
        this.currentElement.tema = this.temaSeleccionado;
      }

      this.cursoService.update(this.currentElement.id, this.currentElement).subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message ? res.message : 'Curso actualizado!';
          setTimeout(() => {
            this.router.navigate(['/cursos']);
          }, 1500);
        },
        error: (e) => console.error(e),
      });
    }
  }

  deleteElement(): void {
    this.cursoService.delete(this.currentElement.id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/cursos']);
        },
        error: (e) => console.error(e),
      });
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

  obtenerMaterialesDesdeURL(url: string): void {
    this.materialesService.obtenerMaterialesApi(url).subscribe({
      next: (data: Material[]) => {
        this.materialesRecuperados = data;
        console.log('Materiales recuperados:', this.materialesRecuperados);
      },
      error: (e) => console.error('Error al obtener materiales:', e),
    });
  }

  private previousTemaId: any;

  asignarTemaId(idTema: any) {
    if (idTema !== this.previousTemaId) { 
      this.selectedTemaId = idTema;
      this.retrieveMaterialesPorCurso();
      this.previousTemaId = idTema;
    }
  }
  

  updateMinDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.currentDate = `${year}-${month}-${day}`;
  }
}
