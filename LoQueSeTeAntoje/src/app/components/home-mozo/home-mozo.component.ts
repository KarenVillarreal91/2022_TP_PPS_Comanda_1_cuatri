import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

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

  Enviar()
  {
    
  }
}
