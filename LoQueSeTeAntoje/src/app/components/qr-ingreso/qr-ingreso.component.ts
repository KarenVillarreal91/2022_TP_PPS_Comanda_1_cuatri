import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { ScandniService } from 'src/app/services/scandni.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-qr-ingreso',
  templateUrl: './qr-ingreso.component.html',
  styleUrls: ['./qr-ingreso.component.scss'],
})
export class QrIngresoComponent implements OnInit {

  constructor(private barcode: BarcodeScanner, public scanService: ScandniService, public userService: UserService, public pushNotificationService: PushNotificationService) 
  { 

  }

  ngOnInit() {}

  async Escanear() {
    this.scanService.scan()
      .then((datos) => {
        if (datos.text=='qrIngresoAListaDeEspera')
        {
          let userId = this.CreateUserWithId();
          if (userId!=null && !this.userService.UsuarioYaEstaEnListaDeEspera(userId))
          {
            this.userService.SubirUsuarioALaListaDeEspera(userId);
            Swal.fire({
              title: "Ha ingresado a la lista de espera.",
              icon: 'success',
              timer: 4000,
              toast: true,
              backdrop: false,
              position: 'bottom',
              grow: 'row',
              timerProgressBar: true,
              showConfirmButton: false
            });
          }else{
            Swal.fire({
              title: "Error ya se encuentra en la lista de espera.",
              icon: 'error',
              timer: 4000,
              toast: true,
              backdrop: false,
              position: 'bottom',
              grow: 'row',
              timerProgressBar: true,
              showConfirmButton: false
            });
          }
          
        }
      }).catch(error => {
        Swal.fire({
          title: "Error al escanear el qr de ingreso.",
          icon: 'error',
          timer: 4000,
          toast: true,
          backdrop: false,
          position: 'bottom',
          grow: 'row',
          timerProgressBar: true,
          showConfirmButton: false
        });
      });
  }
  /**GENERAR QR */
  encodeData: any;
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;
  generarQR() {
    this.encodeData = "qrIngresoAListaDeEspera";
   
    this.barcode.encode(this.barcode.Encode.TEXT_TYPE, this.encodeData)
      .then(
        encodedData => {
          console.log(encodedData);
          this.encodeData = encodedData;
        },
        err => {
          console.log('Error occured : ' + err);
        }
      )
  }

  EnviarNotification(){
    
    this.pushNotificationService.getUser();
    this.pushNotificationService.sendPushNotification({
      registration_ids:[
      'AAAAbmnY1ho:APA91bHz7Tjn1rchhUqoGeIxPK5fyYBjy3Nnnsnv2-9YrKq_lrJNoS5snVZctp1tkuJtL_IbURVPF8TpOrZ8Kngf5GKtXgymhPBeHqGAVtr8r6c7GbqvyukJGGJWmq49UyoCBgaa_FJv'
      ],
      notification:{
        title:'prueba',
        body:'body prueba'
      },
      data:{
        id:1,
        nombre:'daniela'
      }
    })
    .subscribe((data)=>{
     alert(data);
     console.log(data);
    });
  }

  CreateUserWithId(){
    let userId = JSON.parse(this.userService.getuserIdLocal());
    let userDb = this.userService.GetColeccion('clientes').subscribe((data)=>{
      for(let item of data)
      {
        
      }
    });
    let user = new UserWithId();
    user.id = userId;
    return JSON.parse(JSON.stringify(user));
  }
}

export class UserWithId{
  id:string;
}