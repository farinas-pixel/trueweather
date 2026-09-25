/**
 * TRUEWEATHER 3D Atmospheric Visualization Engine
 * High-performance 3D perspective projection particle & atmospheric simulation.
 * Driven strictly by real meteorological data (WMO condition, wind speed/direction,
 * day/night, cloud cover, precipitation intensity).
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ConditionCategory, VisualAtmosphereState } from '../types/weather';

interface AtmosphereCanvasProps {
  weatherState: VisualAtmosphereState;
  performanceMode?: 'auto' | 'high' | 'low';
  effectsEnabled?: boolean;
  animationEnabled?: boolean;
}

interface CloudParticle3D {
  x: number; // 3D world coords
  y: number;
  z: number;
  radius: number;
  alpha: number;
  speed: number;
}

interface RainParticle3D {
  x: number;
  y: number;
  z: number;
  length: number;
  speed: number;
}

interface SnowParticle3D {
  x: number;
  y: number;
  z: number;
  radius: number;
  speed: number;
  wobble: number;
}

interface Star3D {
  x: number;
  y: number;
  z: number;
  size: number;
  twinklePhase: number;
}

export const AtmosphereCanvas: React.FC<AtmosphereCanvasProps> = ({
  weatherState,
  performanceMode = 'auto',
  effectsEnabled = true,
  animationEnabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasContextError, setHasContextError] = useState(false);

  // Check prefers-reduced-motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const shouldAnimate = animationEnabled && !prefersReducedMotion;

  // Sky Gradients Palette mapped to meteorological state
  const skyTheme = useMemo(() => {
    const { category, isDay, stormActive, cloudDensity } = weatherState;

    if (stormActive || category === 'thunderstorm') {
      return {
        top: '#0a0d14',
        mid: '#141a24',
        bottom: '#1c2430',
        haze: 'rgba(15, 23, 42, 0.85)',
      };
    }

    if (!isDay) {
      if (cloudDensity > 0.7) {
        return {
          top: '#060911',
          mid: '#0d131f',
          bottom: '#151d2e',
          haze: 'rgba(13, 19, 31, 0.7)',
        };
      }
      return {
        top: '#030712',
        mid: '#0b1329',
        bottom: '#111e3b',
        haze: 'rgba(11, 19, 41, 0.4)',
      };
    }

    // Daytime
    if (cloudDensity >= 0.8 || category === 'overcast') {
      return {
        top: '#334155',
        mid: '#475569',
        bottom: '#64748b',
        haze: 'rgba(100, 116, 139, 0.5)',
      };
    }

    if (category === 'rain' || category === 'drizzle') {
      return {
        top: '#1e293b',
        mid: '#334155',
        bottom: '#475569',
        haze: 'rgba(71, 85, 105, 0.6)',
      };
    }

    if (category === 'fog') {
      return {
        top: '#475569',
        mid: '#64748b',
        bottom: '#94a3b8',
        haze: 'rgba(148, 163, 184, 0.75)',
      };
    }

    // Clear / Partly Cloudy Day
    return {
      top: '#0369a1',
      mid: '#0284c7',
      bottom: '#38bdf8',
      haze: 'rgba(56, 189, 248, 0.25)',
    };
  }, [weatherState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !effectsEnabled) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      setHasContextError(true);
      return;
    }

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 480);

    // Performance budget scaling
    const isLowMode = performanceMode === 'low' || (performanceMode === 'auto' && width < 640);
    const dpr = Math.min(window.devicePixelRatio || 1, isLowMode ? 1.0 : 1.5);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.parentElement.clientHeight || 480;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    // --- 3D Scene Entities Setup ---
    const FOV = 400; // 3D Camera focal length

    // 1. Stars (Night only)
    const starCount = weatherState.isDay ? 0 : isLowMode ? 50 : 140;
    const stars: Star3D[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: Math.random() * (height * 0.7) - height * 0.35,
        z: Math.random() * 500 + 200,
        size: Math.random() * 1.5 + 0.5,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    // 2. 3D Clouds (Based on cloudDensity)
    const cloudClusterCount = Math.round(
      (isLowMode ? 4 : 10) * Math.max(0.2, weatherState.cloudDensity)
    );
    const clouds: CloudParticle3D[] = [];
    for (let i = 0; i < cloudClusterCount; i++) {
      clouds.push({
        x: (Math.random() - 0.5) * (width * 1.8),
        y: (Math.random() - 0.5) * (height * 0.6) - height * 0.1,
        z: Math.random() * 400 + 150,
        radius: (Math.random() * 80 + 70) * (isLowMode ? 0.9 : 1.2),
        alpha: (Math.random() * 0.25 + 0.2) * (weatherState.cloudDensity > 0.5 ? 1.3 : 0.8),
        speed: (Math.random() * 0.3 + 0.15) * Math.max(0.5, weatherState.windSpeedKmh / 20),
      });
    }

    // 3. 3D Rain Particles
    const rainCount = Math.round(
      (isLowMode ? 40 : 120) * Math.max(0, weatherState.rainIntensity)
    );
    const raindrops: RainParticle3D[] = [];
    for (let i = 0; i < rainCount; i++) {
      raindrops.push({
        x: (Math.random() - 0.5) * (width * 1.5),
        y: Math.random() * height - height * 0.5,
        z: Math.random() * 400 + 100,
        length: Math.random() * 16 + 12,
        speed: (Math.random() * 8 + 14) * (1 + weatherState.rainIntensity * 0.5),
      });
    }

    // 4. 3D Snow Particles
    const snowCount = Math.round(
      (isLowMode ? 30 : 90) * Math.max(0, weatherState.snowIntensity)
    );
    const snowflakes: SnowParticle3D[] = [];
    for (let i = 0; i < snowCount; i++) {
      snowflakes.push({
        x: (Math.random() - 0.5) * (width * 1.5),
        y: Math.random() * height - height * 0.5,
        z: Math.random() * 400 + 100,
        radius: Math.random() * 2.5 + 1.2,
        speed: Math.random() * 1.8 + 1.0,
        wobble: Math.random() * Math.PI * 2,
      });
    }

    // Wind direction vector angle in radians
    const windRad = ((weatherState.windDirectionDeg - 90) * Math.PI) / 180;
    const windSpeedFactor = Math.min(2.5, Math.max(0.2, weatherState.windSpeedKmh / 15));
    const windVelocityX = Math.cos(windRad) * windSpeedFactor * 1.8;

    // Lightning Flash State (Thunderstorm only, gentle & accessible)
    let lightningIntensity = 0;
    let nextLightningTime = performance.now() + Math.random() * 6000 + 4000;

    let lastFrameTime = performance.now();

    // --- Render Loop ---
    const render = (time: number) => {
      const delta = Math.min(40, time - lastFrameTime);
      lastFrameTime = time;

      // Handle subtle thunderstorm lightning pulse
      if (weatherState.stormActive && shouldAnimate) {
        if (time > nextLightningTime && lightningIntensity <= 0) {
          lightningIntensity = 0.35; // gentle, non-strobe flash
          nextLightningTime = time + Math.random() * 8000 + 5000;
        }
        if (lightningIntensity > 0) {
          lightningIntensity -= delta * 0.003;
          if (lightningIntensity < 0) lightningIntensity = 0;
        }
      }

      // 1. Draw Atmospheric Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, skyTheme.top);
      skyGrad.addColorStop(0.55, skyTheme.mid);
      skyGrad.addColorStop(1, skyTheme.bottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Lightning illumination layer
      if (lightningIntensity > 0) {
        ctx.fillStyle = `rgba(224, 242, 254, ${lightningIntensity.toFixed(3)})`;
        ctx.fillRect(0, 0, width, height);
      }

      const centerX = width / 2;
      const centerY = height / 2;

      // 2. Stars rendering (Night)
      if (!weatherState.isDay && stars.length > 0) {
        ctx.save();
        stars.forEach((star) => {
          if (shouldAnimate) {
            star.twinklePhase += delta * 0.002;
          }
          const scale = FOV / star.z;
          const sx = centerX + star.x * scale;
          const sy = centerY + star.y * scale;
          if (sx >= 0 && sx <= width && sy >= 0 && sy <= height * 0.75) {
            const alpha = 0.3 + 0.5 * Math.sin(star.twinklePhase);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, alpha).toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(sx, sy, Math.max(0.5, star.size * scale), 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.restore();
      }

      // 3. Celestial Body: Sun or Moon
      const celestialX = width * 0.78;
      const celestialY = height * 0.28;

      ctx.save();
      if (weatherState.isDay) {
        // Sun with soft atmospheric halo
        const sunRadius = Math.min(36, width * 0.07);
        const sunGlow = ctx.createRadialGradient(
          celestialX,
          celestialY,
          sunRadius * 0.2,
          celestialX,
          celestialY,
          sunRadius * 3.5
        );
        sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
        sunGlow.addColorStop(0.3, 'rgba(253, 224, 71, 0.35)');
        sunGlow.addColorStop(0.7, 'rgba(251, 191, 36, 0.12)');
        sunGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(celestialX, celestialY, sunRadius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(celestialX, celestialY, sunRadius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Crescent Moon with soft lunar glow
        const moonRadius = Math.min(26, width * 0.055);
        const moonGlow = ctx.createRadialGradient(
          celestialX,
          celestialY,
          moonRadius * 0.4,
          celestialX,
          celestialY,
          moonRadius * 2.8
        );
        moonGlow.addColorStop(0, 'rgba(224, 231, 255, 0.4)');
        moonGlow.addColorStop(0.5, 'rgba(199, 210, 254, 0.12)');
        moonGlow.addColorStop(1, 'rgba(199, 210, 254, 0)');
        ctx.fillStyle = moonGlow;
        ctx.beginPath();
        ctx.arc(celestialX, celestialY, moonRadius * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Moon disc
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(celestialX, celestialY, moonRadius, 0, Math.PI * 2);
        ctx.fill();

        // Moon shadow crater curve
        ctx.fillStyle = skyTheme.mid;
        ctx.beginPath();
        ctx.arc(celestialX + moonRadius * 0.45, celestialY - moonRadius * 0.1, moonRadius * 0.85, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 4. Volumetric 3D Clouds (Depth sorted & projected)
      if (clouds.length > 0) {
        ctx.save();
        // Sort back to front
        clouds.sort((a, b) => b.z - a.z);

        clouds.forEach((cloud) => {
          if (shouldAnimate) {
            cloud.x += (cloud.speed + windVelocityX * 0.2) * (delta * 0.06);
            // Wrap horizontally
            const limit = width * 1.1;
            if (cloud.x > limit) cloud.x = -limit;
            if (cloud.x < -limit) cloud.x = limit;
          }

          const scale = FOV / cloud.z;
          const sx = centerX + cloud.x * scale;
          const sy = centerY + cloud.y * scale;
          const sRadius = cloud.radius * scale;

          if (sx + sRadius > -100 && sx - sRadius < width + 100) {
            const cloudColor = weatherState.isDay
              ? weatherState.cloudDensity > 0.7
                ? 'rgba(203, 213, 225,'
                : 'rgba(255, 255, 255,'
              : 'rgba(30, 41, 59,';

            const grad = ctx.createRadialGradient(
              sx,
              sy - sRadius * 0.2,
              sRadius * 0.1,
              sx,
              sy,
              sRadius
            );
            grad.addColorStop(0, `${cloudColor} ${cloud.alpha})`);
            grad.addColorStop(0.7, `${cloudColor} ${cloud.alpha * 0.6})`);
            grad.addColorStop(1, `${cloudColor} 0)`);

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(sx, sy, sRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.restore();
      }

      // 5. 3D Rain Particle System
      if (raindrops.length > 0) {
        ctx.save();
        ctx.strokeStyle = weatherState.isDay ? 'rgba(186, 230, 253, 0.45)' : 'rgba(147, 197, 253, 0.35)';
        ctx.lineWidth = 1.2;

        raindrops.forEach((drop) => {
          if (shouldAnimate) {
            drop.y += drop.speed * (delta * 0.06);
            drop.x += windVelocityX * (delta * 0.06);

            // Wrap when passing bottom or sides
            if (drop.y > height * 0.6) {
              drop.y = -height * 0.6;
              drop.x = (Math.random() - 0.5) * (width * 1.4);
            }
          }

          const scale = FOV / drop.z;
          const sx = centerX + drop.x * scale;
          const sy = centerY + drop.y * scale;
          const sLength = drop.length * scale;
          const sAngleOffset = windVelocityX * 0.8 * scale;

          if (sx >= -50 && sx <= width + 50 && sy >= -50 && sy <= height + 50) {
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + sAngleOffset, sy + sLength);
            ctx.stroke();
          }
        });
        ctx.restore();
      }

      // 6. 3D Snow Particle System
      if (snowflakes.length > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';

        snowflakes.forEach((flake) => {
          if (shouldAnimate) {
            flake.wobble += delta * 0.003;
            flake.y += flake.speed * (delta * 0.06);
            flake.x += (Math.sin(flake.wobble) * 0.8 + windVelocityX * 0.4) * (delta * 0.06);

            if (flake.y > height * 0.6) {
              flake.y = -height * 0.6;
              flake.x = (Math.random() - 0.5) * (width * 1.4);
            }
          }

          const scale = FOV / flake.z;
          const sx = centerX + flake.x * scale;
          const sy = centerY + flake.y * scale;
          const sRadius = flake.radius * scale;

          if (sx >= -20 && sx <= width + 20 && sy >= -20 && sy <= height + 20) {
            ctx.beginPath();
            ctx.arc(sx, sy, Math.max(0.8, sRadius), 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.restore();
      }

      // 7. Fog / Atmospheric Depth Haze at Horizon
      if (weatherState.fogDensity > 0.2 || weatherState.category === 'fog') {
        ctx.save();
        const hazeHeight = height * 0.4;
        const hazeGrad = ctx.createLinearGradient(0, height - hazeHeight, 0, height);
        hazeGrad.addColorStop(0, 'rgba(148, 163, 184, 0)');
        hazeGrad.addColorStop(
          1,
          `rgba(148, 163, 184, ${(weatherState.fogDensity * 0.65).toFixed(2)})`
        );
        ctx.fillStyle = hazeGrad;
        ctx.fillRect(0, height - hazeHeight, width, hazeHeight);
        ctx.restore();
      }

      if (shouldAnimate) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [weatherState, performanceMode, effectsEnabled, shouldAnimate, skyTheme]);

  // Graceful 2D Fallback if WebGL/Canvas fails or 3D effects are turned off
  if (!effectsEnabled || hasContextError) {
    return (
      <div
        className="absolute inset-0 transition-colors duration-1000 ease-in-out -z-10"
        style={{
          background: `linear-gradient(180deg, ${skyTheme.top} 0%, ${skyTheme.mid} 60%, ${skyTheme.bottom} 100%)`,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-cover opacity-90 transition-opacity duration-700"
      />
      {/* Subtle bottom shadow overlay to blend seamlessly into dashboard */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />
    </div>
  );
};
