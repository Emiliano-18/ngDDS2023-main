import { Tema } from '../models/tema.model';

export class Curso {
	id?: number;
	nombre?: string;	
	tema?: Tema;
	fechaInicio?: Date;
	idDocente?: number;
}

