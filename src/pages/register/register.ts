import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { HTTP as HttpClient } from "@ionic-native/http/ngx";
import { Storage } from "@ionic/storage";
import { UniqueDeviceID } from "@ionic-native/unique-device-id/ngx";
import { Md5 } from "ts-md5/dist/md5";
import { LoadingController } from "ionic-angular";

import { LandingPage } from "./../landing/landing";
import { LoginPage } from "./../login/login";

import { ConstantsProvider } from "./../../providers/constants/constants";

@Component({
  selector: "page-register",
  templateUrl: "register.html",
})
export class RegisterPage {
  url: string;

  isDuplicate: boolean = false;
  isMissing: boolean = false;
  error: boolean = false;

  name: any;
  surname: any;
  userName: any;
  email: any;
  password: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public storage: Storage,
    public UDID: UniqueDeviceID,
    public loadingctrl: LoadingController,
    public constants: ConstantsProvider
  ) {
    this.url = this.constants.getUrl();
  }

  async register() {
    if (!this.name || !this.surname || !this.email || !this.password) {
      this.isMissing = true;
      return;
    }

    if (!this.userName) {
      if (this.UDID.get())
        this.UDID.get().then((udid: any) => {
          this.userName = Md5.hashStr(udid.toString());
        });
      else this.userName = `${this.name} ${this.surname}`;
    }

    const loading = this.loadingctrl.create({
      content: "Registering...<br>Please wait...",
    });
    await loading.present();

    this.http.post(
      `${this.url}/users`,
      {
        name: this.name,
        surname: this.surname,
        email: this.email,
        password: this.password,
        username: this.userName,
      },
      {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Content-Type': 'application/json'
      }
    ).then(
      (data) => {
        this.login(loading);
      }
    ).catch(
      err => {
        loading.dismiss();
        this.isDuplicate = true;
        console.error(JSON.stringify(err));
      }
    );
  }

  login(loading) {
    this.http.post(
      `${this.url}/login`,
      {
        email: this.email,
        password: this.password,
      },
      {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Content-Type': 'application/json'
      }
    )
    .then(
      (data: any) => {
        loading.dismiss();
        this.storage.set("token", data.token);
        this.storage.set("user_id", data.id);
        this.storage.set("email", this.email);
        this.storage.set("password", this.password);
        this.navCtrl.setRoot(LandingPage);
      }
    ).catch(err =>
      {
        loading.dismiss();
        this.error = true;
        console.error(JSON.stringify(err));
      }
    );
  }

  back() {
    this.navCtrl.setRoot(LoginPage);
  }
}
