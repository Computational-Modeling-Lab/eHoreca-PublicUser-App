import { Injectable }             from '@angular/core';
import { Platform }               from 'ionic-angular';
import { Camera, CameraOptions }  from '@ionic-native/camera/ngx';
import { Storage }                from '@ionic/storage';
import { WebView }                from '@ionic-native/ionic-webview/ngx';

@Injectable()
export class PhotoProvider
{
  public base64Image: any;
  public images = [];
  public imagesUpload = [];

  constructor(public platform:  Platform,
              public storage:   Storage,
              public webview:   WebView,
              public plt:       Platform,
              public camera:    Camera) {}

  takePicture()
  {
    const options: CameraOptions =
    {
      destinationType:    this.camera.DestinationType.DATA_URL,
      encodingType:       this.camera.EncodingType.JPEG,
      mediaType:          this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) =>
    {
      //image from camera
      this.base64Image = "data:image/png;base64," + imageData;
      //webview image, checks for android or not, then saves the correct image to display
      if (this.plt.is('android'))
        this.images.push(this.base64Image)
      else
        this.images.push(this.webview.convertFileSrc(this.base64Image))

      // this.storage.set('uploadPhotos', imageData);
      this.imagesUpload.push(imageData);
    });
  }

  continue()
  {
    this.storage.set('photos', JSON.stringify(this.images));
    this.storage.set('uploadPhotos', JSON.stringify(this.imagesUpload))
  }

  async loadImage()
  {
    return await this.storage.get('photos').then(val => { return JSON.parse(val); });
  }

  async emptyImages()
  {
    await this.storage.remove('photos');
    await this.storage.remove('uploadPhotos');
  }
}
