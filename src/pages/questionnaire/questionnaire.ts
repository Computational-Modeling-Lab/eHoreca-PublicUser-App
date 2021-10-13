import { Component }      from '@angular/core';
import { NavController }  from 'ionic-angular';
import { Storage }        from '@ionic/storage';

import { LandingPage }    from './../landing/landing';
import { LocationPage }   from './../location/location';

import { PhotoProvider }  from './../../providers/photo/photo';


@Component({
  selector: 'page-questionnaire',
  templateUrl: 'questionnaire.html',
})
export class QuestionnairePage
{
  issue: string = " ";
  comment: string = " ";
  error: boolean = false;

  constructor(public navCtrl: NavController,
              public storage: Storage,
              public photo: PhotoProvider) {}

  continue()
  {
    if (this.issue != " ")
    {
      this.storage.set("issue", this.issue);
      this.storage.set("comment", this.comment);
      this.navCtrl.push(LocationPage);
    }
    else
      this.error = true;
  }

  toLanding()
  {
    this.photo.emptyImages();
    this.navCtrl.setRoot(LandingPage);
  }

}
