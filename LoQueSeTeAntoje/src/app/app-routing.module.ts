import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AltaClienteAnonimoComponent } from './components/alta-cliente-anonimo/alta-cliente-anonimo.component';
import { AltaClientesComponent } from './components/alta-clientes/alta-clientes.component';
import { AltaEmpleadosComponent } from './components/alta-empleados/alta-empleados.component';
import { AltaMesaComponent } from './components/alta-mesa/alta-mesa.component';
import { AltaSupervisorDuenioComponent } from './components/alta-supervisor-duenio/alta-supervisor-duenio.component';
import { EncuestaEmpleadosComponent } from './components/encuesta-empleados/encuesta-empleados.component';
import { EncuestaSupervisorComponent } from './components/encuesta-supervisor/encuesta-supervisor.component';
import { HomeSupervisorComponent } from './components/home-supervisor/home-supervisor.component';
import { LoginComponent } from './components/login/login.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { QrIngresoComponent } from './components/qr-ingreso/qr-ingreso.component';

const routes: Routes = [
  {path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'principal', component: PrincipalComponent},
  {path: 'altaEmpleados', component: AltaEmpleadosComponent},
  {path: 'altaSupervisor', component: AltaSupervisorDuenioComponent},
  {path: 'homeSupervisor', component: HomeSupervisorComponent},
  {path: 'altaClientes', component: AltaClientesComponent},
  {path: 'altaClienteAnonimo', component: AltaClienteAnonimoComponent},
  {path: 'altaMesa', component: AltaMesaComponent},
  {path: 'encuestaEmpleados', component: EncuestaEmpleadosComponent},
  {path: 'encuestaSupervisor', component: EncuestaSupervisorComponent},
  {path: 'qrIngreso', component: QrIngresoComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
