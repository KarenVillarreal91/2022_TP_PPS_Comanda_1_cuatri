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
      for(let pedido of data)
      {
        if(pedido.estado == 'En preparación' || pedido.estado == 'Aceptado')
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

  EmpezarTiempo() {
    this.intervalo = setInterval(() => {
      if(this.tiempo > 0) {
        this.tiempo--;
      } else {
        this.PararTiempo();
        this.tiempo = 0;
      }
    },1000)
  }
  
  PararTiempo() {
    clearInterval(this.intervalo);
  }

  Preparar(pedido:any)
  {
    this.tiempo = pedido.tiempo;
    this.EmpezarTiempo();
  }
}
