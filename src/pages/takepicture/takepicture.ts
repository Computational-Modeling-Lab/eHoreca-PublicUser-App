import { Component }          from '@angular/core';
import { NavController }      from 'ionic-angular';

import { LandingPage }        from './../landing/landing';
import { QuestionnairePage }  from './../questionnaire/questionnaire';

import { PhotoProvider }      from './../../providers/photo/photo';


@Component({
  selector: 'page-takepicture',
  templateUrl: 'takepicture.html',
})
export class TakepicturePage
{
  constructor(public navCtrl: NavController,
              public photo: PhotoProvider,) {}

  continue()
  {
    this.photo.continue();
    this.navCtrl.push(QuestionnairePage);
  }

  toLanding()
  {
    this.photo.emptyImages();
    this.navCtrl.setRoot(LandingPage);
  }

}
