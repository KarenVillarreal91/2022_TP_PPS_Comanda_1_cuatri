import { Component, OnInit } from '@angular/core';
import { ScandniService } from 'src/app/services/scandni.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.scss'],
})
export class HomeClienteComponent implements OnInit {

  spinner:boolean = false;

  constructor(private userService:UserService, private scanService:ScandniService) { }

  ngOnInit() {}

  async Escanear() {
    this.scanService.scan()
      .then((datos) => {
        if(datos.text)
        {
          this.userService.usuarioActual.mesa = datos.text;

          Swal.fire({
            title: "Su mesa es la " + datos.text,
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
        Swal.fire({
          title: "Ocurrió un error al escanear el QR.",
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
}
