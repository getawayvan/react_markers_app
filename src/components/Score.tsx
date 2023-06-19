import { markerColors, tileSize } from "../store/definitions";

export interface ScoreProps {
  scores: number[];
}

export default function Score({ scores }: ScoreProps) {
  const markers = markerColors[1];

  return (
    <div
      style={{
        width: tileSize,
        height: tileSize,
        borderRadius: 5,
        backgroundColor: "#959595",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {Array.from({ length: markers.length }, (_, index) => (
        <span key={index} style={{ color: `${markers[index]}` }}>
          player: {scores[index]}/5
        </span>
      ))}
    </div>
  );
}
