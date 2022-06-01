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
  scan:boolean = false;
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
    this.scan = true;

    this.scanService.scanDNI()
    .then((datos)=>{
      document.getElementById('nombre').innerText = datos?.nombre;
      document.getElementById('apellido').innerText = datos.apellido;
      document.getElementById('dni').innerText = datos.dni;
      document.getElementById('cuil').innerText = datos.cuil;

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
    if(this.scan)
    {
      this.form.value.nombre = document.getElementById('nombre').innerText;
      this.form.value.apellido = document.getElementById('apellido').innerText;
      this.form.value.dni = document.getElementById('dni').innerText;
      this.form.value.cuil = document.getElementById('cuil').innerText;
  
      this.scan = false;
    }

      let usuario = {nombre: this.form.value.nombre, apellido: this.form.value.apellido, dni: this.form.value.dni, cuil: this.form.value.cuil, tipo: this.form.value.tipo};

      this.userService.SubirEmpleado(usuario, this.dataUrl)
        .then(()=>{
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
  }
}
