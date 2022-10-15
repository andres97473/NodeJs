import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit {
  private _value: number = 0;
  message: any;
  file?: File;

  get value(): number {
    return this._value;
  }

  set value(value: number) {
    if (!isNaN(value) && value <= 100) {
      this._value = value;
    }
  }

  constructor(private appService: AppService) {}

  ngOnInit(): void {}

  onDownload(): void {
    let filename: any = null;
    this.appService.download().subscribe((event: any) => {
      console.log('res: ', event);
      if (event['headers']) {
        const [_, contentDisposition] = event['headers']
          .get('Content-Disposition')
          .split('filename=');
        filename = contentDisposition.replace(/"/g, '');
      }

      if (event['loaded'] && event['total']) {
        this.value = Math.round((event['loaded'] / event['total']) * 100);
      }

      if (event['body']) {
        saveAs(event['body'], filename);
      }
    });
  }

  upload(file: any): void {
    this.file = file.target.files[0];
  }

  onUpload(): void {
    if (this.file) {
      this.appService
        .upload(this.file)
        .pipe()
        .subscribe((event: any) => {
          this.message = null;

          if (event['loaded'] && event['total']) {
            this.value = Math.round((event['loaded'] / event['total']) * 100);
          }

          if (event['body']) {
            this.message = event['body'].message;
          }
        });
    }
  }
}
