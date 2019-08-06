import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { routeAnimation } from './app-routing-animation';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UpdateService } from './shared/services/update.service';

declare let ga;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    routeAnimation
  ]
})
export class AppComponent implements OnDestroy {

  private unsubscribe = new Subject();

  constructor(
    public router: Router,
    private updateService: UpdateService) {

    // subscribe to router events and send page views to google analytics
    this.router.events
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
