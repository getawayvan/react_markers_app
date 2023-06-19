import { useState, useEffect, useRef } from "react";
import { tileX, tileY, gridOriginX } from "../store/definitions";

interface MarkerProps {
  id: number;
  color: string;
  selectedTile: [number, number];
  onDestination: (id: number, row: number, col: number) => void;
}

export default function Marker({
  id,
  color,
  selectedTile,
  onDestination,
}: MarkerProps) {
  const isMountRef = useRef(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleRef = () => {
    isMountRef.current = true;
  };

  useEffect(() => {
    if (isMountRef.current) {
      const [row, col] = selectedTile;
      const centerX = gridOriginX + (tileX / 2) * Math.sin(Math.PI / 4) - 10;
      const targetX = centerX - (row * tileX) / 2 + (col * tileX) / 2;
      const targetY = ((row + col) * tileY) / 2 + tileY / 2 - 10;

      const distanceX = targetX - position.x;
      const distanceY = targetY - position.y;

      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      const duration = distance / 100; // 100px per second

      const startTime = performance.now();

      const animationFrame = () => {
        const elapsed = (performance.now() - startTime) / 1000; // Convert to seconds

        if (elapsed >= duration) {
          setPosition({ x: targetX, y: targetY });
          onDestination(id, row, col);
        } else {
          const progress = elapsed / duration;
          const easeProgress = 0.5 - 0.5 * Math.cos(Math.PI * progress);

          setPosition({
            x: position.x + distanceX * easeProgress,
            y: position.y + distanceY * easeProgress,
          });

          requestAnimationFrame(animationFrame);
        }
      };

      requestAnimationFrame(animationFrame);
    }

    return handleRef();
  }, [selectedTile]);

  return (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: 11,
        backgroundColor: color,
        border: "2px solid grey",
        position: "absolute",
        top: position.y,
        left: position.x,
      }}
    />
  );
}
