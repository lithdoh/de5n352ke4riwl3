import { Component } from '@angular/core';

@Component({
  selector: 'app-status',
  template: `
    <h4>
      404 Error: Requested page not found.
    </h4>
  `,
  styles: [
    `h4 {
          padding-top: 150px;
          padding-left: 25%;
          font-size: 40px;
          }`
  ]
})
export class StatusComponent {

}
