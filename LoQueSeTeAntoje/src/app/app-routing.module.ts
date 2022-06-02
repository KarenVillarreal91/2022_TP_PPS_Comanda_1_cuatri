import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AltaEmpleadosComponent } from './components/alta-empleados/alta-empleados.component';
import { AltaSupervisorDuenioComponent } from './components/alta-supervisor-duenio/alta-supervisor-duenio.component';
import { HomeSupervisorComponent } from './components/home-supervisor/home-supervisor.component';
import { LoginComponent } from './components/login/login.component';
import { PrincipalComponent } from './components/principal/principal.component';

const routes: Routes = [
  {path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'principal', component: PrincipalComponent},
  {path: 'altaEmpleados', component: AltaEmpleadosComponent},
  {path: 'altaSupervisor', component: AltaSupervisorDuenioComponent},
  {path: 'homeSupervisor', component: HomeSupervisorComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
