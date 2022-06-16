import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-juego-uno',
  templateUrl: './juego-uno.component.html',
  styleUrls: ['./juego-uno.component.scss'],
})
export class JuegoUnoComponent implements OnInit {
  colorIzquierda: Color = new Color();;
  colorDerecha:Color = new Color();;
  opciones: any = ['amarillo', 'azul','verde','rojo'];
  puntajeAcumulado:number=0;
  constructor() {
    this.crearColorAleatorio();
   }

  ngOnInit() {}
  crearColorAleatorio()
  {
    var opcion1= this.randomIntFromInterval(0,3);
    var opcion2 = this.randomIntFromInterval(0,3);
    var opcion3 = this.randomIntFromInterval(0,3);
    var opcion4 =this.randomIntFromInterval(0,3);
    
      this.colorIzquierda.palabra=this.opciones[opcion1];
      this.colorIzquierda.colorReal=this.opciones[opcion2];
      this.colorDerecha.palabra=this.opciones[opcion3];
      this.colorDerecha.colorReal=this.opciones[opcion4];
    
  }

  ElegirSI()
  {
    if (this.colorIzquierda.palabra==this.colorDerecha.colorReal)
    {
      this.puntajeAcumulado= this.puntajeAcumulado+1;
      Swal.fire({
        title: 'Acertaste',
        text: 'Excelente.',
        icon: 'success',
        timer: 2000,
        toast: true,
        backdrop: false,
        position: 'bottom',
        grow: 'row',
        timerProgressBar: true,
        showConfirmButton: false
      });
      this.crearColorAleatorio();
    }else{
      Swal.fire({
        title: 'Error',
        text: 'Intentalo de nuevo.',
        icon: 'error',
        timer: 2000,
        toast: true,
        backdrop: false,
        position: 'bottom',
        grow: 'row',
        timerProgressBar: true,
        showConfirmButton: false
      });
      this.empezarDeNuevo();
    }
    
  }
  ElegirNO()
  {
    if (this.colorIzquierda.palabra!=this.colorDerecha.colorReal)
    {
      this.puntajeAcumulado= this.puntajeAcumulado+1;
      Swal.fire({
        title: 'Acertaste',
        text: 'Excelente.',
        icon: 'success',
        timer: 2000,
        toast: true,
        backdrop: false,
        position: 'bottom',
        grow: 'row',
        timerProgressBar: true,
        showConfirmButton: false
      });
      this.crearColorAleatorio();
    }else{
      Swal.fire({
        title: 'Error',
        text: 'Intentalo de nuevo.',
        icon: 'error',
        timer: 2000,
        toast: true,
        backdrop: false,
        position: 'bottom',
        grow: 'row',
        timerProgressBar: true,
        showConfirmButton: false
      });
      this.empezarDeNuevo();
    }
    
  }


  randomIntFromInterval(min:number, max:number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  
  empezarDeNuevo(){
    this.crearColorAleatorio();
    this.puntajeAcumulado=0;
  }

}

export class Color {
  palabra:string;
  colorReal:string;
}
