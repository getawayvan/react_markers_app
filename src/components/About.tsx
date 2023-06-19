import { secondaryColor } from "../store/definitions";
import Score, { ScoreProps } from "./Score";

export default function About({ scores }: ScoreProps) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <p style={{ marginTop: 25 }}>Created with React using TypeScript</p>
      <span>
        by <em>Augustino Simic</em>
      </span>
      {scores.length > 0 && (
        <>
          <h2 style={{ marginTop: 50, color: secondaryColor }}>Game Over</h2>
          <div
            style={{
              position: "relative",
            }}
          >
            <Score scores={scores} />
          </div>
        </>
      )}
      <div style={{ flexGrow: 1 }} />
      <span>How to play:</span>
      <span style={{ color: secondaryColor }}>
        To win the game, highlight all tiles
      </span>
      <span style={{ color: secondaryColor }}>
        in any available row or column
      </span>
      <p style={{ marginBottom: 25 }}>
        inspiration taken from the{" "}
        <em style={{ color: secondaryColor }}>Silicon Warrior</em> by Epyx, Inc.
        1983
      </p>
    </div>
  );
}
