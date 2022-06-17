import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-encuesta-cliente',
  templateUrl: './encuesta-cliente.component.html',
  styleUrls: ['./encuesta-cliente.component.scss'],
})
export class EncuestaClienteComponent implements OnInit {

  spinner: boolean = false;
  form!: FormGroup;
  fotos: FormData = new FormData();
  encuestas: Array<any> = [];
  verEncuestas: boolean = false;

  constructor(private router: Router,
    public userService: UserService,
    private fb: FormBuilder) {
    this.form = this.fb.group({
      'limpieza': ['', Validators.required],
      'inconvenientes': ['', Validators.required],
      'orden': [true],
      'comentario': [''],
      'quejas': ['', Validators.required],
      'foto1': [''],
      'foto2': [''],
      'foto3': ['']
    });

    Chart.register(...registerables);
  }

  ngOnInit() { }

  SubirFoto1(e: any) {
    this.fotos.append('foto1', e.target.files[0]);
  }
  SubirFoto2(e: any) {
    this.fotos.append('foto2', e.target.files[0]);
  }
  SubirFoto3(e: any) {
    this.fotos.append('foto3', e.target.files[0]);
  }

  Omitir() {
    this.spinner = true;

    setTimeout(() => {
      this.spinner = false;
      this.router.navigateByUrl('principal');
    }, 2000);
  }

  EnviarEncuesta() {
    this.userService.SubirEncuestaCliente(this.form.value, this.fotos)
      .then(() => {
        document.getElementById('enviar').setAttribute('disabled', 'disabled');

        this.spinner = true;

        setTimeout(() => {
          Swal.fire({
            title: 'Se registró la encuesta correctamente.',
            icon: 'success',
            timer: 2000,
            toast: true,
            backdrop: false,
            position: 'bottom',
            grow: 'row',
            timerProgressBar: true,
            showConfirmButton: false
          });

          this.verEncuestas = true;
          this.spinner = false;
        }, 2000);

        setTimeout(() => {
          this.router.navigateByUrl('historialEncuestas');
        }, 2000);
      }).catch(error => {
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al registrar la encuesta.',
          icon: 'error',
          timer: 2000,
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
