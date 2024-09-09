import { Project } from '../vanilla/pxt.js';

export const project = {
  text: {
    'main.blocks':
      '<xml xmlns="http://www.w3.org/1999/xhtml">\n  <block type="pxt-on-start" id=",{,HjW]u:lVGcDRS_Cu|" x="-247" y="113"></block>\n</xml>',
    'main.ts': 'basic.showIcon(IconNames.Heart)\n',
    'README.md': ' ',
    'pxt.json':
      '{\n    "name": "Untitled",\n    "dependencies": {\n        "core": "*"\n , "radio": "*"\n   },\n    "description": "",\n    "files": [\n        "main.blocks",\n        "main.ts",\n        "README.md"\n    ]\n}',
  },
} as Project;

export const projectWithLayout = {
  text: {
    'main.ts': 'basic.showIcon(IconNames.Heart)\n',
    'main.blocks': `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="device_button_event" x="248" y="0">
      <field name="NAME">Button.A</field>
      <statement name="HANDLER">
        <block type="basic_show_icon">
          <field name="i">IconNames.Heart</field>
        </block>
      </statement>
    </block>
    <block type="pxt-on-start" x="0" y="35">
      <statement name="HANDLER">
        <block type="device_show_leds">
          <field name="LEDS">\`
          . . . . .
          . . . . #
          . . . # .
          # . # . .
          . # . . .
          \`
          </field>
        </block>
      </statement>
    </block>
    <block type="device_forever" x="245" y="351">
      <statement name="HANDLER">
        <block type="device_print_message">
          <value name="text">
            <shadow type="text">
              <field name="TEXT">Hello!</field>
            </shadow>
          </value>
        </block>
      </statement>
    </block>
    <block type="device_gesture_event" x="7" y="594">
      <field name="NAME">Gesture.Shake</field>
      <statement name="HANDLER">
        <block type="device_pause">
          <value name="pause">
            <shadow type="timePicker">
              <field name="ms">100</field>
            </shadow>
          </value>
        </block>
      </statement>
    </block>
  </xml>`,
  },
} as Project;

export const projectWithExtensionBlock: Project = {
  text: {
    'README.md': '',
    'main.blocks':
      '<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="5rH[22#dxH5~IM6x%PE+">timer</variable><variable id="gKD%iDyA}x49oH=]E{@O">item</variable></variables><block type="device_button_event" x="0" y="0"><field name="NAME">Button.A</field><statement name="HANDLER"><block type="variables_set"><field name="VAR" id="5rH[22#dxH5~IM6x%PE+">timer</field><value name="VALUE"><shadow type="math_number"><field name="NUM">10</field></shadow></value><next><block type="device_while"><value name="COND"><shadow type="logic_boolean"><field name="BOOL">TRUE</field></shadow><block type="logic_compare"><field name="OP">GT</field><value name="A"><shadow type="math_number"><field name="NUM">0</field></shadow><block type="variables_get"><field name="VAR" id="5rH[22#dxH5~IM6x%PE+">timer</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block></value><statement name="DO"><block type="automationbit_set_output"><field name="output">automationbit.Output.Two</field><value name="state"><shadow type="math_number_minmax"><mutation min="0" max="1" label="State" precision="0"/><field name="SLIDER">1</field></shadow></value><next><block type="automationbit_set_output"><field name="output">automationbit.Output.One</field><value name="state"><shadow type="math_number_minmax"><mutation min="0" max="1" label="State" precision="0"/><field name="SLIDER">1</field></shadow></value></block></next></block></statement><next><block type="variables_set"><field name="VAR" id="5rH[22#dxH5~IM6x%PE+">timer</field><value name="VALUE"><shadow type="math_number"><field name="NUM">2</field></shadow></value><next><block type="device_while"><value name="COND"><shadow type="logic_boolean"><field name="BOOL">TRUE</field></shadow><block type="logic_compare"><field name="OP">GT</field><value name="A"><shadow type="math_number"><field name="NUM">0</field></shadow><block type="variables_get"><field name="VAR" id="5rH[22#dxH5~IM6x%PE+">timer</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block></value><statement name="DO"><block type="automationbit_set_output"><field name="output">automationbit.Output.One</field><value name="state"><shadow type="math_number_minmax"><mutation min="0" max="1" label="State" precision="0"/><field name="SLIDER">1</field></shadow></value><next><block type="automationbit_set_output"><field name="output">automationbit.Output.Two</field><value name="state"><shadow type="math_number_minmax"><mutation min="0" max="1" label="State" precision="0"/><field name="SLIDER">0</field></shadow></value></block></next></block></statement></block></next></block></next></block></next></block></statement></block><block type="device_forever" x="358" y="1"><statement name="HANDLER"><block type="device_pause"><value name="pause"><shadow type="timePicker"><field name="ms">1000</field></shadow></value><next><block type="variables_change"><field name="VAR" id="5rH[22#dxH5~IM6x%PE+">timer</field><value name="VALUE"><shadow type="math_number"><field name="NUM">-1</field></shadow></value></block></next></block></statement></block><block type="device_button_event" x="359" y="208"><field name="NAME">Button.B</field><statement name="HANDLER"><block type="automationbit_set_output"><field name="output">automationbit.Output.One</field><value name="state"><shadow type="math_number_minmax"><mutation min="0" max="1" label="State" precision="0"/><field name="SLIDER">0</field></shadow></value><next><block type="automationbit_set_output"><field name="output">automationbit.Output.Two</field><value name="state"><shadow type="math_number_minmax"><mutation min="0" max="1" label="State" precision="0"/><field name="SLIDER">0</field></shadow></value></block></next></block></statement></block></xml>',
    'main.ts':
      'let timer = 0\ninput.onButtonPressed(Button.B, function () {\n    automationbit.setOutput(automationbit.Output.One, 0)\n    automationbit.setOutput(automationbit.Output.Two, 0)\n})\ninput.onButtonPressed(Button.A, function () {\n    timer = 10\n    while (timer > 0) {\n        automationbit.setOutput(automationbit.Output.Two, 1)\n        automationbit.setOutput(automationbit.Output.One, 1)\n    }\n    timer = 2\n    while (timer > 0) {\n        automationbit.setOutput(automationbit.Output.One, 1)\n        automationbit.setOutput(automationbit.Output.Two, 0)\n    }\n})\nbasic.forever(function () {\n    basic.pause(1000)\n    timer += -1\n})\n',
    'pxt.json':
      '{\n    "name": "OilSpillCleanerUpper",\n    "description": "",\n    "dependencies": {\n        "core": "*",\n        "radio": "*",\n        "automationbit": "github:pimoroni/pxt-automationbit#v0.0.2"\n    },\n    "files": [\n        "main.blocks",\n        "main.ts",\n        "README.md"\n    ],\n    "targetVersions": {\n        "branch": "v1.2.13",\n        "tag": "v1.2.13",\n        "commits": "https://github.com/Microsoft/pxt-microbit/commits/5d5b348757b15c6d00f5b7f560fd69592ca29424",\n        "target": "1.2.13",\n        "pxt": "4.4.7"\n    },\n    "preferredEditor": "blocksprj"\n}\n',
  },
};

export const projectWithTwoExtensions = {
  text: {
    'README.md': '',
    'main.blocks':
      '<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="ljE!0Ymj{L@_|6/*ztir">strip</variable></variables><block type="pxt-on-start" x="0" y="0"><statement name="HANDLER"><block type="variables_set"><field name="VAR" id="ljE!0Ymj{L@_|6/*ztir">strip</field><value name="VALUE"><shadow xmlns="http://www.w3.org/1999/xhtml" type="math_number"><field name="NUM">0</field></shadow><block type="neopixel_create"><field name="pin">DigitalPin.P0</field><field name="mode">NeoPixelMode.RGB</field><value name="numleds"><shadow type="math_number"><field name="NUM">24</field></shadow></value></block></value><next><block type="servoservosetangle"><field name="servo">servos.P0</field><value name="degrees"><shadow type="protractorPicker"><field name="angle">90</field></shadow></value><next><block type="neopixel_set_strip_rainbow"><value name="strip"><block type="variables_get"><field name="VAR" id="ljE!0Ymj{L@_|6/*ztir">strip</field></block></value><value name="startHue"><shadow type="math_number"><field name="NUM">1</field></shadow></value><value name="endHue"><shadow type="math_number"><field name="NUM">360</field></shadow></value></block></next></block></next></block></statement></block></xml>',
    'main.ts':
      'let strip = neopixel.create(DigitalPin.P0, 24, NeoPixelMode.RGB)\nservos.P0.setAngle(90)\nstrip.showRainbow(1, 360)\n',
    'pxt.json':
      '{\n    "name": "TwoExtensions",\n    "description": "",\n    "dependencies": {\n        "core": "*",\n        "radio": "*",\n        "servo": "*",\n        "neopixel": "github:microsoft/pxt-neopixel#v0.7.3"\n    },\n    "files": [\n        "main.blocks",\n        "main.ts",\n        "README.md"\n    ],\n    "targetVersions": {\n        "branch": "v3.0.17",\n        "tag": "v3.0.17",\n        "commits": "https://github.com/microsoft/pxt-microbit/commits/414403fca5144b77b5c4944174a1a4f2144af5fe",\n        "target": "3.0.17",\n        "pxt": "6.0.18"\n    },\n    "preferredEditor": "blocksprj"\n}\n',
  },
};

export const strawbeesExample = {
  text: {
    'main.blocks':
      '<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="9Ycj,YrC;+Mj#,Bft8AP">strip</variable></variables><block type="pxt-on-start" x="0" y="0"><statement name="HANDLER"><block type="variables_set"><field name="VAR" id="9Ycj,YrC;+Mj#,Bft8AP">strip</field><value name="VALUE"><shadow xmlns="http://www.w3.org/1999/xhtml" type="math_number"><field name="NUM">0</field></shadow><block type="neopixel_create"><field name="pin">DigitalPin.P0</field><field name="mode">NeoPixelMode.RGB</field><value name="numleds"><shadow type="math_number"><field name="NUM">24</field></shadow></value></block></value><next><block type="sb_setRgbLedColor"><value name="rgbLed"><shadow type="sb_rgbLed"><field name="label">SBRgbLed.RgbLedA</field></shadow></value><value name="color"><shadow type="sb_color"><field name="label">SBColor.Red</field></shadow></value><next><block type="servoservorun"><field name="servo">servos.P0</field><value name="speed"><shadow type="speedPicker"><field name="speed">50</field></shadow></value></block></next></block></next></block></statement></block></xml>',
    'main.ts':
      'let strip = neopixel.create(DigitalPin.P0, 24, NeoPixelMode.RGB)\nsb.setRgbLedColor(sb.rgbLed(SBRgbLed.RgbLedA), sb.color(SBColor.Red))\nservos.P0.run(50)\n',
    'README.md': ' ',
    'pxt.json':
      '{\n    "name": "Untitled",\n    "description": "",\n    "dependencies": {\n        "core": "*",\n        "radio": "*",\n        "microphone": "*",\n        "Strawbees Robotic Inventions": "github:strawbees/pxt-robotic-inventions#v0.1.8"\n    },\n    "files": [\n        "main.blocks",\n        "main.ts",\n        "README.md"\n    ],\n    "preferredEditor": "blocksprj"\n}\n',
    '.simstate.json': '{}',
  },
};

export const projectWithMelody = {
  text: {
    'main.blocks':
      '<xml xmlns="https://developers.google.com/blockly/xml"><block type="pxt-on-start" x="0" y="0"><statement name="HANDLER"><block type="playMelody"><value name="melody"><shadow type="melody_editor"><field name="melody">"C5 B A G F E D C "</field></shadow></value><value name="tempo"><shadow type="math_number_minmax"><mutation min="40" max="500" label="Tempo" precision="0"/><field name="SLIDER">120</field></shadow></value></block></statement></block></xml>',
    'main.ts': 'music.playMelody("C5 B A G F E D C ", 120)\n',
    'README.md': ' ',
    'pxt.json':
      '{\n    "name": "Untitled",\n    "description": "",\n    "dependencies": {\n        "core": "*",\n        "radio": "*"\n    },\n    "files": [\n        "main.blocks",\n        "main.ts",\n        "README.md"\n    ],\n    "preferredEditor": "blocksprj"\n}\n',
    '.simstate.json': '{}',
  },
};

export const projectWithDatalogging = {
  text: {
    'main.blocks':
      '<xml xmlns="https://developers.google.com/blockly/xml"><block type="pxt-on-start" x="0" y="0"><statement name="HANDLER"><block type="dataloggerlog" inline="true"><mutation xmlns="http://www.w3.org/1999/xhtml" _expanded="0" _input_init="true"></mutation><value name="data1"><shadow type="dataloggercreatecolumnvalue"><value name="column"><shadow type="datalogger_columnfield"><field name="column">"foo"</field></shadow></value><value name="value"><shadow type="math_number"><field name="NUM">1</field></shadow></value></shadow></value><value name="data2"><shadow type="dataloggercreatecolumnvalue"><value name="column"><shadow type="datalogger_columnfield"><field name="column">""</field></shadow></value><value name="value"><shadow type="math_number"><field name="NUM">0</field></shadow></value></shadow></value><value name="data3"><shadow type="dataloggercreatecolumnvalue"><value name="column"><shadow type="datalogger_columnfield"><field name="column">""</field></shadow></value><value name="value"><shadow type="math_number"><field name="NUM">0</field></shadow></value></shadow></value><value name="data4"><shadow type="dataloggercreatecolumnvalue"><value name="column"><shadow type="datalogger_columnfield"><field name="column">""</field></shadow></value><value name="value"><shadow type="math_number"><field name="NUM">0</field></shadow></value></shadow></value><value name="data5"><shadow type="dataloggercreatecolumnvalue"><value name="column"><shadow type="datalogger_columnfield"><field name="column">""</field></shadow></value><value name="value"><shadow type="math_number"><field name="NUM">0</field></shadow></value></shadow></value><value name="data6"><shadow type="dataloggercreatecolumnvalue"><value name="column"><shadow type="datalogger_columnfield"><field name="column">""</field></shadow></value><value name="value"><shadow type="math_number"><field name="NUM">0</field></shadow></value></shadow></value><value name="data7"><shadow type="dataloggercreatecolumnvalue"><value name="column"><shadow type="datalogger_columnfield"><field name="column">""</field></shadow></value><value name="value"><shadow type="math_number"><field name="NUM">0</field></shadow></value></shadow></value><value name="data8"><shadow type="dataloggercreatecolumnvalue"><value name="column"><shadow type="datalogger_columnfield"><field name="column">""</field></shadow></value><value name="value"><shadow type="math_number"><field name="NUM">0</field></shadow></value></shadow></value><value name="data9"><shadow type="dataloggercreatecolumnvalue"><value name="column"><shadow type="datalogger_columnfield"><field name="column">""</field></shadow></value><value name="value"><shadow type="math_number"><field name="NUM">0</field></shadow></value></shadow></value><value name="data10"><shadow type="dataloggercreatecolumnvalue"><value name="column"><shadow type="datalogger_columnfield"><field name="column">""</field></shadow></value><value name="value"><shadow type="math_number"><field name="NUM">0</field></shadow></value></shadow></value></block></statement></block></xml>',
    'main.ts': 'datalogger.log(datalogger.createCV("foo", 1))\n',
    'README.md': ' ',
    'pxt.json':
      '{\n    "name": "Untitled",\n    "description": "",\n    "dependencies": {\n        "core": "*",\n        "radio": "*",\n        "microphone": "*",\n        "datalogger": "*"\n    },\n    "files": [\n        "main.blocks",\n        "main.ts",\n        "README.md"\n    ],\n    "preferredEditor": "blocksprj"\n}\n',
  },
};

export const initialProject = {
  text: {
    'main.blocks':
      '<xml xmlns="http://www.w3.org/1999/xhtml">\n  <variables></variables>\n</xml>',
    'main.ts': '\n',
    'README.md': ' ',
    'pxt.json':
      '{\n    "name": "Untitled",\n    "dependencies": {\n        "core": "*"\n , "radio": "*"\n     },\n    "description": "",\n    "files": [\n        "main.blocks",\n        "main.ts",\n        "README.md"\n    ],\n    "preferredEditor": "blocksprj"\n}',
  },
};

export const projectWithCustomBlock: Project = {
  text: {
    'README.md': '',
    'custom.ts':
      '//% color="#8888FF"\nnamespace something {\n    //% block\n    export function myCustomFunction(): void {\n        basic.showString("hello")\n    }\n}',
    'main.blocks':
      '<xml xmlns="https://developers.google.com/blockly/xml"><block type="pxt-on-start" x="0" y="0"><statement name="HANDLER"><block type="something_myCustomFunction"></block></statement></block></xml>',
    'main.ts': 'something.myCustomFunction()\n',
    'pxt.json':
      '{\n    "name": "Untitled",\n    "description": "",\n    "dependencies": {\n        "core": "*",\n        "radio": "*",\n        "microphone": "*"\n    },\n    "files": [\n        "main.blocks",\n        "main.ts",\n        "README.md",\n        "custom.ts"\n    ],\n    "targetVersions": {\n        "branch": "v6.0.28",\n        "tag": "v6.0.28",\n        "commits": "https://github.com/microsoft/pxt-microbit/commits/9d308fa3c282191768670a6558e4df8af2d715cf",\n        "target": "6.0.28",\n        "pxt": "9.0.19"\n    },\n    "preferredEditor": "tsprj"\n}\n',
  },
};

export const projectWithUserLayout: Project = {
  text: {
    'README.md': '',
    'main.blocks':
      '<xml xmlns="https://developers.google.com/blockly/xml"><block type="device_button_event" x="-5" y="-15"><field name="NAME">Button.A</field></block><block type="pxt-on-start" x="294" y="135"><statement name="HANDLER"><block type="device_show_leds"><field name="LEDS">`\n        # . . . # \n        . . . . . \n        . . # . . \n        . . . . . \n        # . . . #\n        `</field></block></statement></block><block type="radio_on_number_drag" x="92" y="262"><value name="HANDLER_DRAG_PARAM_receivedNumber"><shadow type="argument_reporter_number"><field name="VALUE">receivedNumber</field></shadow></value></block><block type="device_unplot" disabled="true" x="85" y="551"><value name="x"><shadow type="math_number_minmax" disabled="true"><mutation min="0" max="4" label="X" precision="1"></mutation><field name="SLIDER">0</field></shadow></value><value name="y"><shadow type="math_number_minmax" disabled="true"><mutation min="0" max="4" label="Y" precision="1"></mutation><field name="SLIDER">0</field></shadow></value></block></xml>',
    'main.ts':
      'radio.onReceivedNumber(function (receivedNumber) {\n\t\n})\ninput.onButtonPressed(Button.A, function () {\n\t\n})\nbasic.showLeds(`\n    # . . . #\n    . . . . .\n    . . # . .\n    . . . . .\n    # . . . #\n    `)\n',
    'pxt.json':
      '{\n    "name": "untitled",\n    "description": "",\n    "dependencies": {\n        "core": "*",\n        "radio": "*",\n        "microphone": "*"\n    },\n    "files": [\n        "main.blocks",\n        "main.ts",\n        "README.md"\n    ],\n    "preferredEditor": "blocksprj"\n}\n',
    '.simstate.json': '{}',
  },
};
