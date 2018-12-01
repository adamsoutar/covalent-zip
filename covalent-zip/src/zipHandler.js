import JSZip from 'jszip'

var zipFile = undefined

function getFolderDepth(pth) {
  return pth.split('/').length - 1
}

var funcs = {
  loadFile: (fileObj, callback) => {
    var reader = new FileReader()

    // Read file to and give to JSZip
    reader.onloadend = (readerOutput) => {
      zipFile= new JSZip()
      zipFile.loadAsync(reader.result)
      .then(callback)
    }
    reader.readAsArrayBuffer(fileObj)
  },

  filesInPath: (relativePath) => {
    // E.G files/folder/image.png is depth 2
    var folderDepth = getFolderDepth(relativePath)
    var returnVals = {
      files: [],
      folders: []
    }

    for (let f in zipFile.files) {
      // If it's in the folder we're in
      if (f.includes(relativePath)) {
        const fDepth = getFolderDepth(f)
        const relName = f.replace(relativePath, '')

        if (fDepth === folderDepth) {
          // It's a file
          returnVals.files.push(relName)
          continue
        }

        if (fDepth === folderDepth + 1 && /\/$/.test(f)) {
          // It's a sub-folder!
          returnVals.folders.push(relName.replace('/', ''))
        }
      }
    }

    return returnVals
  }
}

export default funcs
