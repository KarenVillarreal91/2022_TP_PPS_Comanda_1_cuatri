import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HistorialEncuestasComponent } from './historial-encuestas.component';

describe('HistorialEncuestasComponent', () => {
  let component: HistorialEncuestasComponent;
  let fixture: ComponentFixture<HistorialEncuestasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialEncuestasComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialEncuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
