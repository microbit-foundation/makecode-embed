import { ReactNode } from 'react';

const StoryWrapper = (props: { children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: 700,
    }}
  >
    {props.children}
  </div>
);

export default StoryWrapper;
