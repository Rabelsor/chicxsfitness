import { Component } from '@angular/core';

/**
 * Generated class for the LoginPageComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'login-page',
  templateUrl: 'login-page.html'
})
export class LoginPageComponent {

  text: string;

  constructor() {
    this.text = 'Hello World';
  }

}
