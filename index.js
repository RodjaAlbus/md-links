const fs = require('fs')
const path = require('path')
const process = require('process')

let httpsArray = []

const fileReader = (archivo, data) => {
    let text = ''
    for (let i = 0; i < data.length; i++) {//find links
        if (data[i] === '(' &&
            data[i + 1] === "h" &&
            data[i + 2] === "t" &&
            data[i + 3] === "t" &&
            data[i + 4] === "p") {
            for (let y = i; y < data.length; y--) {
                if (data[y] === "[") {
                    text = data.substring(y - 1, i)
                    break
                }
            }
            for (let x = i; x < data.length; x++) {
                if (data[x] === ')') {
                    httpsArray.push({ href: data.substring(i, x + 1), text: text, file: archivo })
                    break
                }
            }
        }
    }
}

module.exports.readFile = () => {
    //Ahora hacerlo promesa. Y hacer que tenga validate y status. 
    if (path.extname(process.argv[2]) === '.md') {
        fs.readFile(process.argv[2], 'utf-8', (error, data) => {
            if (error) console.log(error)
            else fileReader(process.argv[2], data); console.log(httpsArray) 
        })
    }
    else {
        const initialDir = process.argv[2]
        fs.readdir(initialDir, (err, archivos) => {
            if (err) console.log(err)
            else {
                archivos.forEach(archivo => {
                    if (path.extname(archivo) === '.md') {
                        const compoundPath = path.join(initialDir, archivo)
                        fs.readFile(compoundPath, 'utf-8', (error, data) => {
                            if (error) console.log('error: ', error)
                            else fileReader(compoundPath, data); console.log(httpsArray)
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
}

