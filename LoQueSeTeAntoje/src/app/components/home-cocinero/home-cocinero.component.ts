import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home-cocinero',
  templateUrl: './home-cocinero.component.html',
  styleUrls: ['./home-cocinero.component.scss'],
})
export class HomeCocineroComponent implements OnInit {

  spinner:boolean = false;
  pedidos:Array<any> = [];
  intervalo:any;
  tiempo:number = 0;

  constructor(private userService:UserService) 
  { 
    userService.GetColeccion('pedidos').subscribe((data:any)=>{
      this.pedidos = [];

      for(let pedido of data)
      {
        if((pedido.estado == 'En preparación' || pedido.estado == 'Aceptado') && !pedido.parteCocinero)
        {
          for(let prod of pedido.productos)
          {
            if(prod.tipo == 'plato')
            {
              this.pedidos.push(pedido);
              break;
            }
          }
        }
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy(): void 
  {
    this.PararTiempo();
  }
  
  PararTiempo() {
    clearInterval(this.intervalo);
  }

  Preparar(pedido:any)
  {
    this.tiempo = pedido.tiempo;
    
    this.userService.EditarColeccion(pedido.id, {estado: 'En preparación'}, 'pedidos').then(()=>{

      this.intervalo = setInterval(() => {
        if(this.tiempo > 0) {
          this.tiempo--;
        } else {
          this.PararTiempo();
          this.tiempo = 0;
        }
      },1000)
    });
  }

  Listo(pedido:any)
  {
    this.userService.EditarColeccion(pedido.id, {parteCocinero: true}, 'pedidos');
  }
}
