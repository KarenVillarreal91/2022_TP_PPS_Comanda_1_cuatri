import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AltaSupervisorDuenioComponent } from './alta-supervisor-duenio.component';

describe('AltaSupervisorDuenioComponent', () => {
  let component: AltaSupervisorDuenioComponent;
  let fixture: ComponentFixture<AltaSupervisorDuenioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaSupervisorDuenioComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AltaSupervisorDuenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
