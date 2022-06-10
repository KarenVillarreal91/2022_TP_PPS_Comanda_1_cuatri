import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreDocument, DocumentData, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { LocalNotifications } from '@capacitor/local-notifications';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private user;

  constructor(private platform: Platform, private firestore: AngularFirestore, private http: HttpClient) 
  { 

  }
 async inicializar(): Promise<void> {
    this.addListeners();
    // alert("token de user en inicializar "+this.user.token);
    // // Verificamos que este en un dispositivo y no en una PC y tambien que el usuario no tegna seteado el token
    // if (this.platform.is('capacitor') && this.user.token === '') {
    //   alert("en permision");
    //   const result = await PushNotifications.requestPermissions();
    //   if (result.receive === 'granted') {
    //     alert("en result");
    //     await PushNotifications.register();
    //   }
    // }else{
    //   alert("afuera de permision");
    // }
    const result = await PushNotifications.requestPermissions();
    if (result.receive === 'granted') {
      alert("en result "+result.receive);
       PushNotifications.register();
    }
  }

  getUser(): void {
    const aux = this.firestore.doc('supervisorDuenio/spNNdRz3Ib5S8jybrtsk');
    let sub = this.firestore.collection('supervisorDuenio').valueChanges({idField: 'id'}).subscribe(async(user)=>{
      this.user=user[0];
      console.log("en get user "+this.user);
      //alert("en get user "+this.user.nombre);
      this.inicializar();
      sub.unsubscribe();
    });
  }

    sendPushNotification(req): Observable<any> {
      //alert("en send"+req);
      return this.http.post<Observable<any>>(environment.fcmUrl, req, {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `key=${environment.fcmServerKey}`,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Content-Type': 'application/json',
        },
      });
    }

    private async addListeners(): Promise<void> {
      //Ocurre cuando el registro de las push notifications finaliza sin errores
      await PushNotifications.addListener(
        'registration',
        async (token: Token) => {
          //Acá deberiamos asociar el token a nuestro usario en nuestra bd
          console.log('Registration token: ', token.value);
          //alert("token"+token.value);

          //this.firestore.collection(coleccion).doc(id).update(data);
          const aux = this.firestore.doc(`supervisorDuenio/${this.user.id}`);
          //alert(aux);
          console.log(aux);
          await this.firestore.collection('supervisorDuenio').doc(`${this.user.id}`).update({token: token.value});
          //const aux = doc(this.firestore, `personas/${this.user.id}`);
          // await updateDoc(aux, {
          //   token: token.value,
          // });
        }
      );
  
      //Ocurre cuando el registro de las push notifications finaliza con errores
      await PushNotifications.addListener('registrationError', (err) => {
        alert('Registration error: '+ err.error);
        console.error('Registration error: ', err.error);
      });
  
      //Ocurre cuando el dispositivo recive una notificacion push
      await PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          //Este evento solo se activa cuando tenemos la app en primer plano
          console.log('Push notification received: ', notification);
          console.log('data: ', notification.data);
          //Esto se hace en el caso de que querramos que nos aparezca la notificacion en la task bar del celular ya que por
          //defecto las push en primer plano no lo hacen, de no ser necesario esto se puede sacar.
          LocalNotifications.schedule({
            notifications: [
              {
                title: notification.title || '',
                body: notification.body || '',
                id: new Date().getMilliseconds(),
                extra: {
                  data: notification.data,
                },
              },
            ],
          });
        }
      );
  
      //Ocurre cuando se realiza una accion sobre la notificacion push
      await PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          //Este evento solo se activa cuando tenemos la app en segundo plano y presionamos sobre la notificacion
          console.log(
            'Push notification action performed',
            notification.actionId,
            notification.notification
          );
        }
      );
  
      //Ocurre cuando se realiza una accion sobre la notificacion local
      await LocalNotifications.addListener(
        'localNotificationActionPerformed',
        (notificationAction) => {
          console.log('action local notification', notificationAction);
        }
      );
    }
}