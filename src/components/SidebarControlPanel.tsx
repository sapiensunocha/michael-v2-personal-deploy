// src/components/SidebarControlPanel.tsx

"use client";

import React, { useState } from "react";
import styled from "styled-components";

// Re-defining constants for consistency
const OCHA_COLORS = {
  blue: { 500: "#005A8A", 400: "#0077B6", 300: "#00A5CF" },
  red: { 500: "#D1342F", 400: "#D95C5A", 300: "#E18584" },
  green: { 500: "#00994F", 400: "#33AD73", 300: "#66C297" },
  yellow: { 500: "#FFC107", 400: "#FFCD38", 300: "#FFD969" },
  gray: { 500: "#4A4A4A", 400: "#6B7280", 300: "#9CA3AF", 100: "#E0E0E0" },
  white: "#FFFFFF",
};

const SPACING = {
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
};

const TYPOGRAPHY = {
  body: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.6 },
};

const PanelContainer = styled.div`
  position: absolute;
  top: ${SPACING.lg};
  right: ${SPACING.lg};
  width: 320px;
  background-color: ${OCHA_COLORS.white};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: ${SPACING.lg};
  display: flex;
  flex-direction: column;
  gap: ${SPACING.md};
  z-index: 1000;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: ${OCHA_COLORS.gray[500]};
`;

const SectionHeader = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${OCHA_COLORS.blue[500]};
  border-bottom: 1px solid ${OCHA_COLORS.gray[100]};
  padding-bottom: ${SPACING.sm};
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING.sm};
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: ${SPACING.sm};
  font-size: ${TYPOGRAPHY.body.fontSize};
  cursor: pointer;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
`;

const Slider = styled.span<{ checked: boolean }>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.checked ? OCHA_COLORS.green[500] : OCHA_COLORS.gray[300]};
  transition: 0.4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
    transform: ${props => props.checked ? "translateX(16px)" : "translateX(0)"};
  }
`;

const CheckboxInput = styled.input.attrs({ type: "checkbox" })`
  opacity: 0;
  width: 0;
  height: 0;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING.sm};
`;

const RangeInput = styled.input.attrs({ type: "range" })`
  flex-grow: 1;
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  background: ${OCHA_COLORS.gray[100]};
  border-radius: 5px;
  outline: none;
  opacity: 0.7;
  transition: opacity .2s;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: ${OCHA_COLORS.blue[500]};
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid ${OCHA_COLORS.white};
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }
`;

interface SidebarControlPanelProps {
    onToggleExtendedCoverage: (isChecked: boolean) => void;
    onSetInundationProbability: (probability: number) => void;
}

const SidebarControlPanel: React.FC<SidebarControlPanelProps> = ({
  onToggleExtendedCoverage,
  onSetInundationProbability,
}) => {
  const [isExtendedCoverage, setIsExtendedCoverage] = useState(true);
  const [inundationProbability, setInundationProbability] = useState(50);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsExtendedCoverage(e.target.checked);
    onToggleExtendedCoverage(e.target.checked);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setInundationProbability(value);
    onSetInundationProbability(value);
  };

  return (
    <PanelContainer>
      <SectionHeader>Map Layers</SectionHeader>
      <ControlGroup>
        <Label>
          <ToggleSwitch>
            <CheckboxInput checked={isExtendedCoverage} onChange={handleToggle} />
            <Slider checked={isExtendedCoverage} />
          </ToggleSwitch>
          <span>Extended Coverage</span>
        </Label>
      </ControlGroup>
      <ControlGroup>
        <SectionHeader>Inundation Probability</SectionHeader>
        <SliderContainer>
          <RangeInput
            min="0"
            max="100"
            value={inundationProbability}
            onChange={handleSliderChange}
          />
          <span>{inundationProbability}%</span>
        </SliderContainer>
      </ControlGroup>
    </PanelContainer>
  );
};

export default SidebarControlPanel;