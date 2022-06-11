import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  email:any = '';
  password:any = '';
  logged:boolean = false;
  error:string;

  constructor(private userService:UserService, private router:Router) { }

  ngOnInit() {}

  async Login()
  {
    let usuario = {email:this.email, password:this.password};
    this.userService.Login(usuario)
    .then((res:any)=>{
      this.logged = true;
      this.userService.getUsuarioActual().subscribe((us:any)=>{
        localStorage.setItem('idUsuario', JSON.stringify(us[0].payload.doc.id));
      });
      setTimeout(() => {
        this.userService.usuarioActual.mesa = '';
        this.router.navigateByUrl('principal');
        this.logged = false;
      }, 2000);
    }).catch((error)=>{
      if(error.code == 'auth/wrong-password' || error.code == 'auth/user-not-found')
      {
        Swal.fire({
          title: 'Error',
          text: 'Correo o contraseña son incorrectos.',
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
      else if(error.code == 'auth/missing-email' || error.code == 'auth/internal-error' || usuario.email == "" || usuario.password == "")
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
      else if(error.code == 'auth/invalid-email')
      {
        Swal.fire({
          title: 'Error',
          text: 'Correo no válido.',
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
      else if(error.code == 'auth/too-many-requests')
      {
        Swal.fire({
          title: 'Error',
          text: 'Demasiados intentos fallidos. Reintente más tarde.',
          icon: 'warning',
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
          text: 'Credenciales incorrectas.',
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
    });
  }

  InicioAutomatico(email:any, password:any)
  {
    this.email = email;
    this.password = password;

    this.Login();
  }

}
