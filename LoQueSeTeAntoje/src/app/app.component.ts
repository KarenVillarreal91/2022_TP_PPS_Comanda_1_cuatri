import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform:Platform) {}

  initializeApp() {
    this.platform.ready().then(async () => {
        SplashScreen.hide();
    });
  }
}