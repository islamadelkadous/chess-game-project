import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChessBoardComponent} from "./chess-board/chess-board.component";
import {OnlineGameComponent} from "./online-game/online-game.component";
import {ChessGameComponent} from "./chess-game/chess-game.component";

const routes: Routes = [
  { path: '', redirectTo: 'mainpage', pathMatch: 'full' },
  { path: 'mainpage', component: ChessGameComponent },
  { path: 'iframepage', component: ChessBoardComponent },
  { path: 'playOnline', component: OnlineGameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
