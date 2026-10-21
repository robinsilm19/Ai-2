import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  isListening: boolean;
  className?: string;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  analyser,
  isPlaying,
  isListening,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const barCount = 36;
    const dataArray = new Uint8Array(barCount);

    const render = () => {
      animFrameId.current = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const isActive = isPlaying || isListening;

      if (analyser && isActive) {
        // If we have live analyser data
        analyser.getByteFrequencyData(dataArray);
      } else if (isActive) {
        // Simulated organic waveform for active speech if direct node unavailable
        phase += 0.08;
        for (let i = 0; i < barCount; i++) {
          const val = Math.sin(phase + i * 0.3) * 0.5 + 0.5;
          const noise = Math.sin(phase * 1.7 + i * 0.6) * 0.3;
          dataArray[i] = Math.floor(Math.min(255, Math.max(20, (val + noise) * 220)));
        }
      } else {
        // Idle calm baseline
        phase += 0.02;
        for (let i = 0; i < barCount; i++) {
          dataArray[i] = Math.floor(18 + Math.sin(phase + i * 0.2) * 8);
        }
      }

      const totalBarWidth = width / barCount;
      const barWidth = Math.max(2, totalBarWidth - 3);

      for (let i = 0; i < barCount; i++) {
        const rawVal = dataArray[i] || 15;
        const normalized = rawVal / 255;
        const barHeight = Math.max(4, normalized * (height * 0.85));

        const x = i * totalBarWidth + (totalBarWidth - barWidth) / 2;
        const y = (height - barHeight) / 2;

        // Elegant gradient from deep espresso to warm cognac
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isPlaying) {
          gradient.addColorStop(0, '#8C5E35'); // cognac accent
          gradient.addColorStop(1, '#1C1917'); // espresso
        } else if (isListening) {
          gradient.addColorStop(0, '#B45309'); // listening amber
          gradient.addColorStop(1, '#78350F');
        } else {
          gradient.addColorStop(0, '#D6CFBE'); // subtle cream neutral
          gradient.addColorStop(1, '#BDB39E');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }
    };

    render();

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [analyser, isPlaying, isListening]);

  return (
    <div className={`relative w-full flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={360}
        height={56}
        className="w-full max-w-[360px] h-[56px] rounded-lg"
      />
    </div>
  );
};
