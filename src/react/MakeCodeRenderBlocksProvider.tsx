import { ReactNode, createContext, useContext, useMemo } from 'react';
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
  disabled,
  version,
  lang,
  children,
}: {
  /**
   * This can be used to disable loading MakeCode in scenarios where it will be unused.
   */
  disabled?: boolean;
  /**
   * MakeCode version.
   */
  version?: string;
  /**
   * MakeCode language code.
   */
  lang?: string;
  children: ReactNode;
}) => {
  const options = useMemo(() => {
    return { disabled, version, lang };
  }, [disabled, lang, version]);
  const value = useMakeCodeRenderBlocks(options);
  return (
    <MakeCodeRenderBlocksContext.Provider value={value}>
      {children}
    </MakeCodeRenderBlocksContext.Provider>
  );
};

export const useMakeCodeRenderBlocksContext = () =>
  useContext(MakeCodeRenderBlocksContext);
