import { ReactNode } from 'react';
import StoryWrapper from './StoryWrapper.js';

interface HtmlToReactWrapperProps {
  htmlEl: HTMLElement;
  children?: ReactNode;
}

export const HtmlToReactWrapper = ({
  htmlEl,
  children,
}: HtmlToReactWrapperProps) => {
  const elementId = 'story-wrapper';
  const waitForElementLoaded = () => {
    const targetEl = document.getElementById(elementId);
    if (!targetEl) {
      window.setTimeout(waitForElementLoaded, 500);
      return;
    }
    targetEl.replaceChildren(htmlEl);
  };
  waitForElementLoaded();
  return (
    <>
      {children}
      <StoryWrapper id={elementId}>
        <p>Loading...</p>
      </StoryWrapper>
    </>
  );
};
