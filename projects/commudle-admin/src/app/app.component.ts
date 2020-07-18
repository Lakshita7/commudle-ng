import { Component, Inject } from '@angular/core';
import { ApiRoutesService } from 'projects/shared-services/api-routes.service';
import { environment } from '../environments/environment';
import { LibAuthwatchService } from 'projects/shared-services/lib-authwatch.service';
import { NbSidebarService } from '@nebular/theme';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { ICurrentUser } from 'projects/shared-models/current_user.model';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActionCableConnectionSocket } from 'projects/shared-services/action-cable-connection.socket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  faBars = faBars;
  currentUser: ICurrentUser;
  userContextMenu = [
    { title: 'Logout', link: '/logout' },
  ];
  cookieMessage: any;
  cookieDismiss: any;
  cookieLinkText: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private apiRoutes: ApiRoutesService,
    private authWatchService: LibAuthwatchService,
    private actionCableConnectionSocket: ActionCableConnectionSocket,
    private sidebarService: NbSidebarService,
    private titleService: Title,
    private router: Router
    ) {
      this.apiRoutes.setBaseUrl(environment.base_url);
      this.actionCableConnectionSocket.setBaseUrl(environment.action_cable_url);
      this.titleService.setTitle("Commudle | Communities | Let's Share & Learn");
      this.authWatchService.currentUser$.subscribe(currentUser => {
        this.currentUser = currentUser;
        this.actionCableConnectionSocket.connectToServer();
      });
  }


  toggleSidebar() {
    this.sidebarService.toggle(false, 'left');
  }

  login() {
    this.document.location.href = `https://auther.commudle.com/?back_to=${encodeURIComponent(window.location.href)}`;
  }

  redirectToHome() {
    this.router.navigate(['/']);
  }

  ngOnInit(){
     let cc = window as any;
     cc.cookieconsent.initialise({
      container: document.getElementById("cookieconsent"),
      palette:{
        popup: { background: "#3366ff" },
        button: { background: "#ffe000" },
      },
      revokable: true,
      onStatusChange: function(status) {
        console.log(this.hasConsented() ?
        'enable cookies' : 'disable cookies');
      },
      "theme": "classic"
    });
  }


}
