import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-realizar-pedido',
  templateUrl: './realizar-pedido.component.html',
  styleUrls: ['./realizar-pedido.component.scss'],
})
export class RealizarPedidoComponent implements OnInit {

  spinner:boolean = false;
  productos:Array<any> = [];
  platos:Array<any> = [];
  bebidas:Array<any> = [];
  precioTotal:number = 0;
  propina:number = 0;
  tiempos:Array<number> = [0];
  tiempoTotal:number = 0;
  detalles:boolean = false;
  usuario:any;

  constructor(private router:Router, 
    public userService:UserService,
    private pushNotificationService:PushNotificationService) 
  {  
    userService.GetColeccion('productos').subscribe((data)=>{
      for(let item of data)
      {
        if(item.tipo == 'plato')
        {
          this.platos.push(item);
        }
        else
        {
          this.bebidas.push(item);
        }
      }
    });

    this.usuario = this.userService.EsCliente();
  }

  ngOnInit() 
  {}

  Agregar(producto:any)
  {
    let iProducto = this.productos.indexOf(producto);

    producto.cantidad++;
    this.precioTotal += producto.precio;
    
    this.tiempos.push(producto.tiempo);
    this.tiempoTotal = Math.max.apply(null, this.tiempos);
    
    if(iProducto > -1)
    {
      this.productos[iProducto] = producto;
    }
    else
    {
      this.productos.push(producto);
    }
  }

  Eliminar(producto:any)
  {
    if(producto.cantidad > 0)
    {
      let iProducto = this.productos.indexOf(producto);

      producto.cantidad--;
      this.precioTotal -= producto.precio;
      this.tiempos.splice(this.tiempos.indexOf(producto.tiempo), 1);
      this.tiempoTotal = Math.max.apply(null, this.tiempos);

      this.productos[iProducto] = producto;

      if(producto.cantidad == 0)
      {
        this.productos.splice(iProducto, 1);
      }
    }
  }

  Enviar()
  {
    this.userService.SubirDatos({total: this.precioTotal, propina: this.propina, tiempo: this.tiempoTotal, productos: this.productos, estado: 'Solicitado', mesa: this.usuario.mesa, parteCocinero: false, parteBartender: false}, 'pedidos')
    .then(()=>{

      this.spinner = true;

      this.pushNotificationService.EnviarNotificationAVariosUsuarios("mozo","Pedido nuevo.","Tiene un pedido nuevo.");

      setTimeout(() => {
        this.spinner = false;
        
        Swal.fire({
          title: 'Pedido solicitado correctamente.',
          icon: 'success',
          timer: 2000,
          toast: true,
          backdrop: false,
          position: 'bottom',
          grow: 'row',
          timerProgressBar: true,
          showConfirmButton: false
        });
  
        this.router.navigateByUrl('homeCliente');
      }, 2000);
    });
  }
}
