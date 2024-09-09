import { ReactNode, createContext, useContext } from 'react';
import { MakeCodeRenderBlocksOptions } from '../vanilla/makecode-render-blocks.js';
import useMakeCodeRenderBlocks, {
  UseMakeCodeRenderBlocksReturn,
} from './useMakeCodeRenderBlocks.js';

const MakeCodeRenderBlocksContext =
  createContext<UseMakeCodeRenderBlocksReturn>({
    renderBlocks: () => {
      throw new Error('Configure MakeCodeRenderBlocksProvider.');
    },
  });

export const MakeCodeRenderBlocksProvider = ({
  options,
  children,
}: {
  options: MakeCodeRenderBlocksOptions;
  children: ReactNode;
}) => {
  const value = useMakeCodeRenderBlocks(options);
  return (
    <MakeCodeRenderBlocksContext.Provider value={value}>
      {children}
    </MakeCodeRenderBlocksContext.Provider>
  );
};

export const useMakeCodeRenderBlocksContext = () =>
  useContext(MakeCodeRenderBlocksContext);
