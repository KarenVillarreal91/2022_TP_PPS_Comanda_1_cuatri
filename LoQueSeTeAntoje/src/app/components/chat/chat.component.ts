import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getTimeGivenProgression } from '@ionic/angular';
import { PushNotificationService } from 'src/app/services/push-notification.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  mensajes:Array<any> = [];
  mensaje: string;
  spinner:boolean = false;
  usuario:any;
  
  constructor(public userService : UserService, private pushNotification: PushNotificationService) {
    this.userService.TraerMensajes().subscribe((data)=>{
      this.mensajes = data.sort((a:any,b:any)=> a.sort - b.sort);
    });
   }

  ngOnInit() {}

  MandarMensaje()
  {  
    let mesa = '';
    this.userService.obtenerUsuarioActual()
    
    if(this.userService.usuarioActual.tipo == 'cliente')
    {
      mesa = this.userService.usuarioActual.mesa;
      this.pushNotification.EnviarNotificationAVariosUsuarios("mozo","Nueva consulta de cliente.", this.mensaje);
    }

    const mensajeObj = {  
      message: this.mensaje,
      mesa: mesa,
      sort: Date.now()
    }

    this.mensaje = '';
    this.userService.MandarMensaje(mensajeObj);
  }
}
