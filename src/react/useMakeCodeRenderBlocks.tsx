import { useEffect, useMemo } from 'react';
import createMakeCodeRenderBlocks, {
  MakeCodeRenderBlocksOptions,
  MakeCodeRenderBlocksReturn,
  RenderBlocksRequest,
  RenderBlocksResponse,
} from '../vanilla/makecode-render-blocks.js';

export interface UseMakeCodeRenderBlocksReturn {
  renderBlocks: (req: RenderBlocksRequest) => Promise<RenderBlocksResponse>;
}

const useMakeCodeRenderBlocks = (
  options: MakeCodeRenderBlocksOptions
): UseMakeCodeRenderBlocksReturn => {
  const { disabled, lang, version } = options;
  const memoizedOptions = useMemo(() => {
    return { disabled, lang, version };
  }, [disabled, lang, version]);
  const returnValue = useMemo<MakeCodeRenderBlocksReturn>(
    () => createMakeCodeRenderBlocks(memoizedOptions),
    [memoizedOptions]
  );
  useEffect(() => {
    returnValue.initialize();
    return () => returnValue.dispose();
  }, [returnValue]);

  return returnValue;
};

export default useMakeCodeRenderBlocks;
