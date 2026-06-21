/**
 * (c) 2026, Micro:bit Educational Foundation and contributors
 *
 * SPDX-License-Identifier: MIT
 */
// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  MakeCodeFrameDriver,
  Options,
} from './makecode-frame-driver.js';

const testOrigin = 'http://localhost';

const defaultOptions: Options = {
  initialProjects: () => Promise.resolve([]),
};

function createDriver(optionOverrides: Partial<Options> = {}) {
  const iframe = {
    src: `${testOrigin}/makecode`,
    contentWindow: {
      postMessage: vi.fn(),
    },
  } as unknown as HTMLIFrameElement;
  const driver = new MakeCodeFrameDriver(
    { ...defaultOptions, ...optionOverrides },
    () => iframe
  );
  return { driver, iframe };
}

function fireMessage(data: Record<string, unknown>) {
  window.dispatchEvent(
    new MessageEvent('message', { data, origin: testOrigin })
  );
}

function fireEditorContentLoaded() {
  fireMessage({ type: 'pxthost', action: 'editorcontentloaded' });
}

function fireWorkspaceLoaded() {
  fireMessage({ type: 'pxthost', action: 'workspaceloaded' });
}

function fireFullyReady() {
  fireEditorContentLoaded();
  fireWorkspaceLoaded();
}

describe('waitUntilReady', () => {
  let driver: MakeCodeFrameDriver;

  afterEach(() => {
    driver.dispose();
  });

  it('resolves ready after both signals', async () => {
    ({ driver } = createDriver());
    driver.initialize();
    fireFullyReady();
    expect(await driver.waitUntilReady()).toEqual({ ready: true });
  });

  it('resolves ready immediately if already loaded', async () => {
    ({ driver } = createDriver());
    driver.initialize();
    fireFullyReady();
    await driver.waitUntilReady();
    // Second call should be immediate
    expect(await driver.waitUntilReady()).toEqual({ ready: true });
  });

  it('waits for both signals', async () => {
    ({ driver } = createDriver({ startUpTimeout: 0 }));
    driver.initialize();
    fireEditorContentLoaded();
    // Only one signal — should not be ready
    expect(driver.isReady).toBe(false);
    fireWorkspaceLoaded();
    expect(await driver.waitUntilReady()).toEqual({ ready: true });
  });

  it('resolves timeout when startUpTimeout expires', async () => {
    ({ driver } = createDriver({ startUpTimeout: 10 }));
    driver.initialize();
    expect(await driver.waitUntilReady()).toEqual({
      ready: false,
      reason: 'timeout',
    });
  });

  it('resolves timeout immediately when time already elapsed', async () => {
    ({ driver } = createDriver({ startUpTimeout: 1 }));
    driver.initialize();
    // Wait long enough for the timeout to have elapsed
    await new Promise((r) => setTimeout(r, 5));
    expect(await driver.waitUntilReady()).toEqual({
      ready: false,
      reason: 'timeout',
    });
  });

  it('does not timeout when startUpTimeout is 0', async () => {
    ({ driver } = createDriver({ startUpTimeout: 0 }));
    driver.initialize();
    // Fire ready shortly after
    setTimeout(fireFullyReady, 5);
    expect(await driver.waitUntilReady()).toEqual({ ready: true });
  });

  it('resolves load-error on notifyLoadError', async () => {
    ({ driver } = createDriver({ startUpTimeout: 0 }));
    driver.initialize();
    driver.notifyLoadError();
    expect(await driver.waitUntilReady()).toEqual({
      ready: false,
      reason: 'load-error',
    });
  });

  it('resolves load-error when notifyLoadError called during wait', async () => {
    ({ driver } = createDriver({ startUpTimeout: 0 }));
    driver.initialize();
    setTimeout(() => driver.notifyLoadError(), 5);
    expect(await driver.waitUntilReady()).toEqual({
      ready: false,
      reason: 'load-error',
    });
  });

  it('calls onLoadError callback on notifyLoadError', () => {
    const onLoadError = vi.fn();
    ({ driver } = createDriver({ onLoadError }));
    driver.initialize();
    driver.notifyLoadError();
    expect(onLoadError).toHaveBeenCalledOnce();
  });

  it('resolves offline when navigator.onLine is false', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      configurable: true,
    });
    ({ driver } = createDriver({ startUpTimeout: 0 }));
    driver.initialize();
    expect(await driver.waitUntilReady()).toEqual({
      ready: false,
      reason: 'offline',
    });
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true,
    });
  });

  it('resolves offline when offline event fires during wait', async () => {
    ({ driver } = createDriver({ startUpTimeout: 0 }));
    driver.initialize();
    setTimeout(() => window.dispatchEvent(new Event('offline')), 5);
    expect(await driver.waitUntilReady()).toEqual({
      ready: false,
      reason: 'offline',
    });
  });

  it('ready wins over offline if already loaded', async () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      configurable: true,
    });
    ({ driver } = createDriver({ startUpTimeout: 0 }));
    driver.initialize();
    fireFullyReady();
    // Already ready takes the fast path before checking offline
    expect(await driver.waitUntilReady()).toEqual({ ready: true });
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true,
    });
  });
});

describe('isReady', () => {
  let driver: MakeCodeFrameDriver;

  afterEach(() => {
    driver.dispose();
  });

  it('is false initially', () => {
    ({ driver } = createDriver());
    driver.initialize();
    expect(driver.isReady).toBe(false);
  });

  it('is true after both signals', () => {
    ({ driver } = createDriver());
    driver.initialize();
    fireFullyReady();
    expect(driver.isReady).toBe(true);
  });

  it('resets on reinitialize', () => {
    ({ driver } = createDriver());
    driver.initialize();
    fireFullyReady();
    expect(driver.isReady).toBe(true);
    driver.dispose();
    driver.initialize();
    expect(driver.isReady).toBe(false);
  });
});
