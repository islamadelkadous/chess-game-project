import { Component, Input, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NgxChessBoardView, HistoryMove } from 'ngx-chess-board';
import { ActivatedRoute } from '@angular/router';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() onGameEnd!: () => void;
  @ViewChild('board', { static: false }) board!: NgxChessBoardView;

  isWhiteBoard: boolean = false;
  lightTileColor: string = '#eedc97';
  darkTileColor: string = '#964d22';

  private readonly localStorageKey = 'board';
  private readonly mainPageUrl: SafeResourceUrl = `${window.location.origin}/mainpage`;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.initializeBoardSide();
    window.addEventListener('message', this.handleMessageEvent);
  }

  ngAfterViewInit(): void {
    this.loadBoardState();
    this.maybeReverseBoard();
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.handleMessageEvent);
  }

  private initializeBoardSide(): void {
    this.route.queryParams.subscribe(params => {
      this.isWhiteBoard = params['isWhite'] ?? false;
    });
  }

  private loadBoardState(): void {
    const savedBoardState = localStorage.getItem(this.localStorageKey);
    if (savedBoardState) {
      this.board.setFEN(savedBoardState);
    }
  }

  private maybeReverseBoard(): void {
    if (!this.isWhiteBoard) {
      setTimeout(() => this.board.reverse());
    }
  }

  onMove(): void {
    const lastMove = this.board.getMoveHistory().slice(-1)[0];
    window.parent.postMessage(lastMove, this.mainPageUrl);
  }

  private handleMessageEvent = (event: MessageEvent): void => {
    if (event.data.reset) {
      this.resetBoard();
    } else {
      this.processMove(event.data as HistoryMove);
    }
  };

  private resetBoard(): void {
    this.board.reset();
    localStorage.removeItem(this.localStorageKey);
    this.maybeReverseBoard();
  }

  private processMove(moveData: HistoryMove): void {
    this.board.move(moveData.move);
    localStorage.setItem(this.localStorageKey, this.board.getFEN());
    if (moveData.mate) {
      this.onGameEnd();
    }
  }
}
