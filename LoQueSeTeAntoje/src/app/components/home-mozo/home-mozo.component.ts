import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home-mozo',
  templateUrl: './home-mozo.component.html',
  styleUrls: ['./home-mozo.component.scss'],
})
export class HomeMozoComponent implements OnInit {

  spinner:boolean = false;
  pedidos:Array<any> = [];

  constructor(private router:Router, public userService:UserService, public pushNotificationService:PushNotificationService) 
  {  
    userService.GetColeccion('pedidos').subscribe((data:any)=>{
      this.pedidos = [];

      for(let pedido of data)
      {
        if(pedido.estado != 'Finalizado')
        {
          this.pedidos.push(pedido);
        }
      }
    });
  }

  ngOnInit() {}

  Enviar(pedido:any)
  {
    this.userService.EditarColeccion(pedido.id, {estado: 'En preparación'}, 'pedidos').then(()=>{
      this.pushNotificationService.EnviarNotificationAVariosUsuarios("bartender","Pedido nuevo.","Tiene un pedido nuevo para preparar.");
      this.pushNotificationService.EnviarNotificationAVariosUsuarios("cocinero","Pedido nuevo.","Tiene un pedido nuevo para preparar.");
    });
  }

  Entregar(pedido:any)
  {
    this.userService.EditarColeccion(pedido.id, {estado: 'Entregado'}, 'pedidos');
  }

  Finalizar(pedido:any)
  {
    this.userService.EditarColeccion(pedido.id, {estado: 'Finalizado'}, 'pedidos').then(()=>{

      for(let cliente of this.userService.clientes)
      {
        if(cliente.mesa == pedido.mesa)
        {
          this.userService.EditarColeccion(cliente.id, {mesa: ''}, 'clientes');

          this.userService.GetColeccion('mesas').subscribe((data:any)=>{      
            for(let mesa of data)
            {
              if(mesa.numero == cliente.mesa)
              {
                this.userService.EditarColeccion(mesa.id, {ocupada: false}, 'mesas');
                break;
              }
            }
          });


          break;
        }
      }
      
      Swal.fire({
        title: 'Se finalizó el pedido.',
        icon: 'success',
        timer: 2000,
        toast: true,
        backdrop: false,
        position: 'bottom',
        grow: 'row',
        timerProgressBar: true,
        showConfirmButton: false
      });
    });
  }
}
