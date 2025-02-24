import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  constructor() { }

  // Méthode pour prendre une photo
  public async addNewToGallery(): Promise<string | undefined> {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    return capturedPhoto.webPath; // Retourne l'URI de l'image capturée
  }
  
}

