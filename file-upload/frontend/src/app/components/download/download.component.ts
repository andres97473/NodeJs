import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css'],
})
export class DownloadComponent implements OnInit {
  private _value: number = 0;

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
}
