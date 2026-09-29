const { spawn } = require('child_process');

function start(cmd, args, opts) {
  const p = spawn(cmd, args, Object.assign({ stdio: 'inherit', shell: false }, opts));
  p.on('exit', code => {
    if (code !== 0) process.exit(code);
  });
  return p;
}

// Start Vite from root node_modules but set cwd to client
start('node', ['../node_modules/vite/bin/vite.js'], { cwd: 'client' });

// Start server
start('node', ['server/server.js']);
