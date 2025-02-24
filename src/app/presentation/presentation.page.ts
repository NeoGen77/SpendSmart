import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.page.html',
  styleUrls: ['./presentation.page.scss'],
  standalone: false
})
export class PresentationPage implements OnInit {
  photo: SafeResourceUrl | undefined; // Déclaration de la propriété pour stocker l'image

  constructor(private sanitizer: DomSanitizer) { }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    // Vérification que dataUrl n'est pas undefined
    if (image.dataUrl) {
      this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image.dataUrl);
    } else {
      console.error('Aucune image capturée');
    }
  }

  ngOnInit() {
  }
}