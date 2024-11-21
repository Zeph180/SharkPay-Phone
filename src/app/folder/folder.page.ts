import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import NexgoSDK from '../../../plugins/nexgosdk/src';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})

export class FolderPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor() {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;

    NexgoSDK.beep({ duration: 500 })
      .then(response => console.log('Beep success:', response))
      .catch(error => console.error('Beep failed:', error));
  }
}
