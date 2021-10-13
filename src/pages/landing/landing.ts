import { Component }                      from '@angular/core';
import { NavController, NavParams, App }  from 'ionic-angular';

import { TakepicturePage }                from './../takepicture/takepicture'
import { MapPage }                        from './../map/map'
import { AboutPage }                      from './../about/about';

@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})

export class LandingPage
{
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public app: App,) {}

  goToPage(x)
  {
    if (x == 1)
      this.navCtrl.push(TakepicturePage);
    else if (x == 2)
      this.navCtrl.push(MapPage);
    else if (x == 3)
      this.navCtrl.push(AboutPage);
    else
      console.log("Not an available page number.")
  }

}
