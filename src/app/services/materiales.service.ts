import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material } from 'src/app/models/material.model'
import { Curso } from 'src/app/models/curso.model'

const baseUrl = 'http://localhost:4200/api/materiales';
//const baseUrl = 'http://localhost:8080/api/materiales';

@Injectable({
  providedIn: 'root'
})

export class MaterialesService {
  private apiUrl = 'http://localhost:4200/api/materiales';	
  constructor(private http: HttpClient) { }
  
  getAll(): Observable<Material[]> {
    return this.http.get<Material[]>(baseUrl);
  }
  get(id: any): Observable<Material> {
    return this.http.get<Material>(`${baseUrl}/${id}`);
  }
  create(data: any): Observable<any> {
	console.log(data);
	//Conversione a form data
	//const formData = new FormData();
	//formData.append('title', <string>data.title);
    //formData.append('status', <string>data.status);
	//formData.append('content', <string>data.content);
    return this.http.post(`${baseUrl}`, data, {responseType: 'text'});
  }
  update(id: any, data: Curso): Observable<any> {
	//Conversione a form data
	const bodyData = {
		"id": id,
    	"nombre": data.nombre,
    	"fechaInicio": data.fechaInicio,
    	"idDocente": data.idDocente ,
    	"tema": data.tema
	};
    return this.http.put(`${baseUrl}`, bodyData, {responseType: 'text'});
  }
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/delete/${id}`, {responseType: 'text'});
  }
  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }
  findByTitle(nombre: any): Observable<Curso> {
    return this.http.get<Curso>(`${baseUrl}?nombre=${nombre}`);
  }
  
  updateTema(cursoId: string, temaId: number): Observable<any> {
  return this.http.put(`${baseUrl}/${cursoId}/updateTema/${temaId}`, null, { responseType: 'text' });
}
 
  getMateriales(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  
  obtenerMaterialesPorIdCurso(cursoId: number): Observable<Material[]> {
    return this.http.get<Material[]>(`${baseUrl}/curso/${cursoId}`);
  }
  
  getMaterialData(url: string): Observable<any> {
    return this.http.get(url);
  }
  
  obtenerMaterialesApi(url: string): Observable<Material[]> {
    return this.http.get<Material[]>(url);
  } 

}