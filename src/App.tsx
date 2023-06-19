import { useEffect, useState } from "react";
import {
  GameDifficulty,
  gridSize,
  markerColors,
  secondaryColor,
  tileX,
  tileY,
} from "./store/definitions";
import Grid from "./components/Grid";
import About from "./components/About";
import Menu from "./components/Menu";

export default function App() {
  const [play, setPlay] = useState(false);
  const [player, setPlayer] = useState(0);
  const [difficulty, setDifficulty] = useState(GameDifficulty.NORMAL);
  const [scores, setScores] = useState<number[]>([]);

  const handlePlay = () => {
    if (!play) {
      setScores(markerColors[0].map(() => 0));
    }

    setPlay((oldPlay) => !oldPlay);
  };

  const handlePlayer = (newPlayer: number) => {
    setPlayer(newPlayer);
  };

  const handleDifficulty = (newDifficulty: GameDifficulty) => {
    setDifficulty(newDifficulty);
  };

  const handleScore = (color: string | undefined) => {
    setScores((scores) =>
      scores.map((score, index) => {
        if (markerColors[1][index] === color) {
          return score + 1;
        }

        return score;
      })
    );
  };

  useEffect(() => {
    const winner = scores.find((score) => score >= gridSize);
    if (winner !== undefined) {
      setPlay(false);
    }
  }, [scores]);

  return (
    <div className="App">
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
        }}
      >
        <h1 style={{ color: secondaryColor }}>Markers</h1>
        <div
          style={{
            position: "relative",
            width: gridSize * tileX + gridSize,
            height: gridSize * tileY + gridSize,
            backgroundColor: "#454545",
          }}
        >
          {play ? (
            <Grid
              player={player}
              difficulty={difficulty}
              scores={scores}
              onScore={handleScore}
            />
          ) : (
            <About scores={scores} />
          )}
        </div>
        <Menu
          play={play}
          player={player}
          difficulty={difficulty}
          onPlay={handlePlay}
          onPlayer={handlePlayer}
          onDifficulty={handleDifficulty}
        />
      </div>
    </div>
  );
}
