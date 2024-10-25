import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import { NgxChessBoardModule } from 'ngx-chess-board';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import {FormsModule} from "@angular/forms";
import {environment} from "./environments/environment";
import { AngularFireModule } from "@angular/fire/compat";
import { OnlineGameComponent } from './online-game/online-game.component';
import { ChessGameComponent } from './chess-game/chess-game.component'


@NgModule({
  declarations: [
    AppComponent,
    ChessBoardComponent,
    OnlineGameComponent,
    ChessGameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxChessBoardModule.forRoot(),
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
