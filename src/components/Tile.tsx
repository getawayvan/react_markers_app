import { useEffect, useState } from "react";
import { TileStatus } from "../store/definitions";

interface TileProps {
  size: number;
  borderSize: number;
  markColor: string | undefined;
  status: TileStatus;
  onHover: () => void;
  onClick: () => void;
}

export default function Tile({
  size,
  borderSize,
  markColor,
  status,
  onHover,
  onClick,
}: TileProps) {
  const backColor = "#101010";
  const [tileColor, setTileColor] = useState(backColor);

  useEffect(() => {
    const handleFlash = (
      colorDefault: string,
      colorFlash: string,
      duration: number
    ) => {
      setTimeout(() => {
        setTileColor(colorDefault);
      }, 100);

      const timeoutId1 = setInterval(() => {
        setTileColor(colorFlash);
      }, 200);

      setTimeout(() => {
        const timeoutId2 = setInterval(() => {
          setTileColor(colorDefault);
        }, 200);

        setTimeout(() => {
          setTileColor(backColor);
          clearInterval(timeoutId1);
          clearInterval(timeoutId2);
        }, duration);
      }, 100);
    };

    const handleStatus = () => {
      switch (status) {
        case TileStatus.NONE:
          setTileColor(backColor);
          break;
        case TileStatus.HOVER:
          setTileColor("#252525");
          break;
        case TileStatus.MARK:
          setTileColor(markColor ?? backColor);
          break;
        case TileStatus.POSITION:
          setTileColor("#353535");
          break;
        case TileStatus.SELECT:
          handleFlash(backColor, "#505050", 600);
          break;
        case TileStatus.ALARM:
          if (markColor !== undefined) {
            handleFlash(markColor, "#E5E5E5", 2400);
          }
          break;
        default:
          console.log("unknown tile status");
          break;
      }
    };

    handleStatus();
  }, [status, markColor]);

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: tileColor,
        border: `${borderSize}px solid #A0A0A0`,
        position: "absolute",
        transform: "rotateX(45deg) rotateZ(-45deg)",
        transformOrigin: "50% 50%",
        transition: "border-width 0.2s",
      }}
      onMouseEnter={onHover}
      onClick={onClick}
    />
  );
}
