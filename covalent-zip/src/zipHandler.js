import JSZip from 'jszip'

var file = undefined

var funcs = {
  loadFile: (fileObj, callback) => {
    var reader = new FileReader()

    // Read file to and give to JSZip
    reader.onloadend = (readerOutput) => {
      file = new JSZip()
      file.loadAsync(reader.result)
      .then(callback)
    }
    reader.readAsArrayBuffer(fileObj)
  },

  filesInPath: (relativePath) => {
    for (let f in file) {
      console.log(f)
    }
  }
}

export default funcs
