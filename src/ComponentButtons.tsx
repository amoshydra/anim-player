import { css } from "@linaria/core";
import { styled } from "@linaria/react";

export const IconButton = styled.button`
  background: none;
  border: 1px solid var(--button-border-color);
  cursor: pointer;
  width: var(--button-size);
  height: var(--button-size);
  display: inline-flex;
  padding: 0;
  justify-content: center;
  align-items: center;
  border-radius: var(--button-border-radius);
  > svg {
    stroke: gray;
    flex-basis: 1.5rem;
    height: 1.5rem;
    width: 1.5rem;
  }
`;

export const cssButton = css`
  border: 1px solid var(--border-color);
  height: var(--interactive-size);
  border-radius: var(--button-border-radius);
  display: inline-flex;
  padding: 1rem;
  justify-content: center;
  align-items: center;
  @media (hover: hover) {
    &:hover {
      background: #F9F9F9;
    }
  }
  cursor: pointer;
`;
