declare const parser;
parser.addCommand('logs').aliases('log')
      .addOption('f').defaultValue(true).notAcceptValue();
