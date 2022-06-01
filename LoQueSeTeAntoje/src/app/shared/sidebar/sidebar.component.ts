import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  spinner:boolean = false;

  constructor(public router:Router, public menu:MenuController) 
  { }

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
      this.menu.close();
      this.router.navigateByUrl('login');
    }, 2000);
  }
}
