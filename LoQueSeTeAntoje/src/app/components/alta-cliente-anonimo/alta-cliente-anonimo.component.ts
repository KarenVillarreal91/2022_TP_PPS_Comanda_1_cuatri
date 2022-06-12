import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ScandniService } from 'src/app/services/scandni.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-alta-cliente-anonimo',
  templateUrl: './alta-cliente-anonimo.component.html',
  styleUrls: ['./alta-cliente-anonimo.component.scss'],
})
export class AltaClienteAnonimoComponent implements OnInit {
  spinner:boolean = false;
  formData: FormData = new FormData();
  dataUrl = 'assets/default.png';
  form !: FormGroup;

  constructor(private router:Router, 
    public userService:UserService, 
    public scanService:ScandniService,
    private fb:FormBuilder) 
  { 
    this.form = this.fb.group({
      'nombre':['', Validators.required],
    });
  }
  
  ngOnInit() {}

  async SacarFoto(){
    let foto =  await Camera.getPhoto({
      quality: 100,
      width : 800,
      height : 800,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      webUseInput: true,
    });

    this.dataUrl = foto.dataUrl;
  }
  
  Reiniciar()
  {
    this.form.reset();
    this.dataUrl = 'assets/default.png';
  }

  async Registro()
  {
      let usuario = {nombre: this.form.value.nombre, habilitado: 'habilitado', tipo: 'cliente',  enListaDeEspera: false, mesa: ''};

      this.userService.SubirCliente(usuario, this.dataUrl)
      .then(()=>{
        document.getElementById('enviar').setAttribute('disabled', 'disabled');
        this.spinner = true;

        setTimeout(() => {
          Swal.fire({
            title: 'Cliente dado de alta correctamente.',
            icon: 'success',
            timer: 2000,
            toast: true,
            backdrop: false,
            position: 'bottom',
            grow: 'row',
            timerProgressBar: true,
            showConfirmButton: false
          });

          this.Reiniciar();
          this.spinner = false;
        }, 2000);
      }).catch(error=>{
        console.log(error);
      });
  }

}
