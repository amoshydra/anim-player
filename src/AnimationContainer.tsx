import { forwardRef } from 'react';

import { styled } from '@linaria/react';

const AnimationContainer = styled('div')`
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
`;

const Container = forwardRef<HTMLDivElement>((props, ref) => (
  <AnimationContainer ref={ref} {...props} />
));

export { Container };
