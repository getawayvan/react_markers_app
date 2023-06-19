import { GameDifficulty, markerColors } from "../store/definitions";

interface MenuProps {
  play: boolean;
  player: number;
  difficulty: GameDifficulty;
  onPlay: () => void;
  onPlayer: (index: number) => void;
  onDifficulty: (value: GameDifficulty) => void;
}

export default function Menu({
  play,
  player,
  difficulty,
  onPlay,
  onPlayer,
  onDifficulty,
}: MenuProps) {
  return (
    <div
      style={{
        marginTop: 5,
        display: "flex",
      }}
    >
      <div hidden={play}>
        player
        <select
          tabIndex={player}
          onChange={(e) => onPlayer(e.target.selectedIndex)}
          style={{ marginLeft: 5 }}
        >
          {markerColors[0].map((colorName, index) => (
            <option key={index}>{colorName}</option>
          ))}
        </select>
      </div>
      <div hidden={play} style={{ marginLeft: 15 }}>
        difficulty
        <select
          value={difficulty}
          onChange={(e) => onDifficulty(e.target.value as GameDifficulty)}
          style={{ marginLeft: 5 }}
        >
          {Object.values(GameDifficulty).map((diff) => (
            <option key={diff} value={diff}>
              {diff}
            </option>
          ))}
        </select>
      </div>
      <div style={{ flexGrow: 1 }} />
      <button onClick={onPlay}>{play ? <>quit</> : <>play</>}</button>
    </div>
  );
}
