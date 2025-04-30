import React from "react";
import { getChartConfig } from "@/lib/data";
import { Flag } from "@/lib/types";

const { blipSize } = getChartConfig();
const halfBlipSize = blipSize / 2;

interface BlipProps {
  title: string;
  color: string;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  textAnchor: "start" | "end";
  isHovered: boolean;
  dimOthers: boolean;
}

export function Blip({
  flag,
  color,
  x,
  y,
  title,
  labelX,
  labelY,
  textAnchor,
  isHovered,
  dimOthers,
}: BlipProps & { flag: Flag }) {
  switch (flag) {
    case Flag.New:
      return (
        <BlipNew
          x={x}
          y={y}
          color={color}
          title={title}
          labelX={labelX}
          labelY={labelY}
          textAnchor={textAnchor}
          isHovered={isHovered}
          dimOthers={dimOthers}
        />
      );
    case Flag.Changed:
      return (
        <BlipChanged
          x={x}
          y={y}
          color={color}
          title={title}
          labelX={labelX}
          labelY={labelY}
          textAnchor={textAnchor}
          isHovered={isHovered}
          dimOthers={dimOthers}
        />
      );
    default:
      return (
        <BlipDefault
          x={x}
          y={y}
          color={color}
          title={title}
          labelX={labelX}
          labelY={labelY}
          textAnchor={textAnchor}
          isHovered={isHovered}
          dimOthers={dimOthers}
        />
      );
  }
}

function drawLabel(
  x: number,
  y: number,
  labelX: number,
  labelY: number,
  title: string,
  textAnchor: "start" | "end",
  isHovered: boolean,
  dimOthers: boolean,
) {
  const opacity = dimOthers ? 0.2 : 1;
  const fontWeight = isHovered ? "bold" : "normal";

  return (
    <>
      <line
        x1={x}
        y1={y}
        x2={labelX}
        y2={labelY}
        stroke="#999"
        strokeWidth={1}
        opacity={opacity}
      />
      <text
        x={labelX}
        y={labelY}
        fontSize={11}
        fill="#61616a"
        textAnchor={textAnchor}
        alignmentBaseline="middle"
        fontWeight={fontWeight}
        opacity={opacity}
        pointerEvents="none"
      >
        {title}
      </text>
    </>
  );
}

function BlipDefault({
  x,
  y,
  color,
  title,
  labelX,
  labelY,
  textAnchor,
  isHovered,
  dimOthers,
}: BlipProps) {
  return (
    <g>
      <circle cx={x} cy={y} r={halfBlipSize} stroke="none" fill={color} />
      {drawLabel(x, y, labelX, labelY, title, textAnchor, isHovered, dimOthers)}
    </g>
  );
}

function BlipNew({
  x,
  y,
  color,
  title,
  labelX,
  labelY,
  textAnchor,
  isHovered,
  dimOthers,
}: BlipProps) {
  const shapeX = Math.round(x - halfBlipSize);
  const shapeY = Math.round(y - halfBlipSize);
  return (
    <g>
      <path
        stroke="none"
        fill={color}
        d="M5.7679491924311 2.1387840678323a2 2 0 0 1 3.4641016151378 0l5.0358983848622 8.7224318643355a2 2 0 0 1 -1.7320508075689 3l-10.071796769724 0a2 2 0 0 1 -1.7320508075689 -3"
        transform={`translate(${shapeX},${shapeY})`}
      />
      {drawLabel(x, y, labelX, labelY, title, textAnchor, isHovered, dimOthers)}
    </g>
  );
}

function BlipChanged({
  x,
  y,
  color,
  title,
  labelX,
  labelY,
  textAnchor,
  isHovered,
  dimOthers,
}: BlipProps) {
  const shapeX = Math.round(x - halfBlipSize);
  const shapeY = Math.round(y - halfBlipSize);
  return (
    <g>
      <rect
        transform={`rotate(-45 ${shapeX} ${shapeY})`}
        x={shapeX}
        y={shapeY}
        width={blipSize}
        height={blipSize}
        rx="3"
        stroke="none"
        fill={color}
      />
      {drawLabel(x, y, labelX, labelY, title, textAnchor, isHovered, dimOthers)}
    </g>
  );
}
