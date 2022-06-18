import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  spinner:boolean = false;

  constructor(public router:Router, public menu:MenuController, public userService:UserService) 
  { 
    userService.obtenerUsuarioActual();
  }

  ngOnInit() {}

  openMenu() {
    this.menu.enable(true, 'menu');
    this.menu.open('menu');
  }
  
  async Cerrar()
  {
    this.spinner = true;

    setTimeout(() => {
      this.spinner = false;
      this.userService.Desloguear();
      this.menu.close();
      this.router.navigateByUrl('login');
    }, 2000);
  }

  Redireccion(red:string)
  {
    this.menu.close();
    this.router.navigateByUrl(red);
  }
}
