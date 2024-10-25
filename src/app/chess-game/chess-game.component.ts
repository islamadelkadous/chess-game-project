import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { OnlineGamesDataService } from '../services/online-games-data.service';

@Component({
  selector: 'app-chess-game',
  templateUrl: './chess-game.component.html',
  styleUrls: ['./chess-game.component.css']
})
export class ChessGameComponent implements OnInit, AfterViewInit {
  title: string = 'Chess Game';
  finishedGameMessage: string = 'Game Ended';
  gameToJoin!: string;
  gameFinished: boolean = false;
  gameId!: string;

  iFrameWhiteBoardUrl: SafeResourceUrl = '';
  iFrameBlackBoardUrl: SafeResourceUrl = '';

  @ViewChild('white_board_iframe') whiteBoardIframe!: ElementRef<HTMLIFrameElement>;
  @ViewChild('black_board_iframe') blackBoardIframe!: ElementRef<HTMLIFrameElement>;

  private readonly baseIframeUrl = `${window.location.origin}/iframepage`;

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private gameService: OnlineGamesDataService
  ) {}

  ngOnInit(): void {
    this.iFrameWhiteBoardUrl = this.getIframePageUrl(true);
    this.iFrameBlackBoardUrl = this.getIframePageUrl(false);
  }

  ngAfterViewInit(): void {
    window.addEventListener('message', this.handleMessageEvent);
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.handleMessageEvent);
  }

  onGameEnd(): void {
    this.gameFinished = true;
  }

  reset(): void {
    this.gameFinished = false;
    const resetData = { reset: true };

    this.whiteBoardIframe.nativeElement.contentWindow?.postMessage(resetData, this.iFrameWhiteBoardUrl);
    this.blackBoardIframe.nativeElement.contentWindow?.postMessage(resetData, this.iFrameBlackBoardUrl);

    localStorage.clear();
  }

  hostGame(): void {
    const newGame = { id: '', moves: {}, isLightTurn: true, isGameFinished: false };
    this.gameService.createNewGame(newGame).then(() => {
      this.gameId = newGame.id;
      this.router.navigate(['/playOnline'], { queryParams: { game_id: this.gameId, is_user_white: true } });
    });
  }

  joinGame(): void {
    if (this.gameToJoin) {
      this.gameService.getGameById(this.gameToJoin).subscribe(game => {
        if (game) {
          this.router.navigate(['/playOnline'], { queryParams: { game_id: this.gameToJoin } });
        }
      });
    }
  }

  private getIframePageUrl(isWhite: boolean): SafeResourceUrl {
    const url = isWhite ? `${this.baseIframeUrl}/?isWhite=true` : this.baseIframeUrl;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private handleMessageEvent = (event: MessageEvent): void => {
    if (event.data.mate) {
      this.gameFinished = true;
      this.finishedGameMessage = event.data.color === 'white' ? 'White Wins' : 'Black Wins';
    }

    const targetIframe = event.data.color === 'white' ? this.blackBoardIframe : this.whiteBoardIframe;
    const targetWindow = targetIframe.nativeElement.contentWindow;

    if (targetWindow) {
      targetWindow.postMessage(event.data, this.getIframePageUrl(event.data.color === 'white'));
    }
  };
}
