import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-encuesta-supervisor',
  templateUrl: './encuesta-supervisor.component.html',
  styleUrls: ['./encuesta-supervisor.component.scss'],
})
export class EncuestaSupervisorComponent implements OnInit {
  spinner:boolean = false;
  form!:FormGroup;
  //foto:FormData = new FormData();
  encuestas:Array<any> = [];
  verEncuestas:boolean = false;

  formEmpleados!:FormGroup;
  encuestasEmpleados:Array<any> = [];
  verEncuestasEmpleados:boolean = false;

  coleccionClientes : any;
  clientes : any;
  clientesBD : any;
  clientesValidos : any[] = [];
  coleccionEmpleados : any;
  empleados : any;
  empleadosBD : any;
  empleadosActuales : any[] = [];

  tipoUsuario:string="";

  constructor(private router:Router, 
    public userService:UserService,
    private fb:FormBuilder,
    private db : AngularFirestore) 
    {
      this.coleccionClientes = this.db.collection<any>('clientes');
      this.clientes = this.coleccionClientes.valueChanges({idField: 'id'});
      this.coleccionEmpleados = this.db.collection<any>('empleados');
      this.empleados = this.coleccionClientes.valueChanges({idField: 'id'});

      this.form = this.fb.group({
        'comportamiento':['',Validators.required],
        'vecesQueViene':['',Validators.required],
        'propina':[true],
        'comentario':[''],
        'comensales':['',Validators.required],
        // 'persona':['',Validators.required]
      });

      this.formEmpleados = this.fb.group({
        'comportamiento':['',Validators.required],
        'falta':['',Validators.required],
        'llegaTarde':[true],
        'comentario':[''],
        'inconvenientes':['',Validators.required],
        // 'persona':['',Validators.required]
      });
      Chart.register(...registerables);
    }

  ngOnInit() 
  {
    let clientesSub = this.clientes.subscribe((clientes : any) => {
      this.clientesBD = clientes;
      this.MapClientesHabilitados();
      clientesSub.unsubscribe();
    });
    let empleadosSub = this.empleados.subscribe((empleados : any) => {
      this.empleadosBD = empleados;
      this.MapEmpleados();
      empleadosSub.unsubscribe();
    });
  }

  esCliente(){
    console.log("tipousuario "+this.tipoUsuario);
    if (this.tipoUsuario=="cliente")  return true
    return false
  }
  MapClientesHabilitados()
  {
    this.clientesValidos = [];
    for(let item of this.clientesBD){
      if(item.habilitado == true){
        this.clientesValidos.push(item);
      }
    }
  }

  MapEmpleados()
  {
    this.empleadosActuales = [];
    for(let item of this.empleadosBD){
      this.empleadosActuales.push(item);
    }
  }

  // SubirFoto(e:any)
  // {
  //   this.foto.append('foto', e.target.files[0]);
  // }

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
    this.userService.SubirEncuestaClienteDesdeSupervisor(this.form.value)
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

  EnviarEncuestaEmpleados()
  {
    this.userService.SubirEncuestaEmpleadosDesdeSupervisor(this.formEmpleados.value)
    .then(()=>{
      document.getElementById('enviarFormEmpleado').setAttribute('disabled', 'disabled');

      this.spinner = true;//mirar spinner
      
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
        
        this.verEncuestasEmpleados = true;
        this.spinner = false;
      }, 2000);

      setTimeout(() => {
        this.MostrarEncuestasEmpleados();
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
    let encuestas = this.userService.GetColeccion('encuestaClientesDesdeSupervisor').subscribe((data)=>{
      this.encuestas = data;  
      this.barChartEncuestaComportamiento();   
      this.doughnutChartVecesQueViene();
      this.doughnutChartPropina(); 
      this.doughnutChartComensales();
      encuestas.unsubscribe();
    });
  }

  MostrarEncuestasEmpleados()
  {
    let encuestasSub = this.userService.GetColeccion('encuestaEmpleadosDesdeSupervisor').subscribe((data)=>{
      this.encuestasEmpleados = data;  
      this.barChartEncuestaComportamientoEmpleados();   
      this.doughnutChartFalta();
      this.doughnutChartLlegaTarde(); 
      this.doughnutChartInconvenientes();
      encuestasSub.unsubscribe();
    });
  }

  @ViewChild('comportamientoCanvas') private comportamientoCanvas: ElementRef;
  @ViewChild('vecesQueVieneCanvas') private vecesQueVieneCanvas: ElementRef;
  @ViewChild('propinaCanvas') private propinaCanvas: ElementRef;
  @ViewChild('comensalesCanvas') private comensalesCanvas: ElementRef;

  @ViewChild('comportamientoEmpleadosCanvas') private comportamientoEmpleadosCanvas: ElementRef;
  @ViewChild('faltaCanvas') private faltaCanvas: ElementRef;
  @ViewChild('llegaTardeCanvas') private llegaTardeCanvas: ElementRef;
  @ViewChild('inconvenientesCanvas') private inconvenientesCanvas: ElementRef;

  barChart: any;
  doughnutChart: any;
  lineChart: any;

  barChartEncuestaComportamiento() {
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
      valoresPorPuntaje[encuesta.comportamiento]++;  
    });

    this.barChart = new Chart(this.comportamientoCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
          label: 'Puntaje del comportamiento',
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
  barChartEncuestaComportamientoEmpleados() {
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
    this.encuestasEmpleados.forEach( (encuesta:any) => {
      valoresPorPuntaje[encuesta.comportamiento]++;  
    });

    this.barChart = new Chart(this.comportamientoEmpleadosCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
          label: 'Puntaje del comportamiento',
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

  doughnutChartFalta() {
    let valoresPorPuntaje = {
      pocas: 0,
      varias: 0,
      muchas: 0
    };

    this.encuestasEmpleados.forEach( (encuesta:any) => {
      valoresPorPuntaje[encuesta.falta]++;
    });

    this.doughnutChart = new Chart(this.faltaCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Pocas', 'Varias', 'Muchas'],
        datasets: [{
          label: '# of Votes',
          data: [valoresPorPuntaje['pocas'], valoresPorPuntaje['varias'], valoresPorPuntaje['muchas']],
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

  doughnutChartVecesQueViene() {
    let valoresPorPuntaje = {
      pocas: 0,
      varias: 0,
      muchas: 0
    };

    this.encuestas.forEach( (encuesta:any) => {
      valoresPorPuntaje[encuesta.vecesQueViene]++;
    });

    this.doughnutChart = new Chart(this.vecesQueVieneCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Pocas', 'Varias', 'Muchas'],
        datasets: [{
          label: '# of Votes',
          data: [valoresPorPuntaje['pocas'], valoresPorPuntaje['varias'], valoresPorPuntaje['muchas']],
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

  doughnutChartPropina() {
    let valoresPorPuntaje = {
      si: 0,
      no: 0
    };

    this.encuestas.forEach( (encuesta:any) => {
      if(encuesta.propina)
      {
        valoresPorPuntaje['si']++;
      }
      else{
        valoresPorPuntaje['no']++;
      } 
    });

    this.doughnutChart = new Chart(this.propinaCanvas.nativeElement, {
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

  doughnutChartLlegaTarde() {
    let valoresPorPuntaje = {
      si: 0,
      no: 0
    };

    this.encuestasEmpleados.forEach( (encuesta:any) => {
      if(encuesta.llegaTarde)
      {
        valoresPorPuntaje['si']++;
      }
      else{
        valoresPorPuntaje['no']++;
      } 
    });

    this.doughnutChart = new Chart(this.llegaTardeCanvas.nativeElement, {
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

  doughnutChartComensales() {
    let valoresPorPuntaje = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0
    };

    this.encuestas.forEach( (encuesta:any) => {
      valoresPorPuntaje[encuesta.comensales]++;
    });

    this.doughnutChart = new Chart(this.comensalesCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Ninguno', '1', '2', '3', 'Más de 3'],
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

  doughnutChartInconvenientes() {
    let valoresPorPuntaje = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0
    };

    this.encuestasEmpleados.forEach( (encuesta:any) => {
      valoresPorPuntaje[encuesta.inconvenientes]++;
    });

    this.doughnutChart = new Chart(this.inconvenientesCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Ninguno', '1', '2', '3', 'Más de 3'],
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
