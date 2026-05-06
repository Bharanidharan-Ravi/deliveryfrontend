import { useState, useEffect } from 'react';
import { isBlurry, computeBlurScore } from '../../../utils/blurDetection';
import { config } from '../../../config/appConfig';

export function ImageValidator({ imageUrl, onResult }) {
  const [score, setScore] = useState(null);
  const [blurry, setBlurry] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.onload = () => {
      const s = computeBlurScore(img);
      const blur = s < config.blurThreshold;
      setScore(Math.round(s));
      setBlurry(blur);
      onResult?.({ score: s, isBlurry: blur });
    };
    img.src = imageUrl;
  }, [imageUrl, onResult]);

  if (score === null) return null;

  return (
    <div className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 ${blurry ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
      <span>{blurry ? '⚠️ Blurry' : '✅ Clear'}</span>
      <span className="opacity-60">|</span>
      <span>Clarity score: {score}</span>
    </div>
  );
}
