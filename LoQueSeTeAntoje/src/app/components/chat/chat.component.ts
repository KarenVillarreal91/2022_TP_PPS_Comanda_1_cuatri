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
  data:any;
  error:string="No puedes enviar mensajes vacios.";
  hayError:boolean=false;
  spinner:boolean=true;
  usuario:any;
  constructor(private userS : UserService, private pushNotification: PushNotificationService) {
    this.getUser();
    this.getMensajes();
   }

  ngOnInit() {}

  getUser(){
    if (this.userS.usuarioActual.tipo=="cliente"){
      this.userS.GetColeccion('clientes').subscribe((data)=>{
        for (let user of data) 
        {
          if (user.uid == this.userS.usuarioActual.id || user.id == this.userS.usuarioActual.id) 
          {
            this.usuario = user;
            break;
          }
        }  
      })
    }else{
      if (this.userS.usuarioActual.tipo=="mozo"){
        this.userS.GetColeccion('empleados').subscribe((data)=>{
          for (let user of data) 
          {
            if (user.uid == this.userS.usuarioActual.id || user.id == this.userS.usuarioActual.id) 
            {
              this.usuario = user;
              break;
            }
          }  
        })
      }
    }
    
  }
  getMensajes(){
    this.mensajes=[];
    let subMensajes = this.userS.GetColeccion('chat').subscribe((data:any)=>{
      for(let item of data)
      {
        this.mensajes.push(item);
      }
      subMensajes.unsubscribe();
    });
  }

  mandarMensaje(){
    let datos;
    if (this.mensaje=="" || this.mensaje==null)
    {
      console.log("error");
      this.hayError=true;
    }else{
      if (this.userS.usuarioActual.tipo=="cliente"){
        datos = {mensaje: this.mensaje, emisor: JSON.parse(this.userS.getuserIdLocal()),tipo: this.userS.usuarioActual.tipo, mesa:this.usuario.mesa};
      }else{
        if (this.userS.usuarioActual.tipo=="mozo"){
          datos = {mensaje: this.mensaje, emisor: JSON.parse(this.userS.getuserIdLocal()),tipo: this.userS.usuarioActual.tipo, mesa:""};
        }
      }
      
      console.log(datos);
      if (this.userS.usuarioActual.tipo=="cliente")
      {
        this.pushNotification.EnviarNotificationAVariosUsuarios("mozo","Nueva consulta de cliente",this.mensaje);
      }
      this.userS.SubirDatos(datos,"chat");
      this.mensaje="";
      this.hayError=false;
      this.getMensajes();
    }

  }


}
