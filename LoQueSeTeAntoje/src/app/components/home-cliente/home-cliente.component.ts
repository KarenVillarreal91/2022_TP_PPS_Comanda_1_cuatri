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

  constructor(private barcodeScanner: BarcodeScanner, public userService:UserService, private scanService:ScandniService, private router: Router) 
  { 
    this.usuario = this.userService.EsCliente();
  }

  ngOnInit() {}

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

    let pedidosS = this.userService.GetColeccion('pedidos').subscribe((pedidos)=>{
      for(let pedido of pedidos)
      {
        if(pedido.mesa == this.userService.usuarioActual.mesa)
        {
          this.pedido = pedido;
          break;
        }
      }

      pedidosS.unsubscribe();
    });

    this.escaneoMesa = true;
  }

  RealizarPedido()
  {
    this.router.navigateByUrl('realizarPedido');
  }

  escanearQrPropina(){
    this.barcodeScanner.scan({formats:"QR_CODE,PDF_417"})
    .then((data:any) => {
      this.propina = parseInt(data.text);
      this.propinaEscaneada = true;
      this.userService.updatePedido(this.userService.usuarioActual.mesa, this.propina);
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

