import { Component, OnInit } from '@angular/core';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home-bartender',
  templateUrl: './home-bartender.component.html',
  styleUrls: ['./home-bartender.component.scss'],
})
export class HomeBartenderComponent implements OnInit {

  spinner:boolean = false;
  pedidos:Array<any> = [];
  intervalo:any;
  tiempo:number = 0;

  constructor(private userService:UserService, private pushNotificationService:PushNotificationService) 
  { 
    userService.GetColeccion('pedidos').subscribe((data:any)=>{
      this.pedidos = [];

      for(let pedido of data)
      {
        if(pedido.estado == 'En preparación' && !pedido.parteBartender)
        {
          for(let prod of pedido.productos)
          {
            if(prod.tipo == 'bebida')
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
    pedido.enPreparacion = true;
    
    this.intervalo = setInterval(() => {
      if(this.tiempo > 0) {
        this.tiempo--;
      } else {
        this.PararTiempo();
        this.tiempo = 0;
      }
    },1000)
  }

  Listo(pedido:any)
  {
    if(pedido.parteCocinero)
    {
      this.userService.EditarColeccion(pedido.id, {estado: 'Listo', parteBartender: true}, 'pedidos');
      this.pushNotificationService.EnviarNotificationAVariosUsuarios("mozo","Pedido nuevo.","Tiene un pedido listo para entregar.");
    }
    else
    {
      this.userService.EditarColeccion(pedido.id, {parteBartender: true}, 'pedidos');
    }
  }
}
