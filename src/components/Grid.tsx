import { useEffect, useState } from "react";
import Tile from "./Tile";
import Marker from "./Marker";
import {
  borderSize,
  gridSize,
  tileSize,
  tileX,
  tileY,
  gridOriginX,
  markerColors,
  TileStatus,
  GameDifficulty,
} from "../store/definitions";
import Score from "./Score";

interface TileMark {
  id: number;
  row: number;
  col: number;
  color: string;
}

interface GridProps {
  player: number;
  difficulty: GameDifficulty;
  scores: number[];
  onScore: (color: string | undefined) => void;
}

export default function Grid({
  player,
  difficulty,
  scores,
  onScore,
}: GridProps) {
  const markers = markerColors[1];

  const [wizardReady, setWizardReady] = useState<boolean[]>(
    markers.map(() => false)
  );
  const [wizardTiles, setWizardTiles] = useState<[number, number][]>(
    markers.map(() => [
      Math.floor(Math.random() * gridSize),
      Math.floor(Math.random() * gridSize),
    ])
  );
  const [markTiles, setMarkTiles] = useState<TileMark[]>([]);
  const [rowAlarm, setRowAlarm] = useState<number | undefined>(undefined);
  const [colAlarm, setColAlarm] = useState<number | undefined>(undefined);
  const [alarmCleaner, setAlarmCleaner] = useState<
    [number | undefined, number | undefined]
  >([undefined, undefined]);

  const [highlight, setHighlight] = useState<[number, number] | undefined>(
    undefined
  );
  const [axis, setAxis] = useState<boolean[]>(
    markers.map(() => Math.random() > 0.5)
  );

  const handleTileHover = (row: number, col: number) => {
    if (wizardReady[0]) {
      // Find the path to the hovered tile
      setHighlight([row, col]);
    }
  };

  const handleTileClick = (row: number, col: number) => {
    const [wRow, wCol] = wizardTiles[player];
    if (wRow !== row || wCol !== col) {
      // Select the clicked tile and find the path to the hovered tile
      setWizardTiles((tiles) =>
        tiles.map((tile, index) => {
          if (index === player) {
            return [row, col];
          }
          return tile;
        })
      );
      setWizardReady((wizards) =>
        wizards.map((isReady, index) => {
          return index === player ? false : isReady;
        })
      );
    } else if (wizardReady[player] && wRow === row && wCol === col) {
      // mark the positioned tile
      handleWizardDestination(player, row, col);
    }

    setHighlight(undefined);
  };

  const handleMarkColor = (row: number, col: number) => {
    return markTiles.find((tile) => tile.row === row && tile.col === col)
      ?.color;
  };

  const handleDestination = () => {
    setWizardReady((wizards) =>
      wizards.map((isReady, index) => {
        return index === player ? true : isReady;
      })
    );
  };

  const handleWizardDestination = (id: number, row: number, col: number) => {
    if (markTiles.some((tile) => tile.row === row && tile.col === col)) {
      setMarkTiles((marks) =>
        marks.map((mark) => {
          if (mark.row === row && mark.col === col) {
            return { ...mark, id, color: markers[id] };
          }
          return mark;
        })
      );
    } else {
      setMarkTiles((marks) => [...marks, { id, row, col, color: markers[id] }]);
    }

    setWizardReady((wizards) =>
      wizards.map((isReady, index) => {
        return index === id ? true : isReady;
      })
    );
  };

  const handleTileStatus = (row: number, col: number) => {
    if (rowAlarm === row || colAlarm === col) {
      return TileStatus.ALARM;
    }
    if (markTiles.some((tile) => tile.row === row && tile.col === col)) {
      return TileStatus.MARK;
    }

    const [wRow, wCol] = wizardTiles[player];
    if (wizardReady[player] && wRow === row && wCol === col) {
      return TileStatus.POSITION;
    }
    if (wRow === row && wCol === col) {
      return TileStatus.SELECT;
    }
    if (
      highlight !== undefined &&
      highlight[0] === row &&
      highlight[1] === col
    ) {
      return TileStatus.HOVER;
    }

    return TileStatus.NONE;
  };

  const handleDifficulty = (isDecimal: boolean) => {
    switch (difficulty) {
      case GameDifficulty.EASY:
        return isDecimal ? 0.75 : 1500;
      case GameDifficulty.NORMAL:
        return isDecimal ? 0.85 : 1000;
      case GameDifficulty.HARD:
        return isDecimal ? 0.95 : 500;
    }
  };

  const handleNextMove = (id: number, row: number, col: number) => {
    if (Math.random() < handleDifficulty(true)) {
      const currentTile = markTiles.find(
        (cTile) => cTile.row === row && cTile.col === col
      );
      if (currentTile !== undefined) {
        for (let tileIndex = 0; tileIndex < gridSize; ++tileIndex) {
          const nextTile = axis[id]
            ? [currentTile.row, tileIndex]
            : [tileIndex, currentTile.col];
          const validTile = markTiles.find(
            (nTile) => nTile.row === nextTile[0] && nTile.col === nextTile[1]
          );
          if (
            validTile === undefined ||
            (validTile !== undefined && validTile.color !== currentTile.color)
          ) {
            return nextTile as [number, number];
          }
        }
      }
    }

    return [
      Math.floor(Math.random() * gridSize),
      Math.floor(Math.random() * gridSize),
    ] as [number, number];
  };

  useEffect(() => {
    if (
      wizardReady.some((isReady, index) => (index === player ? false : isReady))
    ) {
      setTimeout(() => {
        setWizardTiles((tiles) =>
          tiles.map((tile, index) => {
            if (index === player || !wizardReady[index]) {
              return tile;
            }

            return handleNextMove(index, tile[0], tile[1]);
          })
        );
      }, Math.floor(Math.random() * handleDifficulty(false)));

      setWizardReady((wizards) =>
        wizards.map((isReady, index) => {
          return index === player ? isReady : false;
        })
      );
    }
  }, [wizardReady]);

  useEffect(() => {
    const rows: number[] = [];
    const columns: number[] = [];

    markTiles.forEach(({ row, col }) => {
      if (!rows.includes(row)) {
        rows.push(row);
      }
      if (!columns.includes(col)) {
        columns.push(col);
      }
    });

    setRowAlarm(
      rows.find((aRow) => {
        const rowTiles = markTiles.filter((tile) => tile.row === aRow);
        if (rowTiles.length >= gridSize) {
          const colors = Array.from(
            new Set(rowTiles.map((tile) => tile.color))
          );
          return colors.length === 1;
        }

        return false;
      })
    );

    setColAlarm(
      columns.find((aCol) => {
        const columnTiles = markTiles.filter((tile) => tile.col === aCol);
        if (columnTiles.length >= gridSize) {
          const colors = Array.from(
            new Set(columnTiles.map((tile) => tile.color))
          );
          return colors.length === 1;
        }

        return false;
      })
    );
  }, [markTiles]);

  useEffect(() => {
    const handleAlarmOff = () => {
      if (rowAlarm !== undefined) {
        onScore(markTiles.find((tile) => tile.row === rowAlarm)?.color);
        setRowAlarm(undefined);
      }
      if (colAlarm !== undefined) {
        onScore(markTiles.find((tile) => tile.col === colAlarm)?.color);
        setColAlarm(undefined);
      }
    };

    setAxis(axis.map(() => Math.random() > 0.5));

    if (rowAlarm !== undefined || colAlarm !== undefined) {
      setAlarmCleaner([rowAlarm, colAlarm]);

      const alarmTimeout = setTimeout(() => {
        handleAlarmOff();
      }, 2500);

      return () => clearTimeout(alarmTimeout);
    }
  }, [rowAlarm, colAlarm]);

  useEffect(() => {
    if (rowAlarm === undefined && alarmCleaner[0] !== undefined) {
      setMarkTiles((tiles) =>
        tiles.filter((tile) => tile.row !== alarmCleaner[0])
      );
      setAlarmCleaner((cleaner) => [undefined, cleaner[1]]);
    }
    if (colAlarm === undefined && alarmCleaner[1] !== undefined) {
      setMarkTiles((tiles) =>
        tiles.filter((tile) => tile.col !== alarmCleaner[1])
      );
      setAlarmCleaner((cleaner) => [cleaner[0], undefined]);
    }
  }, [rowAlarm, colAlarm, alarmCleaner]);

  return (
    <>
      {Array.from({ length: gridSize }, (_, row) => (
        <div
          key={row}
          style={{
            position: "absolute",
            top: (row * tileY) / 2,
            left: gridOriginX - (row * tileX) / 2,
          }}
        >
          {Array.from({ length: gridSize }, (_, col) => (
            <div
              key={col}
              style={{
                position: "relative",
                top: (col * tileY) / 2,
                left: (col * tileX) / 2,
              }}
            >
              <Tile
                key={`${row}-${col}`}
                size={tileSize}
                borderSize={borderSize}
                markColor={handleMarkColor(row, col)}
                status={handleTileStatus(row, col)}
                onHover={() => handleTileHover(row, col)}
                onClick={() => handleTileClick(row, col)}
              />
            </div>
          ))}
        </div>
      ))}
      {Array.from({ length: markers.length }, (_, index) => (
        <Marker
          key={index}
          id={index}
          color={markers[index]}
          selectedTile={wizardTiles[index]}
          onDestination={
            index === player ? handleDestination : handleWizardDestination
          }
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: gridSize,
          right: gridSize,
        }}
      >
        <Score scores={scores} />
      </div>
    </>
  );
}
