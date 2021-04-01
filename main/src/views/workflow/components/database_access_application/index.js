'use strict'
const _getBinaryFromXHR = function(xhr) {
  return xhr.response || xhr.responseText
}

function createStandardXHR() {
  try {
    return new window.XMLHttpRequest()
  } catch (e) {
    console.error(e)
  }
}
const createXHR = createStandardXHR

const getfile = function(path, options) {
  let callback

  if (!options) {
    options = {}
  }

  if (typeof options === 'function') {
    callback = options
    options = {}
  } else if (typeof options.callback === 'function') {
    callback = options.callback
  }

  const resolve = function(data) { callback(null, data) }
  const reject = function(err) { callback(err, null) }

  try {
    const xhr = createXHR()

    xhr.open('GET', path, true)

    if ('responseType' in xhr) {
      xhr.responseType = 'arraybuffer'
    }

    if (xhr.overrideMimeType) {
      xhr.overrideMimeType('text/plain; charset=x-user-defined')
    }

    xhr.onreadystatechange = function(event) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) {
          try {
            resolve(_getBinaryFromXHR(xhr))
          } catch (err) {
            reject(new Error(err))
          }
        } else {
          reject(new Error('Ajax error for ' + path + ' : ' + this.status + ' ' + this.statusText))
        }
      }
    }

    if (options.progress) {
      xhr.onprogress = function(e) {
        options.progress({
          path: path,
          originalEvent: e,
          percent: e.loaded / e.total * 100,
          loaded: e.loaded,
          total: e.total
        })
      }
    }

    xhr.send()
  } catch (e) {
    reject(new Error(e), null)
  }
}

export default getfile
