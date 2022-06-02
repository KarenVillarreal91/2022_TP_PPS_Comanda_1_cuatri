import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SendEmailService } from 'src/app/services/send-email.service';

@Component({
  selector: 'app-home-supervisor',
  templateUrl: './home-supervisor.component.html',
  styleUrls: ['./home-supervisor.component.scss'],
})
export class HomeSupervisorComponent implements OnInit {
  coleccion : any;
  clientes : any;
  clientesBD : any;
  clientesValidos : any[] = [];


  constructor(private db : AngularFirestore, public emailService:SendEmailService)
  {
    this.coleccion = this.db.collection<any>('clientes');
    this.clientes = this.coleccion.valueChanges({idField: 'id'});
  }

  ngOnInit() 
  {
    this.clientes.subscribe((clientes : any) => {
      this.clientesBD = clientes;
      this.MapClientesNoHabilitados();
    });
  }

  MapClientesNoHabilitados(){

    this.clientesValidos = [];
//estoy suponiendo que va a tener este campo, sujeto a cambio
    for(let item of this.clientesBD){
      if(item.habilitado == false){
        this.clientesValidos.push(item);
      }
    }
    console.log(this.clientesValidos)
  }

  habilitarCliente(item : any){
    item.habilitado = true;
    //Update cliente
    this.emailService.enviarEmail(item.nombre,item.email,"Su cuenta fue habilitada exitosamente.")
    
  }

  rechazarCliente(item : any){
    item.rechazado = true;
   //update cliente
   this.emailService.enviarEmail(item.nombre,item.email,"Su cuenta fue rechazada.")
  }

}
