import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { AnimationController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private animController : AnimationController,
    private router : Router
    ) {}

    async ionViewDidEnter(){
      SplashScreen.hide();
      const animation = this.animController
      .create()
      .addElement(document.querySelector('#container'))
      .duration(2000)
      .fromTo('opacity', '1', '0');
      await animation.play();
      this.router.navigateByUrl('login');
    }

}
