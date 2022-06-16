import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usuarioActual: any = {id: ''};
  clientes:Array<any> = [];
  empleados:Array<any> = [];
  supervisores:Array<any> = [];

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore, private storage: AngularFireStorage) 
  { 
    this.GetColeccion('clientes').subscribe((lista)=>{
      this.clientes = lista;
    });

    this.GetColeccion('empleados').subscribe((lista)=>{
      this.empleados = lista;
    });

    this.GetColeccion('supervisorDuenio').subscribe((lista)=>{
      this.supervisores = lista;
    });
  }

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

  async SubirDatos(datos: any, coleccion: string) {
    let ret:any = false;

    this.firestore.collection(coleccion).add(datos).then((res)=>{
      ret = res.id;
      this.EditarColeccion(res.id, {id: res.id}, coleccion);
    });

    return ret;
  }

  EditarColeccion(id:string, datos:any, tipo:string)
  {
    return this.firestore.collection(tipo).doc(id).update(datos);
  }

  async SubirEncuestaEmpleado(datos: any, foto: FormData) {
    let path = `fotosEncuestas/${Date.now()}`;
  
    await this.storage.upload(path, foto.get('foto'));
  
    let storageSub = this.storage.ref(path).getDownloadURL().subscribe((data) => {
      datos.foto = data;
      this.firestore.collection('encuestaEmpleados').add(datos);
      storageSub.unsubscribe();
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
            this.firestore.collection('empleados').add(user)
            .then((dbUser) => {
              let usuarioConTokenYTipo = {id:dbUser.id,tipo:user.tipo,token:''};
              this.SubirUsuario(usuarioConTokenYTipo);
            });
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
            this.SubirDatos(user, 'clientes')
            .then(()=>{
              let usuarioConTokenYTipo = {id: this.usuarioActual.id, tipo: user.tipo, token: ''};
              this.SubirUsuario(usuarioConTokenYTipo);
              if (user.habilitado="habilitado")//es anonimo se debe setear acá id, ademas se debe redireccionar ya que no necesita logueo
              {
                localStorage.setItem('idUsuario', JSON.stringify(this.usuarioActual.id));
                //this.router.navigateByUrl('qrIngreso');
              }
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
            this.firestore.collection('supervisorDuenio').add(user)
            .then((dbUser) => {
              let usuarioConTokenYTipo = {id:dbUser.id,tipo:user.tipo,token:''};
              this.SubirUsuario(usuarioConTokenYTipo);
            });
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
  getUsuarioActualByID(id:string) {
    return this.firestore.collection("usuarios", ref => ref.where('id', '==', id)).snapshotChanges();
  }

  getuserIdLocal(){
    return localStorage.getItem('idUsuario');
  }

  async SubirUsuario(user:any){
    this.firestore.collection('usuarios').add(user);
  }

  async setearIdUsuario(){
    let clientesSub = this.firestore.collection("clientes", ref => ref.where('email', '==', this.usuarioActual.email)).snapshotChanges().subscribe((us:any)=>{
     if(us[0]!=undefined) {
      localStorage.setItem('idUsuario', JSON.stringify(us[0].payload.doc.id));
      console.log("clientes "+JSON.stringify(us[0].payload.doc.id));
     }else{
      let empleadosSub =this.firestore.collection("empleados", ref => ref.where('email', '==', this.usuarioActual.email)).snapshotChanges().subscribe((us:any)=>{
        if(us[0]!=undefined) {
          localStorage.setItem('idUsuario', JSON.stringify(us[0].payload.doc.id));
          console.log("empleados "+JSON.stringify(us[0].payload.doc.id));
         }else{
          let supervisorDuenioSub =this.firestore.collection("supervisorDuenio", ref => ref.where('email', '==', this.usuarioActual.email)).snapshotChanges().subscribe((us:any)=>{
            if(us[0]!=undefined) {
              localStorage.setItem('idUsuario', JSON.stringify(us[0].payload.doc.id));
              console.log("supervisor "+JSON.stringify(us[0].payload.doc.id));
             }
             supervisorDuenioSub.unsubscribe()
           });
         }
         empleadosSub.unsubscribe()
       });
     }
     clientesSub.unsubscribe()
    });
     
  } 
  
  Desloguear(){
    let id = JSON.parse(this.getuserIdLocal());
    console.log(localStorage.getItem('idUsuario'));
    localStorage.removeItem('idUsuario');
    console.log(localStorage.getItem('idUsuario'));
    let subUsuarios= this.firestore.collection("usuarios", ref => ref.where('id', '==', id)).snapshotChanges().subscribe(async (user) => {
      let usuarioForUpdate = this.firestore.collection('usuarios').doc(`${user[0].payload.doc.id}`);
      usuarioForUpdate.update({ token: '' })
      .then(() => { })
      .catch((error) => { });
      subUsuarios.unsubscribe()
    })
   
  }

  EsCliente()
  {
    let encontro = false;

    for(let user of this.clientes)
    {
      if(user.id == this.usuarioActual.id)
      {
        encontro = user;
        break;
      }
    }

    return encontro;
  }

  EsEmpleado()
  {
    let encontro = false;

    for(let user of this.empleados)
    {
      if(user.email == this.usuarioActual.email)
      {
        encontro = user;
        break;
      }
    }

    return encontro;
  }

  EsSurpervisor()
  {
    let encontro = false;

    for(let user of this.supervisores)
    {
      if(user.email == this.usuarioActual.email)
      {
        encontro = user;
        break;
      }
    }

    return encontro
  }
}