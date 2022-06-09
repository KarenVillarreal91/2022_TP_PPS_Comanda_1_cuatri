import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { ScandniService } from 'src/app/services/scandni.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-qr-ingreso',
  templateUrl: './qr-ingreso.component.html',
  styleUrls: ['./qr-ingreso.component.scss'],
})
export class QrIngresoComponent implements OnInit {

  constructor(private barcode: BarcodeScanner, public scanService: ScandniService, public userService: UserService) { }

  ngOnInit() {}

  async Escanear() {
    this.scanService.scan()
      .then((datos) => {
        if (datos.text=='qrIngresoAListaDeEspera')
        {
          let user = this.userService.getUsuarioActual();
          alert(user);
          this.userService.SubirUsuarioALaListaDeEspera(user);
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
        }
      }).catch(error => {
        alert(error);
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
}
