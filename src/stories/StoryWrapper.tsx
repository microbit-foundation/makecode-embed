import { ReactNode } from 'react';

const StoryWrapper = (props: { id?: string; children?: ReactNode }) => (
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
