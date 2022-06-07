import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-realizar-pedido',
  templateUrl: './realizar-pedido.component.html',
  styleUrls: ['./realizar-pedido.component.scss'],
})
export class RealizarPedidoComponent implements OnInit {

  spinner:boolean = false;

  constructor(private router:Router, 
    public userService:UserService) 
  {  }

  ngOnInit() {}

}
