import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
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

  constructor(private barcode: BarcodeScanner, 
    public scanService: ScandniService, 
    public userService: UserService, 
    public pushNotificationService: PushNotificationService, 
    public firestore:AngularFirestore,
    private router:Router) 
  { 

  }

  ngOnInit() {}

  async Escanear() {
    this.scanService.scan()
      .then((datos) => {
        if (datos.text=='qrIngresoAListaDeEspera')
        {
          let userId = JSON.parse(this.userService.getuserIdLocal());
          let user:any;
          let coleccion = this.firestore.collection("clientes").doc(userId).valueChanges({idField: 'id'});
          coleccion.forEach((data:any)=>{user = data;});
          //no me gusta, se aceptan sugerencias
          setTimeout(() => {
            if (!user.enListaDeEspera)
            {
              user.enListaDeEspera=true;
              this.userService.updateUser(userId, user, 'clientes');
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
              this.router.navigateByUrl('homeCliente');
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
          }, 3000);
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

  probarNotification(){
    let idUser = JSON.parse(this.userService.getuserIdLocal());
    this.pushNotificationService.EnviarNotificationAUnUsuario(idUser,"PRUEBA PRUEBA","PROBANDO PROBANDO");
  }


}
