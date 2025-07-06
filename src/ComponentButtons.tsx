import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import type { ButtonHTMLAttributes } from "react";

const cssButtonString = `
  border: 1px solid var(--button-borderColor);
  height: var(--interactive-size);
  border-radius: var(--button-borderRadius);

  padding-left: var(--button-paddingX);
  padding-right: var(--button-paddingX);

  display: inline-flex;
  justify-content: center;
  align-items: center;

  background: var(--button-backgroundColor);
  @media (hover: hover) {
    &:hover {
      background: var(--button_hover-backgroundColor);
    }
  }
  &:active {
    background: var(--button_active-backgroundColor);
  }
  &[data-outline="false"] {
    border-color: var(--button-backgroundColor);
  }

  cursor: pointer;
  user-select: none;
`;

export const cssButton = css`
  ${cssButtonString};
`;

const _IconButton = styled.button`
  ${cssButtonString};
  width: var(--button-size);
  height: var(--button-size);
  padding: 0;
  > svg {
    stroke: gray;
    flex-basis: 1.5rem;
    height: 1.5rem;
    width: 1.5rem;
  }
`;


export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
}
export const IconButton = ({ children, "aria-label": ariaLabel, ...props }: IconButtonProps) => {
  return (
    <_IconButton
      title={ariaLabel}
      {...props}
    >
      <VisuallyHidden children={ariaLabel} />
      {children}
    </_IconButton>
  );
}

const VisuallyHidden = styled.span`
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
  border: 0;
  padding: 0;
  margin: -1px;
  clip-path: inset(50%);
  pointer-events: none;
`;
