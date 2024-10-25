import { Component, ElementRef, Input, ViewChild, OnInit } from '@angular/core';
import { Games } from '../model/games';
import { OnlineGamesDataService } from '../services/online-games-data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoryMove, NgxChessBoardView } from 'ngx-chess-board';

@Component({
  selector: 'app-online-game',
  templateUrl: './online-game.component.html',
  styleUrls: ['./online-game.component.css']
})
export class OnlineGameComponent implements OnInit {
  title: string = 'Chess Game';
  subTitle: string = 'Online Mode';
  finishedGameMessage: string = 'Game Ended';
  lightTileColor: string = '#eedc97';
  darkTileColor: string = '#964d22';
  gameId!: string;
  gameData!: Games;
  isWhiteTurn: boolean = true;
  isUserWhite: boolean = false;
  showAlert: boolean = false;
  gameFinished: boolean = false;

  @ViewChild('board', { static: false }) board!: NgxChessBoardView;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private gameService: OnlineGamesDataService
  ) {}

  ngOnInit(): void {
    this.initializeGame();
  }

  private initializeGame(): void {
    this.route.queryParams.subscribe(params => {
      this.gameId = params['game_id'];
      this.isUserWhite = params['is_user_white'] ?? false;
      this.loadGameData();
    });
  }

  private loadGameData(): void {
    this.gameService.getGameById(this.gameId).subscribe(game => {
      if (!game) {
        this.showAlert = true;
        return;
      }

      this.gameData = game;
      this.board.setFEN(this.gameData.moves['FEN'] || '');
      this.isWhiteTurn = this.gameData.isLightTurn;

      if (!this.isUserWhite) {
        this.board.reverse();
      }

      if (this.gameData.isGameFinished) {
        this.handleCheckMate();
      }
    });
  }

  private handleCheckMate(): void {
    this.finishedGameMessage = (this.isUserWhite === this.isWhiteTurn)
      ? 'Check Mate! You Lost.'
      : 'Check Mate! You Won.';
    this.gameFinished = true;
  }

  onMove(): void {
    const lastMove = this.board.getMoveHistory().slice(-1)[0];

    if (lastMove?.mate) {
      this.gameData.isGameFinished = true;
    }

    this.updateGameData();
  }

  private updateGameData(): void {
    this.gameData.moves['FEN'] = this.board.getFEN();
    this.gameData.isLightTurn = !this.isWhiteTurn;
    this.gameService.updateGame(this.gameData);
  }

  playAgain(): void {
    this.resetGame();
  }

  private resetGame(): void {
    this.gameData.moves = {};
    this.gameData.isGameFinished = false;
    this.board.reset();
    this.gameFinished = false;
    this.gameService.updateGame(this.gameData);
  }

  confirmRedirect(): void {
    this.router.navigate(['/']);
  }

  quitGame(): void {
    if (window.confirm("Are you sure you want to quit?")) {
      this.gameService.deleteGame(this.gameId);
      this.router.navigate(['/']);
    }
  }
}
