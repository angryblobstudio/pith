import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PithLogoComponent} from "./pith-logo.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule } from "@angular/common/http";
import {PithClientService} from "./core/pith-client.service";
import {PrescalePipe} from "./util/prescale.pipe";
import {ChannelBrowserComponent} from "./channelbrowser/channel-browser.component";
import {ChannelDetailsComponent} from "./channelbrowser/channel-details.component";
import {ChannelTvDetailsComponent} from "./channelbrowser/channel-tv-details.component";
import {GalleryComponent} from "./util/gallery.component";
import {PlayerService} from "./core/player.service";

@NgModule({
  declarations: [
    AppComponent,
    PithLogoComponent,
    ChannelBrowserComponent,
    ChannelDetailsComponent,
    ChannelTvDetailsComponent,
    PrescalePipe,
    GalleryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  providers: [
    PithClientService,
    PlayerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
