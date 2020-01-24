import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/Photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  // @Output() getMemberPhotoChange = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  baseUrl = environment.apiUrl;
  response: string;
  currentMain: Photo;

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private userService: UserService
  ) {}

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  ngOnInit() {
    this.initializeUploader();
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: `${this.baseUrl}users/${this.authService.decodedToken.nameid}/photos`,
      authToken: `Bearer ${localStorage.getItem('token')}`,
      isHTML5: true,
      allowedMimeType: ['image/jpeg', 'images', 'png', 'jpg'],
      maxFileSize: 10 * 1024 * 1024, // it will make the maximum file size of 10mbs
      autoUpload: false, // click a button in order to send this up
      removeAfterUpload: true // after the photo is being uploaded we want to remove it from the upload queue
    });

    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        this.photos.push(photo);
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.userService
      .setMainPhoto(this.authService.decodedToken.nameid, photo.id)
      .subscribe(
        () => {
          this.currentMain = this.photos.filter(p => p.isMain)[0];
          this.currentMain.isMain = false;
          photo.isMain = true;
          // this.getMemberPhotoChange.emit(photo.url);
          // sets the current photo url
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          // stores the current user to avoid information get lost when page refresh
          localStorage.setItem(
            'user',
            JSON.stringify(this.authService.currentUser)
          );
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  deletePhoto(id: number) {
    this.alertify.confirm('Are you sure you want to delete this photo?', () => {
      this.userService
        .deletePhoto(this.authService.decodedToken.nameid, id)
        .subscribe(
          () => {
            this.photos.splice(
              this.photos.findIndex(p => p.id === id),
              1
            );
            this.alertify.success('Photo has been deleted');
          },
          error => {
            this.alertify.error('Failed to delete the photo');
          }
        );
    });
  }
}
