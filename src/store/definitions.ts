export const borderSize = 2;
export const gridSize = 5;
export const tileSize = 90;
export const tileX = Math.sqrt(tileSize ** 2 + tileSize ** 2);
export const tileY = tileX * Math.sin(Math.PI / 4);
export const gridOriginX =
  ((gridSize - 1) * tileX) / 2 +
  tileX / 2 -
  (tileX / 2) * Math.sin(Math.PI / 4);

export const secondaryColor = "#959515";
export const markerColors = [
  ["Yellow", "Blue", "Green", "Red"],
  ["#656505", "#151565", "#156515", "#651515"],
];

export enum GameDifficulty {
  EASY = "Easy",
  NORMAL = "Normal",
  HARD = "Hard",
}

export enum TileStatus {
  NONE,
  HOVER,
  SELECT,
  POSITION,
  MARK,
  ALARM,
}
