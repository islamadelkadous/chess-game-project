export interface Games {
  id : string,
  moves: {
    FEN?: string;
  };
  isLightTurn: boolean,
  isGameFinished: boolean,
}
