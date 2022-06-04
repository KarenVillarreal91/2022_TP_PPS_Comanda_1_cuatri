import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ScandniService } from 'src/app/services/scandni.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-alta-empleados',
  templateUrl: './alta-empleados.component.html',
  styleUrls: ['./alta-empleados.component.scss'],
})
export class AltaEmpleadosComponent implements OnInit {

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
      'email':['',[Validators.required, Validators.email]],
      'password':['', Validators.required],
      'nombre':['', Validators.required],
      'apellido':['', Validators.required],
      'dni':['',[Validators.required, Validators.min(1000000), Validators.max(99999999)]],
      'cuil':['',[Validators.required, Validators.min(10000000000), Validators.max(99999999999)]],
      'tipo':['', Validators.required]
    });
  }
  
  ngOnInit() {}

  async Escanear()
  {
    this.scanService.scanDNI()
    .then((datos)=>{
      this.form.controls['nombre'].setValue(datos?.nombre);
      this.form.controls['apellido'].setValue(datos.apellido);
      this.form.controls['dni'].setValue(datos.dni);
      this.form.controls['cuil'].setValue(datos.cuil);

      Swal.fire({
        title: "Datos escaneados correctamente.",
        icon: 'success',
        timer: 4000,
        toast: true,
        backdrop: false,
        position: 'bottom',
        grow: 'row',
        timerProgressBar: true,
        showConfirmButton: false
      });
    }).catch(error=>{
      Swal.fire({
        title: "Error al escanear el DNI.",
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
    let usuario = {nombre: this.form.value.nombre, apellido: this.form.value.apellido, dni: this.form.value.dni, cuil: this.form.value.cuil, tipo: this.form.value.tipo};

    this.userService.Registro(this.form.value)
    .then((res:any)=>{

      this.userService.SubirEmpleado(usuario, this.dataUrl)
      .then(()=>{
        document.getElementById('enviar').setAttribute('disabled', 'disabled');

        this.spinner = true;

        setTimeout(() => {
          Swal.fire({
            title: 'Empleado dado de alta correctamente.',
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
    }).catch(error=>{
      this.Errores(error);
    });
  }

  Errores(error:any)
  {
    if(error.code == 'auth/email-already-in-use')
      {
        Swal.fire({
          title: 'Error',
          text: 'El correo ya está en uso.',
          icon: 'error',
          timer: 2000,
          toast: true,
          backdrop: false,
          position: 'bottom',
          grow: 'row',
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
      else if(error.code == 'auth/missing-email' || error.code == 'auth/internal-error')
      {
        Swal.fire({
          title: 'Error',
          text: 'No pueden quedar campos vacíos.',
          icon: 'error',
          timer: 2000,
          toast: true,
          backdrop: false,
          position: 'bottom',
          grow: 'row',
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
      else if(error.code == 'auth/weak-password')
      {
        Swal.fire({
          title: 'Error',
          text: 'La contraseña debe contener al menos 6 caracteres.',
          icon: 'error',
          timer: 2000,
          toast: true,
          backdrop: false,
          position: 'bottom',
          grow: 'row',
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
      else
      {
        Swal.fire({
          title: 'Error',
          text: 'El mail o la contraseña no son válidos.',
          icon: 'error',
          timer: 2000,
          toast: true,
          backdrop: false,
          position: 'bottom',
          grow: 'row',
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
      
      console.log(error.code);
  }
}
