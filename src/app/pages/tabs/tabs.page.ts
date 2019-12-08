import { Component, ViewChild, OnInit } from '@angular/core';
import { IonTabs, Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: [ 'tabs.page.scss' ]
})
export class TabsPage implements OnInit {
  @ViewChild('tabs', { static: true }) tabs: IonTabs;

  constructor(private platform: Platform) {
  }

  ngOnInit() {
    let tabsCanGoBack = false;
    let tabsParentCanGoBack = false;
    this.platform.backButton.subscribe(() => {
      tabsCanGoBack = this.tabs.outlet.canGoBack();
      tabsParentCanGoBack = this.tabs.outlet.parentOutlet.canGoBack();
      console.log(this.tabs.outlet, this.tabs.outlet.parentOutlet, tabsCanGoBack, tabsParentCanGoBack);
    });

  }
}
