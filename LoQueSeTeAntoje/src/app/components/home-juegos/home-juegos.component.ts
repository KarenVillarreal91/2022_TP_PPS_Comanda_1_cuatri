import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-juegos',
  templateUrl: './home-juegos.component.html',
  styleUrls: ['./home-juegos.component.scss'],
})
export class HomeJUegosComponent implements OnInit {
  spinner: boolean = false;


  constructor(private router:Router) { }

  ngOnInit() {}

  async irColors(){
    this.spinner = true;

    setTimeout(() => {
      this.spinner = false;
      this.router.navigateByUrl('juegoUno');
    }, 2000);
  }

  async irMayorMenor(){
    this.spinner = true;

    setTimeout(() => {
      this.spinner = false;
      this.router.navigateByUrl('juegoMayorMenor');
    }, 2000);
  }
}
