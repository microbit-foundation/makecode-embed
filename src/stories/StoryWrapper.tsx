import { ReactNode } from 'react';

const StoryWrapper = (props: { children: ReactNode; id?: string }) => (
  <div
    id={props.id}
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
