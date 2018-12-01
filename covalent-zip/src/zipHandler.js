import JSZip from 'jszip'

var zipFile

function getFolderDepth (pth) {
  return pth.split('/').length - 1
}

var funcs = {
  loadFile: (fileObj, callback) => {
    var reader = new FileReader()

    // Read file to and give to JSZip
    reader.onloadend = (readerOutput) => {
      zipFile = new JSZip()
      zipFile.loadAsync(reader.result)
        .then((zip) => {
          callback(null, zip)
        })
        .catch((err) => {
          callback(err, null)
        })
    }
    reader.readAsArrayBuffer(fileObj)
  },

  filesInPath: (relativePath) => {
    // E.G /files/folder/image.png is depth 2
    var folderDepth = getFolderDepth(relativePath)
    var returnVals = {
      files: [],
      folders: []
    }

    for (let f in zipFile.files) {
      // We don't count ourselves as an empty file
      if (f === relativePath) {
        continue
      }

      if (f.includes(relativePath)) {
        const fDepth = getFolderDepth(f)
        const relName = f.replace(relativePath, '')

        if (fDepth === folderDepth) {
          // It's a file
          returnVals.files.push(relName)
          continue
        }
        if ((fDepth === folderDepth + 1) && /\/$/.test(f)) {
          // It's a sub-folder!
          returnVals.folders.push(relName.replace('/', ''))
        }
      }
    }

    return returnVals
  },

  getFileAsBlob: (relName, callback) => {
    zipFile.file(relName).async('blob')
      .then((fBlob) => { callback(null, fBlob) })
      .catch((err) => { callback(err, null) })
  },

  createNew: () => {
    zipFile = new JSZip()
  },

  getZipAsBlob: (callback) => {
    zipFile.generateAsync({ type: 'blob' })
      .then((blob) => {
        callback(null, blob)
      }, (err) => {
        callback(err, null)
      })
  },

  createFolder: (folderName) => {
    zipFile.folder(folderName)
  },

  addFile: (fileObj, fileName, callback) => {
    var reader = new FileReader()
    reader.onloadend = (fileOut) => {
      zipFile.file(fileName, fileOut.result)
      callback(true)
    }
    reader.onerror = (err) => {
      console.log(err)
      callback(false)
    }
    reader.readAsArrayBuffer(fileObj)
  }
}

export default funcs
