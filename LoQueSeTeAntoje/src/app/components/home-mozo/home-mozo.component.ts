import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router:Router, public userService:UserService) 
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
    this.userService.EditarColeccion(pedido.id, {estado: 'En preparación'}, 'pedidos');
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
