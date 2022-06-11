import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner, BarcodeScannerOptions } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-alta-mesa',
  templateUrl: './alta-mesa.component.html',
  styleUrls: ['./alta-mesa.component.scss'],
})
export class AltaMesaComponent implements OnInit {
  spinnerLoad: any = { isLoading: false, btn: "Enviar y generar QR" };
  public form: FormGroup;
  dataUrl = 'assets/default_table.png';
  comensales: number = 0;
  numeroMesa: number = 0;

  constructor(private barcode: BarcodeScanner, private fb: FormBuilder, private userS: UserService, private toastController: ToastController) {

    this.form = fb.group({
      numero: ['', [Validators.required]],
      comensales: ['', Validators.required],
      tipo: ['Estandar', Validators.required],
      foto: ['', Validators.required],
      qr: [''],
      ocupada:[false]
    });

    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    }
  }

  ngOnInit() {
  }

  restarComensal() {
    if (this.comensales > 0) {
      this.comensales--;
    }
  }
  sumarComensal() {
    this.comensales++;
  }

  asignarValoresAlForm() {
    this.numeroMesa = parseInt((<HTMLInputElement>document.getElementById('numeroMesa')).value);

    this.form.get('numero').setValue(this.numeroMesa);
    this.form.get('comensales').setValue(this.comensales);
  }

  seleccionarTipo(tipo: string) {
    (<HTMLInputElement>document.getElementById('VIP')).style.setProperty('--background', 'gray');
    (<HTMLInputElement>document.getElementById('Discapacitados')).style.setProperty('--background', 'gray');
    (<HTMLInputElement>document.getElementById('Estandar')).style.setProperty('--background', 'gray');
    (<HTMLInputElement>document.getElementById('otros')).style.setProperty('--background', 'gray');

    (<HTMLInputElement>document.getElementById(tipo)).style.setProperty('--background', '#FC8038');

    this.form.get('tipo').setValue(tipo);
  }



  capturedPhoto: any;
  /** Solo saca la foto y la guarda en capturedPhoto
   * 
   */
  async takePhoto() {
    this.capturedPhoto = await Camera.getPhoto({
      quality: 80,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      webUseInput: true,
    });
    this.dataUrl = this.capturedPhoto.dataUrl;


    this.form.get('foto').setValue('true');
  }

  Reiniciar() {
    this.form.reset();
    this.dataUrl = 'assets/default_table.png';
  }

  async agregarFotoAlStorage(nombre: any) {
    //Obtiene el dataUrl de la foto y la referencia a donde la tiene que subir
    let ref = this.userS.reference(nombre);

    //Espera que suba la foto al sotrage
    await ref.putString(this.dataUrl, 'data_url', {
      contentType: 'image/jpeg',
    })
      .then(() => {
        //luego recoje el url de firebase para acceder a la foto
        ref.getDownloadURL().toPromise().then((url: any) => {
          //Setea el valor de esa url en el form
          this.form.get('foto').setValue(url);
          let codigoQR = this.form.get('numero').value + '-' + this.form.get('comensales').value + '-' + this.form.get('tipo').value + '-mesa';
          this.form.get('qr').setValue(codigoQR);
          console.info('VALORES DEL FORM', this.form.value);
          this.userS.agregarMesa(this.form.getRawValue()).then(() => {
            this.finishSpinner();
            setTimeout(() => {
              Swal.fire({
                title: 'Mesa dada de alta correctamente.',
                icon: 'success',
                timer: 2000,
                toast: true,
                backdrop: false,
                position: 'bottom',
                grow: 'row',
                timerProgressBar: true,
                showConfirmButton: false
              });
              this.generarQR();

              this.Reiniciar();
            }, 2000);
          }).catch(error => {

            Swal.fire({
              title: "Error al dar mesa de alta.",
              icon: 'error',
              timer: 4000,
              toast: true,
              backdrop: false,
              position: 'bottom',
              grow: 'row',
              timerProgressBar: true,
              showConfirmButton: false
            });
            this.finishSpinner();
            console.log(error);
          });
        });
      });
  }



  /**GENERAR QR */
  encodeData: any;
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;
  generarQR() {
    this.encodeData = this.form.getRawValue();

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


  async enviar() {
    this.startSpinner();
    let id = 'mesas/mesa' + this.form.get('numero').value + '-' + Date.now().toString();

    this.asignarValoresAlForm();

    if (this.numeroMesa != 0 && this.comensales != 0 && this.dataUrl != 'assets/default_table.png') {
      await this.agregarFotoAlStorage(id);  //ACA SE AGREGA LA MESA AL FIRESTORE
    }
    else {
      Swal.fire({
        title: "Recuerde ingresar el numero de mesa, su foto y la cantidad de comensales",
        icon: 'error',
        timer: 4000,
        toast: true,
        backdrop: false,
        position: 'bottom',
        grow: 'row',
        timerProgressBar: true,
        showConfirmButton: false
      });
      this.finishSpinner();
    }
  }





  /**ESCANEAR QR */
  scanCode() {
    this.barcode
      .scan()
      .then(barcodeData => {
        alert("Barcode data " + JSON.stringify(barcodeData));
        this.scannedData = barcodeData;
      })
      .catch(err => {
        console.log("Error", err);
      });
  }




  startSpinner() {
    this.spinnerLoad.isLoading = true;
    this.spinnerLoad.btn = "";
  }

  finishSpinner() {
    this.spinnerLoad.isLoading = false;
    this.spinnerLoad.btn = "Enviar y generar QR";
  }

  async toastPresent(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      cssClass: 'custom-toast',
      position: 'top',
    });
    await toast.present();
  }

}
