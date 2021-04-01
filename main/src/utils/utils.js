export function modules(files, Exclude = []) {
  return files.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    if (!Exclude.includes(moduleName)) {
      const value = files(modulePath)
      modules[moduleName] = value || value.default
    }
    return modules
  }, {})
}
const utilsFile = require.context('./', false, /\.js$/)
const utils = modules(utilsFile, ['utils', 'element-ui', 'error-log', 'request_response', 'request', 'request2'])

const vendorFile = require.context('./../vendor', false, /\.js$/)
const vendor = modules(vendorFile)
export default {
  vendor,
  ...utils
}
