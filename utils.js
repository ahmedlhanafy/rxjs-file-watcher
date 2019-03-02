const { spawn } = require('child_process');
var kill = require('tree-kill');
const chokidar = require('chokidar');
const { Observable } = require('rxjs');

const createFileWatcherStream = relativePath =>
  Observable.create(observer => {
    watchDir(relativePath, (...args) => observer.next(args));
  });

const watchDir = (relativePath, cb) =>
  chokidar
    .watch(relativePath, {
      ignored: /(node_modules|package-lock.json|hello-world)/,
      ignoreInitial: true
    })
    .on('all', cb);

const extractDir = path => path.split('/')[1];

const createExecutionStream = dir =>
  new Observable(subscriber => {
    const execution = spawn(`cd libs/${dir} && ng new hello-world`, {
      shell: true,
    });

    execution.stdout.on('data', data => {
      console.log(data.toString());
    });

    execution.stderr.on('data', data => {
      console.log(data.toString());
    });

    execution.on('exit', code => {
      console.log('child process exited with code ' + code);
    });

    return () => execution.kill();
  });

module.exports = {
  createFileWatcherStream,
  extractDir,
  createExecutionStream,
};
