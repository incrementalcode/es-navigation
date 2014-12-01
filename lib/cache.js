import {parseBuffer as _parseBuffer} from './parse';
import yshash from 'ys-hash';

//A simple cache wrapping the parser functionality.
var parseCache = new Map();
export function parseBuffer(buffer, path) {
  var hash = hashBuffer(buffer);

  if (parseCache.has(path)) {
    let cache = parseCache.get(path);
    if (cache.hash == hash)
      return cache.data;
  }

  var parsedBuffer = _parseBuffer(buffer, path);
  if (parsedBuffer) {
    parseCache.set(path, {
      data: parsedBuffer,
      hash: hash
    });

    return parsedBuffer;
  }

  return null;

  //INTERNAL parseBuffer
  function hashBuffer(buffer) {
    //Ys-hash is fairly fast.
    //Roughly 1ms hash time on 300Kb files.
    return yshash.hash(buffer);
  }
}

//Clear the cache
export function clearCache() {
  parseCache.clear();
}
