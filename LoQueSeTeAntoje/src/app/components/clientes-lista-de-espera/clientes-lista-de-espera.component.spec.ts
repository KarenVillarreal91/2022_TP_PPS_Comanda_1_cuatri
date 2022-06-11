import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClientesListaDeEsperaComponent } from './clientes-lista-de-espera.component';

describe('ClientesListaDeEsperaComponent', () => {
  let component: ClientesListaDeEsperaComponent;
  let fixture: ComponentFixture<ClientesListaDeEsperaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientesListaDeEsperaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesListaDeEsperaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
