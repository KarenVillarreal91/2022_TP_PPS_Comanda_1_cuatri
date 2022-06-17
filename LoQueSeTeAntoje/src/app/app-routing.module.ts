import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AltaClientesComponent } from './components/alta-clientes/alta-clientes.component';
import { AltaEmpleadosComponent } from './components/alta-empleados/alta-empleados.component';
import { AltaMesaComponent } from './components/alta-mesa/alta-mesa.component';
import { AltaSupervisorDuenioComponent } from './components/alta-supervisor-duenio/alta-supervisor-duenio.component';
import { ChatComponent } from './components/chat/chat.component';
import { ClientesListaDeEsperaComponent } from './components/clientes-lista-de-espera/clientes-lista-de-espera.component';
import { EncuestaClienteComponent } from './components/encuesta-cliente/encuesta-cliente.component';
import { EncuestaEmpleadosComponent } from './components/encuesta-empleados/encuesta-empleados.component';
import { EncuestaSupervisorComponent } from './components/encuesta-supervisor/encuesta-supervisor.component';
import { HistorialEncuestasComponent } from './components/historial-encuestas/historial-encuestas.component';
import { HomeBartenderComponent } from './components/home-bartender/home-bartender.component';
import { HomeClienteComponent } from './components/home-cliente/home-cliente.component';
import { HomeCocineroComponent } from './components/home-cocinero/home-cocinero.component';
import { HomeMetreComponent } from './components/home-metre/home-metre.component';
import { HomeMozoComponent } from './components/home-mozo/home-mozo.component';
import { HomeSupervisorComponent } from './components/home-supervisor/home-supervisor.component';
import { JuegoUnoComponent } from './components/juego-uno/juego-uno.component';
import { LoginComponent } from './components/login/login.component';
import { MayoromenorComponent } from './components/mayoromenor/mayoromenor.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { QrIngresoComponent } from './components/qr-ingreso/qr-ingreso.component';
import { RealizarPedidoComponent } from './components/realizar-pedido/realizar-pedido.component';

const routes: Routes = [
  {path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'principal', component: PrincipalComponent},
  {path: 'altaEmpleados', component: AltaEmpleadosComponent},
  {path: 'altaSupervisor', component: AltaSupervisorDuenioComponent},
  {path: 'homeSupervisor', component: HomeSupervisorComponent},
  {path: 'homeCliente', component: HomeClienteComponent},
  {path: 'homeMozo', component: HomeMozoComponent},
  {path: 'homeCocinero', component: HomeCocineroComponent},
  {path: 'homeBartender', component: HomeBartenderComponent},
  {path: 'homeMetre', component: HomeMetreComponent},
  {path: 'altaClientes', component: AltaClientesComponent},
  {path: 'altaMesa', component: AltaMesaComponent},
  {path: 'encuestaEmpleados', component: EncuestaEmpleadosComponent},
  {path: 'encuestaCliente', component: EncuestaClienteComponent},
  {path: 'encuestaSupervisor', component: EncuestaSupervisorComponent},
  {path: 'qrIngreso', component: QrIngresoComponent},
  {path: 'realizarPedido', component: RealizarPedidoComponent},
  {path: 'listaDeEspera', component: ClientesListaDeEsperaComponent},
  {path: 'juegoUno', component: JuegoUnoComponent},
  {path: 'juegoMayorMenor', component: MayoromenorComponent},
  {path: 'historialEncuestas', component: HistorialEncuestasComponent},
  {path: 'chat', component: ChatComponent},

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
