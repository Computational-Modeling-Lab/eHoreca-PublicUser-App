import { Component }                                from '@angular/core';
import { AlertController, Platform, NavController}  from 'ionic-angular';
import { HTTP as HttpClient }                       from "@ionic-native/http/ngx";
import { Storage }                                  from '@ionic/storage';
import { Geolocation }                              from '@ionic-native/geolocation/ngx';
import { File }                                     from '@ionic-native/file/ngx';
import { LoadingController, Loading }               from "ionic-angular";

import { PhotoProvider }                            from './../../providers/photo/photo';
import { ConstantsProvider }                        from './../../providers/constants/constants';

import { LandingPage }                              from './../landing/landing';


@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage
{
  interval: any;
  url: string;
  token: string;

  latitude:     number;
  longitude:    number;
  accuracy:     number;

  bin_id:       number;
  user_id:      number;
  issue:        string;
  comment:      string;
  myPhotos:     any;
  uploadPhotos: any;

  constructor(public geolocation: Geolocation,
              public alert:       AlertController,
              public navCtrl:     NavController,
              public platform:    Platform,
              public http:        HttpClient,
              public file:        File,
              public photo:       PhotoProvider,
              public storage:     Storage,
              public loadingctrl: LoadingController,
              public constants:   ConstantsProvider,
  )
  {
    this.url = this.constants.getUrl();

    //Get all stored inputs
    this.storage.get("user_id").then(val =>
    {
      this.user_id = val;
    });

    this.storage.get("issue").then(val =>
    {
      this.issue = val;
    });

    this.storage.get("comment").then(val =>
    {
      this.comment = val;
    });

    this.storage.get("photos").then(val =>
    {
      if (val)
      {
        val = JSON.parse(val)
        this.myPhotos = val;
      }
    });

    this.storage.get("uploadPhotos").then(val =>
    {
      if (val)
        this.uploadPhotos = val;
    });

    this.storage.get('token').then(token =>
    {
      this.token = token;
    });
  }

  getLocation()
  {
    this.platform.ready().then(()=>
    {
      //Options
      var options =
      {
        enableHighAccuracy: false,
        timeout: 60000,
        maximumAge: 0
      };
      //Use the geolocation
      this.geolocation.getCurrentPosition(options).then(async data=>
      {
        const loading = this.loadingctrl.create({content: "Getting closest bin...<br>Please wait..."});
        await loading.present();

        this.longitude = data.coords.longitude;
        this.latitude  = data.coords.latitude;
        this.accuracy  = data.coords.accuracy;

        //Get closest bin
        this.http.post(
          `${this.url}/bins/closest`,
          {
            lat: this.latitude,
            lng: this.longitude,
            isDriver: false
          },
          {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Content-Type': 'application/json'
          }
        ).then((data: any) =>
          {
            loading.dismiss();

            this.bin_id = data.id;
            console.log(this.bin_id);
          }
        ).catch(
        err =>
          {
            console.error(err);
            this.failure(loading);
          }
        );
      }).catch((err)=>
      {
        console.log("Error", err);
      });
    });
  }

  ionViewDidLoad()
  {
    //console.log("Photo: " + this.myPhoto);
    this.getLocation();
    this.interval = setInterval(() => { this.getLocation(); }, 10000);
  }

  async postReport()
  {
    const loading = this.loadingctrl.create({content: "Uploading report...<br>Please wait..."});
    await loading.present();

    //POST request for Report
    this.http.post(
      `${this.url}/reports`,
      {
        bin_id: this.bin_id,
        user_id: this.user_id,
        lat: this.latitude,
        lng: this.longitude,
        location_accuracy: this.accuracy,
        issue: this.issue,
        comment: this.comment,
        images: this.myPhotos || null,
      },
      {
        Authorization: `Bearer ${this.token}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Content-Type': 'application/json'
      }
    ).then(res =>
      {
        this.success(loading);
      }
    ).catch(err =>
      {
        console.error(err);
        this.failure(loading)
      }
    );
  }

  toLanding()
  {
    this.photo.emptyImages();
    clearInterval(this.interval);
    this.navCtrl.setRoot(LandingPage);
  }

  async success(loading: Loading)
  {
    loading.dismiss();

    const myAlert = await this.alert.create(
    {
      title:    "Thank you!",
      message:  'Thank you for your report.',
      buttons:  [{text: 'Continue', role: 'continue', handler: () => { this.toLanding(); }}]
    });

    await myAlert.present();
  }

  async failure(loading: Loading)
  {
    loading.dismiss();

    const myAlert = await this.alert.create(
    {
      title:    "Error",
      message:  'Something went wrong. Please try again later.',
      buttons:  ["Return"]
    });

    await myAlert.present();
  }
}
