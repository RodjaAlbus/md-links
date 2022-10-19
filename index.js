const fs = require('fs')
const path = require('path')
const process = require('process')

/*module.exports.readFile = (fileName) => {
    fs.readFile(fileName, 'utf-8', (error, data) =>{
        if(error) console.log(error)
        else console.log(data)
    })
}

module.exports.readDir = (dirName) => {
    fs.readdir(dirName, (error, archivos) => {
        archivos.forEach(archivo =>{
            console.log(archivo)
            console.log(path.extname(archivo))
        })
    })
}

module.exports.joinPath = (paths, paths2) => {
    
    console.log(path.join(paths, paths2))
}

//console.log(module)*/


module.exports.readFile = () => {
    //process.argv = [node, readDocument.js, ./, ./carpeta]   
    const initialDir = process.argv[2]
    fs.readdir(initialDir, (err, archivos) => {
        if (err) console.log(err)
        else {
            archivos.forEach(archivo => {
                if (path.extname(archivo) === '.md') {
                    fs.readFile(path.join(initialDir, archivo), 'utf-8', (error, data) =>{
                        if(error) console.log('error: ', error)
                        else { 
                            console.log('Found: ', archivo) 
                            //find links
                        }
                    })


                } else if (!archivo.includes('.')) {
                    process.argv[2] = path.join(initialDir, archivo)
                    console.log(process.argv[2])
                    this.readFile()
                }
            })
        }
    })
}

