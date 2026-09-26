import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

/**
 * AssetLoader3D:
 * Minimalist premium loading pill tracking 3D asset download progress
 * Example: [ 3D ASSET — 72% ]
 */
export function AssetLoader3D() {
  const { active, progress } = useProgress();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active && progress >= 100) {
      const timer = setTimeout(() => setVisible(false), 450);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [active, progress]);

  if (!visible) return null;

  return (
    <div className="asset-loader-badge" aria-label="3D Asset Loading Progress">
      <div className="asset-loader-dot" />
      <span className="asset-loader-text">
        [ 3D ASSET — {Math.min(100, Math.round(progress))}% ]
      </span>
    </div>
  );
}
