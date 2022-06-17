import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-home-metre',
  templateUrl: './home-metre.component.html',
  styleUrls: ['./home-metre.component.scss'],
})
export class HomeMetreComponent implements OnInit {

  clientesEnEspera:Array<any> = [];
  mesas:Array<any> = [];
  mesaNumero:any;
  constructor(private db : AngularFirestore, private userS : UserService, private router:Router) 
  {
    this.getClientes();
    this.getMesas();
  }
  ngOnInit() { }

  AsignarMesa(mesa:any, cliente:any){
    console.log(cliente + " cliente ");
    console.log(mesa + " mesa");
    cliente.enListaDeEspera=false;
    cliente.mesa = mesa.numero.toString();//podria no setearlo
    mesa.ocupada=true;
    this.userS.EditarColeccion(cliente.id,cliente,"clientes");
    this.userS.EditarColeccion(mesa.id,mesa,"mesas");
  }
  getMesas(){
    let subMesas = this.userS.GetColeccion('mesas').subscribe((data:any)=>{
      for(let item of data)
      {
        if (!item.ocupada){

          this.mesas.push(item);
        }
      }
    });
  }
  getClientes(){
    let clientes = this.userS.clientes;
    for(let item of clientes)
      {
        if (item.enListaDeEspera){
          this.clientesEnEspera.push(item);
        }
      }
  }
}