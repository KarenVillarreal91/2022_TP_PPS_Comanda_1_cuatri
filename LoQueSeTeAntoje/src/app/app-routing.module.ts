import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AltaClienteAnonimoComponent } from './components/alta-cliente-anonimo/alta-cliente-anonimo.component';
import { AltaClientesComponent } from './components/alta-clientes/alta-clientes.component';
import { AltaEmpleadosComponent } from './components/alta-empleados/alta-empleados.component';
import { LoginComponent } from './components/login/login.component';
import { PrincipalComponent } from './components/principal/principal.component';

const routes: Routes = [
  {path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'principal', component: PrincipalComponent},
  {path: 'altaEmpleados', component: AltaEmpleadosComponent},
  {path: 'altaClientes', component: AltaClientesComponent},
  {path: 'altaClienteAnonimo', component: AltaClienteAnonimoComponent},

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
