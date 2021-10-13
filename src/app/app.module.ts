import { BrowserModule }                            from '@angular/platform-browser';
import { NgModule, ErrorHandler }                   from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp }                                    from './app.component';
import { Geolocation }                              from '@ionic-native/geolocation/ngx';
import { NativeGeocoder }                           from '@ionic-native/native-geocoder/ngx';
import { IonicStorageModule }                       from '@ionic/storage';

import { LoginPage }                                from '../pages/login/login';
import { RegisterPage }                             from '../pages/register/register';
import { LandingPage }                              from '../pages/landing/landing';
import { AboutPage }                                from '../pages/about/about';
import { MapPage }                                  from '../pages/map/map';
import { TakepicturePage }                          from '../pages/takepicture/takepicture';
import { QuestionnairePage }                        from '../pages/questionnaire/questionnaire';
import { LocationPage }                             from '../pages/location/location';

import { Camera }                                   from '@ionic-native/camera/ngx';
import { WebView }                                  from '@ionic-native/ionic-webview/ngx';
import { HTTP as HttpClient }                       from "@ionic-native/http/ngx";
import { StatusBar }                                from '@ionic-native/status-bar/ngx';
import { SplashScreen }                             from '@ionic-native/splash-screen/ngx';
import { File }                                     from '@ionic-native/file/ngx';
import { FilePath }                                 from '@ionic-native/file-path/ngx';
import { UniqueDeviceID }                           from '@ionic-native/unique-device-id/ngx';

import { PhotoProvider }                            from '../providers/photo/photo';
import { ConstantsProvider }                        from '../providers/constants/constants';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegisterPage,
    LandingPage,
    AboutPage,
    MapPage,
    TakepicturePage,
    QuestionnairePage,
    LocationPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegisterPage,
    LandingPage,
    AboutPage,
    MapPage,
    TakepicturePage,
    QuestionnairePage,
    LocationPage
  ],
  providers: [
    Camera,
    File,
    FilePath,
    WebView,
    HttpClient,
    StatusBar,
    SplashScreen,
    UniqueDeviceID,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    NativeGeocoder,
    PhotoProvider,
    ConstantsProvider,
  ]
})
export class AppModule {}
