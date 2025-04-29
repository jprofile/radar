import Link from "next/link";
import React, { FC, Fragment, memo } from "react";

import styles from "./Chart.module.css";

import { Blip } from "@/components/Radar/Blip";
import { Item, Quadrant, Ring } from "@/lib/types";

export interface ChartProps {
  size?: number;
  quadrants: Quadrant[];
  rings: Ring[];
  items: Item[];
  className?: string;
}

function isOverlapping(newBox: { x: number; y: number; width: number; height: number }, hitboxes: typeof newBox[]) {
  return hitboxes.some((box) => {
    return (
      Math.abs(newBox.x - box.x) < (box.width + newBox.width) / 2 &&
      Math.abs(newBox.y - box.y) < (box.height + newBox.height) / 2
    );
  });
}

const _Chart: FC<ChartProps> = ({
  size = 800,
  quadrants = [],
  rings = [],
  items = [],
  className,
}) => {
  const viewBoxSize = size;
  const center = size / 2;
  const startAngles = [270, 0, 180, 90];
  const labelHitboxes: { x: number; y: number; width: number; height: number }[] = [];

  const polarToCartesian = (
    radius: number,
    angleInDegrees: number,
  ): { x: number; y: number } => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: Math.round(center + radius * Math.cos(angleInRadians)),
      y: Math.round(center + radius * Math.sin(angleInRadians)),
    };
  };

  const describeArc = (radiusPercentage: number, position: number): string => {
    const startAngle = startAngles[position - 1];
    const endAngle = startAngle + 90;
    const radius = radiusPercentage * center;
    const start = polarToCartesian(radius, endAngle);
    const end = polarToCartesian(radius, startAngle);
    return [`M`, start.x, start.y, `A`, radius, radius, 0, 0, 0, end.x, end.y].join(" ");
  };

  const renderGlow = (position: number, color: string) => {
    const gradientId = `glow-${position}`;
    const cx = position === 1 || position === 3 ? 1 : 0;
    const cy = position === 1 || position === 2 ? 1 : 0;
    const x = position === 1 || position === 3 ? 0 : center;
    const y = position === 1 || position === 2 ? 0 : center;
    return (
      <>
        <defs>
          <radialGradient id={gradientId} x={0} y={0} r={1} cx={cx} cy={cy}>
            <stop offset="0%" stopColor={color} stopOpacity={0.5}></stop>
            <stop offset="100%" stopColor={color} stopOpacity={0}></stop>
          </radialGradient>
        </defs>
        <rect width={center} height={center} x={x} y={y} fill={`url(#${gradientId})`} />
      </>
    );
  };

  const quadrantAngles: Record<number, [number, number]> = {
    1: [270, 360],
    2: [0, 90],
    3: [180, 270],
    4: [90, 180],
  };

  const renderItem = (item: Item) => {
    const ring = rings.find((r) => r.id === item.ring);
    const quadrant = quadrants.find((q) => q.id === item.quadrant);
    if (!ring || !quadrant) return null;
    const [x, y] = item.position;

    labelHitboxes.push({ x, y, width: 24, height: 24 });
    const textWidth = item.title.length * 8;
    const textHeight = 20;

    const angles = Array.from({ length: 24 }, (_, i) => i * 15);
    const radii = Array.from({ length: 8 }, (_, i) => 20 + i * 20);

    let best = {
      score: -Infinity,
      labelX: x + 12,
      labelY: y - 12,
      anchor: "start" as "start" | "end",
    };

    for (const angle of angles) {
      for (const radius of radii) {
        const rad = (angle * Math.PI) / 180;
        const testX = Math.round(x + Math.cos(rad) * radius);
        const testY = Math.round(y + Math.sin(rad) * radius);

        if (Math.abs(testY - center) < 25) continue;
        const distance = Math.sqrt((testX - center) ** 2 + (testY - center) ** 2);
        if (distance > center - 10) continue;

        const angleDeg = (Math.atan2(testY - center, testX - center) * 180) / Math.PI;
        const normAngle = (angleDeg + 360) % 360;
        const [minA, maxA] = quadrantAngles[quadrant.position];
        if (normAngle < minA || normAngle >= maxA) continue;

        const anchor = testX < x ? "end" : "start";
        const hitboxX = anchor === "end" ? testX - textWidth : testX;

        const box = {
          x: hitboxX,
          y: testY - textHeight / 2,
          width: textWidth,
          height: textHeight,
        };

        if (!isOverlapping(box, labelHitboxes)) {
          const distScore = -Math.sqrt((testX - x) ** 2 + (testY - y) ** 2);
          if (distScore > best.score) {
            best = { score: distScore, labelX: testX, labelY: testY, anchor };
          }
        }
      }
    }

    labelHitboxes.push({
      x: best.anchor === "end" ? best.labelX - textWidth : best.labelX,
      y: best.labelY - textHeight / 2,
      width: textWidth,
      height: textHeight,
    });

    return (
      <Link
        key={item.id}
        href={`/${item.quadrant}/${item.id}`}
        data-tooltip={item.title}
        data-tooltip-color={quadrant.color}
        tabIndex={-1}
      >
        <Blip
          flag={item.flag}
          color={quadrant.color}
          x={x}
          y={y}
          title={item.title}
          labelX={best.labelX}
          labelY={best.labelY}
          textAnchor={best.anchor}
        />
      </Link>
    );
  };

  const renderRingLabels = () => {
    return rings.map((ring, index) => {
      const outerRadius = ring.radius || 1;
      const innerRadius = rings[index - 1]?.radius || 0;
      const position = ((outerRadius + innerRadius) / 2) * center;
      return (
        <Fragment key={ring.id}>
          <text x={center + position} y={center} textAnchor="middle" dominantBaseline="middle" fontSize="12">
            {ring.title}
          </text>
          <text x={center - position} y={center} textAnchor="middle" dominantBaseline="middle" fontSize="12">
            {ring.title}
          </text>
        </Fragment>
      );
    });
  };

  return (
    <svg
      className={className}
      width={viewBoxSize}
      height={viewBoxSize}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
    >
      {quadrants.map((quadrant) => (
        <g key={quadrant.id} data-quadrant={quadrant.id}>
          {renderGlow(quadrant.position, quadrant.color)}
          {rings.map((ring) => (
            <path
              key={`${ring.id}-${quadrant.id}`}
              d={describeArc(ring.radius || 0.5, quadrant.position)}
              fill="none"
              stroke={quadrant.color}
              strokeWidth={ring.strokeWidth || 2}
            />
          ))}
        </g>
      ))}
      <g className={styles.items}>{items.map((item) => renderItem(item))}</g>
      <g className={styles.ringLabels}>{renderRingLabels()}</g>
    </svg>
  );
};

export const Chart = memo(_Chart);
