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
    console.log("en get noti "+this.idUser);
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
        let subs = this.firestore.collection("usuarios", ref => ref.where('id', '==', this.idUser)).snapshotChanges().subscribe( (user) => {
          let usuarioForUpdate = this.firestore.collection('usuarios').doc(`${user[0].payload.doc.id}`);
          usuarioForUpdate.update({ token: token.value })
          .then(() => { })
          .catch((error) => { });
          subs.unsubscribe()
        })
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
    let usuario = this.userService.getUsuarioActualByID(id).subscribe((resp:any) => {
      console.log(resp[0].payload.doc.data().id);
      console.log(resp[0].payload.doc.data().token);
      if(resp[0]!=undefined) token = resp[0].payload.doc.data().token;
      console.log(token)
      let push = this.sendPushNotification({
        to:token,
        notification: {
          title: titulo,
          body: body
        }
      }).subscribe((data) => {//sin el subscribe la notificacion no llega
        console.log(data);
        push.unsubscribe();
      });
      usuario.unsubscribe();
    });
    
  }
  
  EnviarNotificationAVariosUsuarios(tipo: string, titulo: string, body: string) {
    let sub = this.firestore.collection("usuarios", ref => ref.where('tipo', '==', tipo)).snapshotChanges().subscribe(async (usuarios:any) => {
      usuarios.forEach(user => {
        console.log(user.payload.doc.data().tipo);
        let token = user.payload.doc.data().token;
        
      let push = this.sendPushNotification({
        to:token,
        notification: {
          title: titulo,
          body: body
        }
      }).subscribe((data) => {
        console.log(data);
        push.unsubscribe();
      });
      sub.unsubscribe();
      });
    });
  }
  // EnviarNotificationAVariosUsuarios(tipo: string, titulo: string, body: string) {
  //   let usuariosTokens: Array<any> = [];
  //   let sub = this.firestore.collection("usuarios", ref => ref.where('tipo', '==', tipo)).snapshotChanges().subscribe(async (user:any) => {
  //     usuariosTokens.push(user[0].payload.doc.data().token);
  //     let push =this.sendPushNotification({
  //       registration_ids: usuariosTokens,
  //       notification: {
  //         title: titulo,
  //         body: body
  //       }
  //     }).subscribe((data) => {//sin el subscribe la notificacion no llega
  //       console.log(data);
  //       push.unsubscribe();
  //     });
  //     sub.unsubscribe();
  //   });
  // }
}