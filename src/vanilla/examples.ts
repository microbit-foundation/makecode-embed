import { Project } from './pxt.js';

export const defaultMakeCodeProject: Project = {
  text: {
    'main.blocks':
      '<xml xmlns="http://www.w3.org/1999/xhtml">\n  <block type="pxt-on-start" id=",{,HjW]u:lVGcDRS_Cu|" x="-247" y="113"></block>\n</xml>',
    'main.ts': '',
    'README.md': ' ',
    'pxt.json':
      '{\n    "name": "Untitled",\n    "dependencies": {\n        "core": "*"\n , "radio": "*"\n   },\n    "description": "",\n    "files": [\n        "main.blocks",\n        "main.ts",\n        "README.md"\n    ]\n}',
  },
};

export const emptyMakeCodeProject: Project = {
  text: {
    'main.blocks':
      '<xml xmlns="http://www.w3.org/1999/xhtml">\n  <variables></variables>\n</xml>',
    'main.ts': '\n',
    'README.md': ' ',
    'pxt.json':
      '{\n    "name": "Untitled",\n    "dependencies": {\n        "core": "*"\n , "radio": "*"\n   },\n    "description": "",\n    "files": [\n        "main.blocks",\n        "main.ts",\n        "README.md"\n    ]\n}',
  },
};
