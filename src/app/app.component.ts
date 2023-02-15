import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'BikePartPicker';

  // Make it so that the mathome component can reload instead of the whole page
  // How to reload a page in Angular 8 the proper way https://stackoverflow.com/questions/59552387/how-to-reload-a-page-in-angular-8-the-proper-way
  mySubscription;
  constructor(private router: Router, private activatedRoute: ActivatedRoute){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
         // Trick the Router into believing it's last link wasn't previously loaded
         this.router.navigated = false;
      }
    }); 
 }

 ngOnDestroy(){
  if (this.mySubscription) {
    this.mySubscription.unsubscribe();
  }
}
}
