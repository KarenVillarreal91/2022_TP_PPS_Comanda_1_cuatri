import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-clientes-lista-de-espera',
  templateUrl: './clientes-lista-de-espera.component.html',
  styleUrls: ['./clientes-lista-de-espera.component.scss'],
})
export class ClientesListaDeEsperaComponent implements OnInit {
  clientesEnEspera:Array<any> = [];
  constructor(private db : AngularFirestore, private userS : UserService, private router:Router) 
  {
    let sub = userS.GetColeccion('clientes').subscribe((data)=>{
      for(let item of data)
      {
        if (item.enListaDeEspera){
          this.clientesEnEspera.push(item);
        }
      }
      sub.unsubscribe();
    });
  }

  ngOnInit() { }

  AsignarMesa(cliente:any){
    this.router.navigateByUrl('qrmesa');
  }

}
