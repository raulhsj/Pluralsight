const EventEmitter = require('events');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = new EventEmitter();
const server = require('./server')(client);

server.on('response', (resp) => {
  // console.log(`Resp: ${resp}`);
  // Clear the terminal
  process.stdout.write('\u001B[2J\u001B[0;0f');
  process.stdout.write(resp);
  // Prompting for commands
  process.stdout.write('\n\> ');
})

rl.on('line', (input) => {
  [command, ...args] = input.split(' ');
  client.emit('command', command, args);
})