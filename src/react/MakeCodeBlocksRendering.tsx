/**
 * A React component
 * to render MakeCode block snippets
 */
import React, { useState, useEffect, ReactNode } from 'react';
import { useMakeCodeRenderBlocksContext } from './MakeCodeRenderBlocksProvider.js';
import { BlockLayout, Project } from '../vanilla/pxt.js';

export interface MakeCodeBlocksRenderingProps {
  className?: string;
  code?: string | Project;
  packageId?: string;
  package?: string;
  snippetMode?: boolean;
  layout?: BlockLayout;
  loaderCmp?: React.ReactNode;
}

export interface MakeCodeBlocksRenderingState {
  uri?: string;
  width?: number;
  height?: number;
  error?: string;
  rendering: boolean;
}

const MakeCodeBlocksRendering = ({
  loaderCmp,
  package: _package,
  packageId,
  snippetMode,
  layout,
  code,
  className,
}: MakeCodeBlocksRenderingProps) => {
  const [state, setState] = useState<MakeCodeBlocksRenderingState>({
    rendering: true,
  });
  const { renderBlocks } = useMakeCodeRenderBlocksContext();

  useEffect(() => {
    let ignoreReponse = false;
    async function intializeRendering() {
      try {
        const r = await renderBlocks({
          code: code || '',
          options: {
            packageId,
            package: _package,
            snippetMode,
            layout,
          },
        });
        if (!ignoreReponse) {
          setState({
            uri: r.uri,
            width: r.width,
            height: r.height,
            rendering: false,
          });
        }
      } catch (e) {
        if (!ignoreReponse) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setState({ error: (e as any).toString(), rendering: false });
        }
      }
    }
    if (typeof code === 'string' && !code.trim()) {
      // If you render an empty string MakeCode responds with a smiley face, so we
      // need to check first.
      setState({
        rendering: false,
        height: 0,
        width: 0,
      });
    } else {
      intializeRendering();
    }
    return () => {
      ignoreReponse = true;
    };
  }, [code, packageId, _package, snippetMode, layout, renderBlocks]);

  const { uri, width, height, error, rendering } = state;
  let component: ReactNode;
  if (width === 0 && height === 0) {
    component = null;
  } else if (rendering) {
    component = loaderCmp ? loaderCmp : <div>Loading...</div>;
  } else if (error) {
    component = <div>{error}</div>;
  } else if (uri) {
    component = (
      <img
        className="ui image"
        alt={
          code === undefined || typeof code === 'string'
            ? code
            : code.text!['main.ts']
        }
        src={uri}
        width={width}
        height={height}
      />
    );
  } else {
    throw new Error('Unexpected state.');
  }
  return (
    <div className={className} style={{ overflow: 'auto' }}>
      {component}
    </div>
  );
};

export default React.memo(MakeCodeBlocksRendering);
