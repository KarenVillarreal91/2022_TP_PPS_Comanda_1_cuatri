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
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private idUser;
  private usuarioId;
  constructor(private platform: Platform, private firestore: AngularFirestore, private http: HttpClient, private userService: UserService) {

  }

  async inicializar(): Promise<void> {
    this.addListeners();
    if (this.platform.is('capacitor')) {
      const result = await PushNotifications.requestPermissions();
      if (result.receive === 'granted') {
        await PushNotifications.register();
      }
    }
  }

  getUserForNotifications(): void {
    this.idUser = JSON.parse(this.userService.getuserIdLocal());
    this.inicializar();
  }

  sendPushNotification(req): Observable<any> {
    return this.http.post<Observable<any>>(environment.fcmUrl, req, {
      headers: {
        Authorization: `key=${environment.fcmServerKey}`,
        'Content-Type': 'application/json',
      }
    });
  }

  private async addListeners(): Promise<void> {
    //Ocurre cuando el registro de las push notifications finaliza sin errores
    await PushNotifications.addListener(
      'registration',
      async (token: Token) => {
        // alert(token.value);
        this.firestore.collection("usuarios", ref => ref.where('id', '==', this.idUser)).snapshotChanges().subscribe(async (user) => {
          this.usuarioId = user[0].payload.doc.id;
        });
        //no me gusta, se aceptan sugerencias
        setTimeout(() => {
          this.firestore.collection('usuarios').doc(`${this.usuarioId}`).update({ token: token.value });
        }, 3000);
        
      }
    );

    //Ocurre cuando el registro de las push notifications finaliza con errores
    await PushNotifications.addListener('registrationError', (err) => {
      alert('Registration error: ' + err.error);
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

   async EnviarNotificationAUnUsuario(id: string, titulo: string, body: string) {
    console.log(id);
    let token;
    let usuario = this.userService.getUsuarioActualByID(id)
    usuario.subscribe((resp:any) => {
      console.log(resp[0].payload.doc.data().id);
      console.log(resp[0].payload.doc.data().token);
      if(resp[0]!=undefined) token = resp[0].payload.doc.data().token;
    });
    //no me gusta, se aceptan sugerencias
    setTimeout(() => {
      this.sendPushNotification({
        to:token,
        notification: {
          title: titulo,
          body: body,
          image_url: 'assets/iconTransp2.png'
        }
      })
        .subscribe((data) => {
          //  alert(data);
          console.log(data);
        });
    }, 3000);

    
  }
  EnviarNotificationAVariosUsuarios(tipo: string, titulo: string, body: string) {
    let usuariosTokens: Array<any> = [];
    this.userService.GetColeccion('usuarios').subscribe((data) => {
      for (let item of data) {
        if (item.tipo == tipo) usuariosTokens.push(item.token);
      }
    });
    this.sendPushNotification({
      registration_ids: usuariosTokens,
      notification: {
        title: titulo,
        body: body
      }
    })
      .subscribe((data) => {
        //  alert(data);
        console.log(data);
      });
  }
}