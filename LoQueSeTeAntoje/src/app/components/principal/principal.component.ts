import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent implements OnInit {
  spinner:boolean = false;

  constructor(private router:Router) { }

  ngOnInit() {}

  async Cerrar()
  {
    this.spinner = true;

    setTimeout(() => {
      this.spinner = false;
      this.router.navigateByUrl('login');
    }, 2000);
  }
}
