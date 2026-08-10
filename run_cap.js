import { run } from './node_modules/@capacitor/cli/dist/index.js';

const args = process.argv.slice(2);
process.argv = [process.argv[0], './node_modules/@capacitor/cli/bin/capacitor', ...args];
run();
