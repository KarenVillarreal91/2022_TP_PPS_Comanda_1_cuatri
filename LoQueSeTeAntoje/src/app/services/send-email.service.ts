import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { init } from "@emailjs/browser";
init("-gUfqcMZW7U_NY7Xg");
@Injectable({
  providedIn: 'root'
})
export class SendEmailService {

  constructor() { }

  enviarEmail(userName:string, userEmail:string, message: string){
    let templateParams = {
      to_name: userName,
      message: message,
      mailUsuario: userEmail,
      from_name: "Lo que se te Antoje Resto"
    };

    emailjs.send("service_xudsi0l", "template_lxkz8zh", templateParams)
      .then(res =>{
        console.log("Email enviado.", res.status, res.text);
      })
      .catch(error =>{
        console.log("Error al enviar el email.", error);
      });
  }
}
