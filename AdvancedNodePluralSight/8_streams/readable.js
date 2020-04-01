const { Readable } = require('stream');

// const inStream = new Readable();

// inStream.push('ABCDEFG');
// inStream.push(null);

const inStream = new Readable({
  read(size) {
    setTimeout(() => {
      if (this.currentCharCode > 90) {
        this.push(null);
        return;
      }
      this.push(String.fromCharCode(this.currentCharCode++));      
    }, 100);    
  }
});

// 65 = A
inStream.currentCharCode = 65;

inStream.pipe(process.stdout);

process.on('exit', () => {
  // Triggered when node readable.js | head -c3 (read the first 3 characteres only)
  console.error(`\n\ncurrentCharCode is ${inStream.currentCharCode}`);
});

// Avoiding the stack trace error triggered by the above behaviour
process.stdout.on('error', process.exit);