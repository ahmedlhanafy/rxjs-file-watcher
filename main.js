const { filter, map, switchMap } = require('rxjs/operators');
const {
  createFileWatcherStream,
  createExecutionStream,
  extractDir,
} = require('./utils.js');

const fileWatcher$ = createFileWatcherStream('./libs');

fileWatcher$
  .pipe(
    map(arr => arr[1]),
    map(extractDir),
    filter(dir => dir === undefined || dir === ''),
    switchMap(createExecutionStream),
  )
  .subscribe();
