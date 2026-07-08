export const controllerId = 'MicrobitStorybook';

// A locally running pxt-microbit dev server (`pxt serve`), selectable via the
// "version" control in the editor stories for testing unreleased editor changes.
// We point at /index.html because the dev server's redirect from / drops the
// query string, losing controller=1 and leaving the editor in sandbox layout.
export const localPxtBaseUrl = 'http://localhost:3232/index.html';

/**
 * Maps the story "version" control value ('default' | 'beta' | 'local') to
 * baseUrl/version values understood by the frame driver.
 */
export const editorVersionArgs = (
  version: string | undefined
): { baseUrl?: string; version?: string } =>
  version === 'local'
    ? { baseUrl: localPxtBaseUrl }
    : { version: version === 'default' ? undefined : version };
