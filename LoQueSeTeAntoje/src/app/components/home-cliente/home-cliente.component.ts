import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScandniService } from 'src/app/services/scandni.service';
import { UserService } from 'src/app/services/user.service';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
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
  propina = 0;
  propinaEscaneada = false;
  usuario:any;
  cuenta:boolean = false;
  spinner:boolean = false;

  constructor(private barcodeScanner: BarcodeScanner, public userService:UserService, private scanService:ScandniService, public router: Router) 
  { 
    userService.GetColeccion('clientes').subscribe((data)=>{
      for (let user of data) 
      {
        if (user.uid == this.userService.usuarioActual.id || user.id == this.userService.usuarioActual.id) 
        {
          this.usuario = user;
          break;
        }
      }  
    })
  }

  ngOnInit() {}

  async EscanearMesa() 
  {
    this.scanService.scan()
    .then((datos) => {
      if(datos.text)
      {
        if(this.usuario.mesa == datos.text)
        {
          this.userService.GetColeccion('pedidos').subscribe((pedidos)=>{
            for(let pedido of pedidos)
            {
              if(pedido.mesa == this.usuario.mesa)
              {
                if(pedido.estado != 'Finalizado')
                {
                  this.pedido = pedido;
                }
                else
                {
                  if(this.usuario.encuestaCompletada)
                  {
                    this.pedido = '';
                    this.escaneoMesa = false;
                    this.router.navigateByUrl('qrIngreso');
                  }
                }

                break;
              }
            }
          });
      
          this.escaneoMesa = true;
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
    });
  }

  RealizarPedido()
  {
    this.escaneoMesa = false;
    this.router.navigateByUrl('realizarPedido');
  }

  Recibido(pedido:any)
  {
    this.userService.EditarColeccion(pedido.id, {estado: 'Recibido'}, 'pedidos');
  }

  Pagar(pedido:any)
  {
    this.spinner = true;

    setTimeout(() => {
      this.spinner = false;
      this.cuenta = false;
      this.userService.EditarColeccion(pedido.id, {estado: 'Pagado'}, 'pedidos');
    }, 2000);
  }

  escanearQrPropina(){
    
    this.scanService.scan()
    .then((data:any) => {
      this.propina = this.pedido.total * 0.05;
      this.propinaEscaneada = true;
      this.userService.EditarColeccion(this.pedido.id, {propina: this.propina}, 'pedidos');
      setTimeout(() => {
        Swal.fire({
          title: 'Propina agregada correctamente.',
          icon: 'success',
          timer: 2000,
          toast: true,
          backdrop: false,
          position: 'bottom',
          grow: 'row',
          timerProgressBar: true,
          showConfirmButton: false
        });
      }, 2000);
    }).catch(error => {

      Swal.fire({
        title: "Error al agregar propina.",
        icon: 'error',
        timer: 4000,
        toast: true,
        backdrop: false,
        position: 'bottom',
        grow: 'row',
        timerProgressBar: true,
        showConfirmButton: false
      });
      console.log(error);
    });
  }

}

