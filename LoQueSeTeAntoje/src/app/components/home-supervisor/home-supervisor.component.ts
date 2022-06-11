import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SendEmailService } from 'src/app/services/send-email.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

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


  constructor(private db : AngularFirestore, public emailService:SendEmailService,private userS : UserService)
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
    for(let item of this.clientesBD){
      if(item.habilitado == false){
        this.clientesValidos.push(item);
      }
    }
  }

  habilitarCliente(item : any){
    item.habilitado = true;
    this.userS.updateUser(item.id, item,"clientes");
    this.emailService.enviarEmail(item.nombre,item.email,"Su cuenta fue habilitada exitosamente.")
    Swal.fire({
      title: 'Correcto',
      text: 'Habilito al cliente con exito.',
      icon: 'success',
      timer: 2000,
      toast: true,
      backdrop: false,
      position: 'bottom',
      grow: 'row',
      timerProgressBar: true,
      showConfirmButton: false
    });
  }

  rechazarCliente(item : any){
    item.habilitado = true;
    this.userS.updateUser(item.id, item,"clientes");
    this.emailService.enviarEmail(item.nombre,item.email,"Su cuenta fue rechazada.")
    Swal.fire({
      title: 'Correcto',
      text: 'Rechazo al cliente con exito.',
      icon: 'success',
      timer: 2000,
      toast: true,
      backdrop: false,
      position: 'bottom',
      grow: 'row',
      timerProgressBar: true,
      showConfirmButton: false
    });
  }

}
