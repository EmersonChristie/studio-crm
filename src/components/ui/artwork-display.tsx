'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';
import BezierEasing from 'bezier-easing';
import React from 'react';

interface ShadowOptions {
  angle?: number;
  length?: number;
  finalBlur?: number;
  spread?: number;
  finalTransparency?: number;
}

function getBoxShadows(numShadowLayers: number, options: ShadowOptions = {}) {
  const {
    angle = 40,
    length = 50,
    finalBlur = 200,
    spread = 0,
    finalTransparency = 0.5
  } = options;

  const angleToRadians = (angle: number) => angle * (Math.PI / 180);
  const rgba = (r: number, g: number, b: number, a: number) =>
    `rgba(${r}, ${g}, ${b}, ${a})`;
  const shadow = (
    left: number,
    top: number,
    blur: number,
    spread: number,
    color: string
  ) =>
    `${Math.round(left * 100) / 100}px ${Math.round(top * 100) / 100}px ${Math.round(blur * 100) / 100}px ${spread}px ${color}`;

  const alphaEasingValue = [0.1, 0.5, 0.9, 0.5] as const;
  const offsetEasingValue = [0.7, 0.1, 0.9, 0.3] as const;
  const blurEasingValue = [0.7, 0.1, 0.9, 0.3] as const;

  const alphaEasing = BezierEasing(
    alphaEasingValue[0],
    alphaEasingValue[1],
    alphaEasingValue[2],
    alphaEasingValue[3]
  );
  const offsetEasing = BezierEasing(
    offsetEasingValue[0],
    offsetEasingValue[1],
    offsetEasingValue[2],
    offsetEasingValue[3]
  );
  const blurEasing = BezierEasing(
    blurEasingValue[0],
    blurEasingValue[1],
    blurEasingValue[2],
    blurEasingValue[3]
  );

  const easedValues = Array.from({ length: numShadowLayers }, (_, i) => {
    const fraction = (i + 1) / numShadowLayers;
    return {
      alpha: alphaEasing(fraction),
      offset: offsetEasing(fraction),
      blur: blurEasing(fraction)
    };
  });

  const boxShadowValues = easedValues.map(({ offset, blur, alpha }) => {
    const yOffset = offset * Math.cos(angleToRadians(angle)) * length;
    const xOffset = offset * Math.sin(angleToRadians(angle)) * length;
    return [
      xOffset,
      yOffset,
      blur * finalBlur,
      spread,
      alpha * finalTransparency
    ] as const;
  });

  return boxShadowValues
    .map(([leftOffset, topOffset, blur, spread, alpha]) =>
      shadow(leftOffset, topOffset, blur, spread, rgba(0, 0, 0, alpha))
    )
    .join(',\n');
}

function generateArtShadows(layers: number, shadowIntensity = 0.4) {
  // Ensure shadowIntensity is between 0 and 1
  shadowIntensity = Math.max(0, Math.min(1, shadowIntensity));

  // Calculate the intensity factor
  const intensityFactor = shadowIntensity * 2;

  const opts = {
    longShadow: {
      angle: 35,
      length: 5 * intensityFactor,
      finalBlur: 6 * (2 - intensityFactor),
      finalTransparency: 0.15 * intensityFactor
    },
    shortShadow: {
      angle: 45,
      length: 4 * intensityFactor,
      finalBlur: 3 * (2 - intensityFactor),
      finalTransparency: 0.19 * intensityFactor
    },
    upperShadow: {
      angle: -62,
      length: -5 * intensityFactor,
      finalBlur: 3 * (2 - intensityFactor),
      finalTransparency: 0.08 * intensityFactor
    }
  };

  return [
    getBoxShadows(layers, opts.longShadow),
    getBoxShadows(layers, opts.shortShadow),
    getBoxShadows(layers, opts.upperShadow)
  ].join(',\n');
}

interface ArtworkDisplayProps {
  src: string;
  alt: string;
  className?: string;
  shadowIntensity?: number;
}

export function ArtworkDisplay({
  src,
  alt,
  className,
  shadowIntensity = 0.4
}: ArtworkDisplayProps) {
  // Move shadow generation to client-side only
  const [shadow, setShadow] = useState<string>('none');

  useEffect(() => {
    setShadow(generateArtShadows(4, shadowIntensity));
  }, [shadowIntensity]);

  return (
    <div
      className={cn(
        'relative aspect-square w-full overflow-hidden',
        'bg-gradient-to-br from-neutral-50 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800',
        className
      )}
    >
      <div className='absolute inset-0 flex items-center justify-center p-[7.5%]'>
        <div
          className={cn(
            'relative max-h-[85%] max-w-[85%] bg-white dark:bg-neutral-200'
          )}
          style={{
            // boxShadow: shadow
            boxShadow:
              'rgba(0, 0, 0, 0.043) 0.37237016456675937px 0.44377348139733286px 0.5793051374284405px 0px, rgba(0, 0, 0, 0.06) 0.1657897618972239px .5318080591723024px .5469297616353146px 0px, rgba(0, 0, 0, 0.075) 0.0547577922105507px 0.3528881844807665px 0.918773742338844px 0px, rgba(0, 0, 0, 0.086) 1.0803221177377376px 1.575108153864249px 2.214268599539516px 0px, rgba(0, 0, 0, 0.1) 1.509936997828595px 3.066137013811576px 3.213372186585694px 0px, rgba(0, 0, 0, 0.118) 3.29504811692371px 4.054139050530355px 5.058257657323903px 0px, rgba(0, 0, 0, 0.16) 5.06969024216348px 6.151111077974452px 15px 0px'
          }}
        >
          <Image
            src={src}
            alt={alt}
            className='h-full w-full object-contain'
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
