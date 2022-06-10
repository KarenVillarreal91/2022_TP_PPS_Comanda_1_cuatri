import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  usuarioActual: any = "";

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  Login(user: any) {
    this.usuarioActual = user;
    return this.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  Registro(user: any) {
    return this.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  //Storage

  reference(nombreArchivo: string) {
    return this.storage.ref(nombreArchivo);
  }

  //mesas

  agregarMesa(mesa: any) {
    return this.firestore.collection('mesas').add(mesa);
  }

  SubirDatos(datos: any, coleccion: string) {
    return this.firestore.collection(coleccion).add(datos);
  }

  async SubirEncuestaEmpleado(datos: any, foto: FormData) {
    let path = `fotosEncuestas/${Date.now()}`;

    await this.storage.upload(path, foto.get('foto'));

    this.storage.ref(path).getDownloadURL().subscribe((data) => {
      datos.foto = data;
      this.firestore.collection('encuestaEmpleados').add(datos);
    });
  }

  async SubirEmpleado(user: any, foto: any) {
    if (foto != 'assets/default.png') {
      let path = `${Date.now()}`;
      let referencia = this.storage.ref(`fotosEmpleados/${path}`);

      referencia.putString(foto, 'data_url', {
        contentType: 'image/jpeg'
      }).then(() => {
        let storage = this.storage.ref('fotosEmpleados').child(path);
        storage.getDownloadURL().toPromise()
          .then((url: any) => {
            user.foto = url;
            this.firestore.collection('empleados').add(user);
          });
      });
    }
    else {
      user.foto = 'https://firebasestorage.googleapis.com/v0/b/loqueseteantojeapp.appspot.com/o/fotosEmpleados%2Fdefault.png?alt=media&token=b6704ee2-175a-4943-971b-94fe6c8d990f';
      this.firestore.collection('empleados').add(user);
    }
  }

  async SubirCliente(user: any, foto: any) {
    if (foto != 'assets/default.png') {
      let path = `${Date.now()}`;
      let referencia = this.storage.ref(`fotosClientes/${path}`);

      referencia.putString(foto, 'data_url', {
        contentType: 'image/jpeg'
      }).then(() => {
        let storage = this.storage.ref('fotosClientes').child(path);
        storage.getDownloadURL().toPromise()
          .then((url: any) => {
            user.foto = url;
            this.firestore.collection('clientes').add(user)
              .then((dbUser) => {
                localStorage.setItem('idUsuario', JSON.stringify(dbUser.id));
              });
          });
      });
    }
    else {
      user.foto = 'https://firebasestorage.googleapis.com/v0/b/loqueseteantojeapp.appspot.com/o/fotosEmpleados%2Fdefault.png?alt=media&token=b6704ee2-175a-4943-971b-94fe6c8d990f';
      this.firestore.collection('clientes').add(user);
    }
  }

  async SubirSupervisorDuenio(user: any, foto: any) {
    if (foto != 'assets/default.png') {
      let path = `${Date.now()}`;
      let referencia = this.storage.ref(`fotosSupervisorDuenio/${path}`);

      referencia.putString(foto, 'data_url', {
        contentType: 'image/jpeg'
      }).then(() => {
        let storage = this.storage.ref('fotosSupervisorDuenio').child(path);
        storage.getDownloadURL().toPromise()
          .then((url: any) => {
            user.foto = url;
            this.firestore.collection('supervisorDuenio').add(user);
          });
      });
    }
    else {
      user.foto = 'https://firebasestorage.googleapis.com/v0/b/loqueseteantojeapp.appspot.com/o/fotosEmpleados%2Fdefault.png?alt=media&token=b6704ee2-175a-4943-971b-94fe6c8d990f';
      this.firestore.collection('supervisorDuenio').add(user);
    }
  }

  GetColeccion(coleccion: any) {
    return this.firestore.collection<any>(coleccion).valueChanges({ idField: "id" });
  }
  getUsers(coleccion: any) {
    return this.firestore.collection(coleccion).valueChanges({ idField: 'id' });
  }

  updateUser(id: any, data: any, coleccion: any) {
    return this.firestore.collection(coleccion).doc(id).update(data);
  }

  async SubirEncuestaClienteDesdeSupervisor(datos: any) {
    this.firestore.collection('encuestaClientesDesdeSupervisor').add(datos);
  }

  async SubirEncuestaEmpleadosDesdeSupervisor(datos: any) {
    this.firestore.collection('encuestaEmpleadosDesdeSupervisor').add(datos);
  }

  getUsuarioActual() {
    return this.firestore.collection("clientes", ref => ref.where('email', '==', this.usuarioActual.email)).snapshotChanges();
  }
  SubirUsuarioALaListaDeEspera(datos: any) {
    this.firestore.collection('listaDeEspera').add(datos);
  }
}
