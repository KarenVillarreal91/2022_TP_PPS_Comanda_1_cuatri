import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta-empleados',
  templateUrl: './encuesta-empleados.component.html',
  styleUrls: ['./encuesta-empleados.component.scss'],
})
export class EncuestaEmpleadosComponent implements OnInit {

  spinner:boolean = false;
  form!:FormGroup;
  foto:FormData = new FormData();
  encuestas:Array<any> = [];
  verEncuestas:boolean = false;

  constructor(private router:Router, 
    public userService:UserService,
    private fb:FormBuilder) 
  { 
    this.form = this.fb.group({
      'limpieza':['',Validators.required],
      'inconvenientes':['',Validators.required],
      'orden':[true],
      'comentario':[''],
      'quejas':['',Validators.required],
      'foto':['',Validators.required]
    });

    Chart.register(...registerables);
  }

  ngOnInit() {}

  SubirFoto(e:any)
  {
    this.foto.append('foto', e.target.files[0]);
  }

  Omitir()
  {
    this.spinner = true;
    
    setTimeout(() => {
      this.spinner = false;
      this.router.navigateByUrl('principal');
    }, 2000);
  }

  EnviarEncuesta()
  {
    this.userService.SubirEncuestaEmpleado(this.form.value, this.foto)
    .then(()=>{
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
        this.MostrarEncuestas();
      }, 4000);
    }).catch(error=>{
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

  MostrarEncuestas()
  {
    let encuentasSub = this.userService.GetColeccion('encuestaEmpleados').subscribe((data)=>{
      this.encuestas = data;  
      this.barChartEncuestaLimpieza();   
      this.doughnutChartInconvenientes();
      this.doughnutChartOrden(); 
      this.doughnutChartQuejas();
      encuentasSub.unsubscribe();
    });
  }

  @ViewChild('limpiezaCanvas') private limpiezaCanvas: ElementRef;
  @ViewChild('inconvenientesCanvas') private inconvenientesCanvas: ElementRef;
  @ViewChild('ordenCanvas') private ordenCanvas: ElementRef;
  @ViewChild('quejasCanvas') private quejasCanvas: ElementRef;

  barChart: any;
  doughnutChart: any;
  lineChart: any;

  barChartEncuestaLimpieza() {
    let valoresPorPuntaje = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0
    };
    this.encuestas.forEach( (encuesta:any) => {
      valoresPorPuntaje[encuesta.limpieza]++;  
    });

    this.barChart = new Chart(this.limpiezaCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
          label: 'Puntaje de la limpieza',
          data: [valoresPorPuntaje[1], valoresPorPuntaje[2], valoresPorPuntaje[3], valoresPorPuntaje[4], valoresPorPuntaje[5], valoresPorPuntaje[6], valoresPorPuntaje[7], valoresPorPuntaje[8], valoresPorPuntaje[9], valoresPorPuntaje[10]],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });
  }

  doughnutChartInconvenientes() {
    let valoresPorPuntaje = {
      ninguno: 0,
      algunos: 0,
      muchos: 0
    };

    this.encuestas.forEach( (encuesta:any) => {
      valoresPorPuntaje[encuesta.inconvenientes]++;
    });

    this.doughnutChart = new Chart(this.inconvenientesCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Ninguno', 'Algunos', 'Muchos'],
        datasets: [{
          label: '# of Votes',
          data: [valoresPorPuntaje['ninguno'], valoresPorPuntaje['algunos'], valoresPorPuntaje['muchos']],
          backgroundColor: [
            'rgb(46, 231, 108)',
            'rgb(255, 206, 86)',
            'rgb(212, 65, 65)'
          ],
          hoverBackgroundColor: [
            'rgb(46, 231, 108, 0.5)',
            'rgb(255, 206, 86, 0.5)',
            'rgb(212, 65, 65, 0.5)'
          ]
        }]
      }
    });
  }

  doughnutChartOrden() {
    let valoresPorPuntaje = {
      si: 0,
      no: 0
    };

    this.encuestas.forEach( (encuesta:any) => {
      if(encuesta.orden)
      {
        valoresPorPuntaje['si']++;
      }
      else{
        valoresPorPuntaje['no']++;
      } 
    });

    this.doughnutChart = new Chart(this.ordenCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Sí', 'No'],
        datasets: [{
          label: '# of Votes',
          data: [valoresPorPuntaje['si'], valoresPorPuntaje['no']],
          backgroundColor: [
            'rgb(255, 206, 86)',
            'rgb(212, 65, 65)'
          ],
          hoverBackgroundColor: [
            'rgb(255, 206, 86, 0.5)',
            'rgb(212, 65, 65, 0.5)'
          ]
        }]
      }
    });
  }

  doughnutChartQuejas() {
    let valoresPorPuntaje = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0
    };

    this.encuestas.forEach( (encuesta:any) => {
      valoresPorPuntaje[encuesta.quejas]++;
    });

    this.doughnutChart = new Chart(this.quejasCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Ninguna', '1', '2', '3', 'Más de 3'],
        datasets: [{
          label: '# of Votes',
          data: [valoresPorPuntaje[0], valoresPorPuntaje[1], valoresPorPuntaje[2], valoresPorPuntaje[3], valoresPorPuntaje[4]],
          backgroundColor: [
            'rgb(77, 250, 86)',
            'rgb(250, 247, 77)',
            'rgb(250, 140, 77)',
            'rgb(250, 112, 77)',
            'rgb(250, 77, 77)'
          ],
          hoverBackgroundColor: [
            'rgb(77, 250, 86, 0.5)',
            'rgb(250, 247, 77, 0.5)',
            'rgb(250, 140, 77, 0.5)',
            'rgb(250, 112, 77, 0.5)',
            'rgb(250, 77, 77, 0.5)'
          ]
        }]
      }
    });
  }
}
