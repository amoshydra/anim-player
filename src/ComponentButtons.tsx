import { css } from "@linaria/core";
import { styled } from "@linaria/react";

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

  cursor: pointer;
  user-select: none;
`;

export const cssButton = css`
  ${cssButtonString};
`;

export const IconButton = styled.button`
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
