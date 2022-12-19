import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs/operators';

import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';

@Component({ // Decorador que permite definir metadatos para una clase.
  selector: 'app-selector-page',  // Nombre del componente
  templateUrl: './selector-page.component.html',  // Plantilla HTML
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {  // Clase que implementa la interfaz OnInit

  miFormulario: FormGroup = this.fb.group({ // FormGroup es un objeto que agrupa campos de un formulario.
    region: ['', Validators.required],  // Validators.required es un validador que indica que el campo es obligatorio.
    pais: ['', Validators.required],  // Validators.required es un validador que indica que el campo es obligatorio.
    frontera: ['', Validators.required],  // Validators.required es un validador que indica que el campo es obligatorio.
  })

  // Llenar selectores
  regiones: string[] = [];  // Arreglo de strings
  paises: PaisSmall[] = []; // Arreglo de objetos de tipo PaisSmall
  // fronteras: string[]    = []
  fronteras: PaisSmall[] = [] // Arreglo de objetos de tipo PaisSmall

  // UI
  cargando: boolean = false;  // Variable booleana que indica si se está cargando la información.


  constructor(private fb: FormBuilder,  // FormBuilder es un servicio que permite crear formularios.
    private paisesService: PaisesService) { } // PaisesService es un servicio que permite obtener información de los países.

  ngOnInit(): void {  // ngOnInit() es un método que se ejecuta cuando se crea el componente.

    this.regiones = this.paisesService.regiones;  // Asigna el arreglo de regiones que se obtiene del servicio paisesService a la variable regiones.


    // Cuando cambie la region
    this.miFormulario.get('region')?.valueChanges // valueChanges es un observable que emite el valor del campo cada vez que cambia.
      .pipe( // pipe es para encadenar operadores RxJS
        tap((_) => { // _ es el valor que emite el observable
          this.miFormulario.get('pais')?.reset(''); // me permite resetear el valor del campo
          this.cargando = true; // activa el spinner. El spinner es un elemento que se muestra mientras se está cargando la información.
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region)) // switchMap() es para transformar el valor emitido por el Observable y retornar un nuevo Observable.
      )
      .subscribe(paises => { // subscribe() es para ejecutar el Observable y recibir los valores que emite.
        this.paises = paises; // asigna los valores que emite el Observable a la variable paises.
        this.cargando = false; // desactiva el spinner
      });

    // Cuando cambia el país
    this.miFormulario.get('pais')?.valueChanges // valueChanges es un observable que emite el valor del campo cada vez que cambia.
      .pipe( // pipe es para encadenar operadores RxJS
        tap(() => { // tap() es para ejecutar un efecto secundario, pero no transforma el valor que emite el Observable.
          this.miFormulario.get('frontera')?.reset(''); // me permite resetear el valor del campo
          this.cargando = true; // activa el spinner. El spinner es un elemento que se muestra mientras se está cargando la información.
        }),
        switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo)), // switchMap() es para transformar el valor emitido por el Observable y retornar un nuevo Observable.
        switchMap(pais => this.paisesService.getPaisesPorCodigos(pais?.borders!)) // switchMap() es para transformar el valor emitido por el Observable y retornar un nuevo Observable.
      )
      .subscribe(paises => { // subscribe() es para ejecutar el Observable y recibir los valores que emite.
        // this.fronteras = pais?.borders || [];
        this.fronteras = paises; // asigna los valores que emite el Observable a la variable fronteras.
        this.cargando = false; // desactiva el spinner
      })

  }


  guardar() { // Método para mostrar los valores del formulario
    console.log(this.miFormulario.value); // value es para obtener los valores del formulario
  }

}
