import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { LoginComponent } from './components/login/login.component';
import { AltaEmpleadosComponent } from './components/alta-empleados/alta-empleados.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { PrincipalComponent } from './components/principal/principal.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { AltaSupervisorDuenioComponent } from './components/alta-supervisor-duenio/alta-supervisor-duenio.component';
import { HomeSupervisorComponent } from './components/home-supervisor/home-supervisor.component';
import { AltaClientesComponent } from './components/alta-clientes/alta-clientes.component';
import { AltaClienteAnonimoComponent } from './components/alta-cliente-anonimo/alta-cliente-anonimo.component';
import { AltaMesaComponent } from './components/alta-mesa/alta-mesa.component';
import { EncuestaEmpleadosComponent } from './components/encuesta-empleados/encuesta-empleados.component';
import { EncuestaSupervisorComponent } from './components/encuesta-supervisor/encuesta-supervisor.component';
import { QrIngresoComponent } from './components/qr-ingreso/qr-ingreso.component';
import { RealizarPedidoComponent } from './components/realizar-pedido/realizar-pedido.component';
import { HomeClienteComponent } from './components/home-cliente/home-cliente.component';
import { HomeMozoComponent } from './components/home-mozo/home-mozo.component';

@NgModule({
  declarations: [AppComponent,
  LoginComponent,
  AltaEmpleadosComponent,
  AltaClientesComponent,
  AltaClienteAnonimoComponent,
  AltaMesaComponent,
  PrincipalComponent,
  SidebarComponent,
  AltaSupervisorDuenioComponent,
  HomeSupervisorComponent,
  HomeClienteComponent,
  HomeMozoComponent,
  EncuestaEmpleadosComponent,
  EncuestaSupervisorComponent,
  QrIngresoComponent,
  RealizarPedidoComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [BarcodeScanner,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
