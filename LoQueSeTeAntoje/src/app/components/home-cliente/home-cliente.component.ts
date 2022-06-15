import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScandniService } from 'src/app/services/scandni.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.scss'],
})
export class HomeClienteComponent implements OnInit {

  escaneoMesa:boolean = false;
  pedido:any = "";
  verEstado:boolean = false;

  constructor(public userService:UserService, private scanService:ScandniService, private router: Router) 
  { 
  }

  ngOnInit() {}

  Ingreso()
  {
    /*
    this.scanService.scan()
    .then((datos) => {
      if(datos.text == 'qrIngreso')
      {
        //Se puede usar la mesa como estado this.userService.usuarioActual.mesa = 'ingreso'
      }
    }).catch(error => {
      Swal.fire({
        title: "Ocurrió un error al escanear el QR.",
        icon: 'error',
        timer: 4000,
        toast: true,
        backdrop: false,
        position: 'bottom',
        grow: 'row',
        timerProgressBar: true,
        showConfirmButton: false
      });
    });*/

    this.userService.usuarioActual.mesa = 'ingreso';

    setTimeout(() => {
      this.userService.usuarioActual.mesa = '2';
    }, 5000);
  }

  async EscanearMesa() 
  {
    /*
    this.scanService.scan()
    .then((datos) => {
      if(datos.text)
      {
        if(this.userService.usuarioActual.mesa == datos.text)
        {
          //Se activa el menu
        }
      }
    }).catch(error => {
      Swal.fire({
        title: "Ocurrió un error al escanear el QR.",
        icon: 'error',
        timer: 4000,
        toast: true,
        backdrop: false,
        position: 'bottom',
        grow: 'row',
        timerProgressBar: true,
        showConfirmButton: false
      });
    }); */

    let pedidosSub = this.userService.GetColeccion('pedidos').subscribe((pedidos)=>{
      for(let pedido of pedidos)
      {
        if(pedido.mesa == this.userService.usuarioActual.mesa)
        {
          this.pedido = pedido;
          break;
        }
      }
      pedidosSub.unsubscribe();
    });

    this.escaneoMesa = true;
  }

  RealizarPedido()
  {
    this.router.navigateByUrl('realizarPedido');
  }
}
