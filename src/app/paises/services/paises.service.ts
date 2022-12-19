import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, Observable, of } from 'rxjs';

import { PaisSmall, Pais } from '../interfaces/paises.interface';

@Injectable({ // El decorador @Injectable() es para indicar que la clase es inyectable puede ser inyectada en otros componentes.
  providedIn: 'root'  // El valor 'root' indica que el servicio estará disponible en toda la aplicación.
})
export class PaisesService {  // La clase PaisesService es un servicio que se encarga de hacer las peticiones HTTP a la API de países.

  private baseUrl: string = 'https://restcountries.eu/rest/v2'  // Dirección base de la API
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];  // Arreglo con las regiones del mundo

  get regiones(): string[] {  // Método para retornar el arreglo de regiones
    return [...this._regiones]; // El operador spread (...) es para retornar una copia del arreglo.
  }

  constructor(private http: HttpClient) { } // El constructor recibe como parámetro el HttpClient, que es un servicio que se encarga de hacer las peticiones HTTP.

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> { // Observable<PaisSmall[]> es el tipo de dato que retorna el método

    const url: string = `${this.baseUrl}/region/${region}?fields=alpha3Code;name` // Dirección de la API
    return this.http.get<PaisSmall[]>(url); // Hace la petición HTTP y retorna un Observable
  }

  getPaisPorCodigo(codigo: string): Observable<Pais | null> { // Observable<Pais | null> es el tipo de dato que retorna el método

    if (!codigo) {  // Si el código es nulo, retorna un Observable con valor nulo
      return of(null) // El operador of() es para retornar un Observable con un valor específico. Of crea un observable que emite un valor.
    }

    const url = `${this.baseUrl}/alpha/${codigo}`;  // Dirección de la API
    return this.http.get<Pais>(url);  // Hace la petición HTTP y retorna un Observable
  }

  getPaisPorCodigoSmall(codigo: string): Observable<PaisSmall> {  // Observable<PaisSmall> es el tipo de dato que retorna el método
    const url = `${this.baseUrl}/alpha/${codigo}?fields=alpha3Code;name`; // Dirección de la API
    return this.http.get<PaisSmall>(url); // Hace la petición HTTP y retorna un Observable
  }

  getPaisesPorCodigos(borders: string[]): Observable<PaisSmall[]> { // Observable<PaisSmall[]> es el tipo de dato que retorna el método

    if (!borders) { // Si el arreglo de códigos es nulo, retorna un Observable con un arreglo vacío
      return of([]);  // El operador of() es para retornar un Observable con un valor específico.
    }

    const peticiones: Observable<PaisSmall>[] = []; // Arreglo de Observables

    borders.forEach(codigo => { // Recorre el arreglo de códigos
      const peticion = this.getPaisPorCodigoSmall(codigo);  // Hace una petición por cada código
      peticiones.push(peticion);  // Agrega la petición al arreglo de Observables
    });

    return combineLatest(peticiones); // El operador combineLatest() es para combinar varios Observables en uno solo. combineLatest funciona de la siguiente manera: cuando se emite un valor de cualquiera de los Observables, se emite un arreglo con los valores de todos los Observables.

  }


}
