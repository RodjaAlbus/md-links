const fs = require('fs')
const path = require('path')
const process = require('process')

let directoryArray = []
module.exports = () => new Promise((resolve, reject) => {
    fs.exists(process.argv[2], (exists) => { //Why
        if (exists) {
            if (fs.lstatSync(process.argv[2]).isDirectory()) {
                resolve(dirGatherer(process.argv[2], []))
            }
            else if (path.extname(process.argv[2]) === '.md') {
                resolve([process.argv[2]])
            } else reject('It is not an md file')
        } else reject('The path does not exists')
    })
})

const dirGatherer = (dir, array) => {
    const pathsArray = array
    fs.readdirSync(dir).forEach(file => {
        const compoundPath = path.join(dir, file)
        if (fs.lstatSync(compoundPath).isDirectory()) {
            dirGatherer(compoundPath, pathsArray)
        } else if (path.extname(compoundPath) === '.md') {
            pathsArray.push(compoundPath)
        }
    })
    return pathsArray //No lo regresa hasta que termino de llamarse todas las veces???
}
const dirGathererAzync = (dir, array) => {
    const pathsArray = array
    fs.readdir(dir, (err, data) => {
        data.forEach(file => {
            const compoundPath = path.join(dir, file)
            if (fs.lstatSync(compoundPath).isDirectory()) {
                dirGatherer(compoundPath, pathsArray)
                console.log(pathsArray) // Vemos como se va construyendo el array con cada directorio
            } else if (path.extname(compoundPath) === '.md') {
                pathsArray.push(compoundPath)
            }
        })
    })
    return pathsArray // Lo regresa en el primer estad donde array es solo []
}

/*const dirGatherer = () => {
    if(contition) {
        return 
    }

    dirGatherer()
}*/

const traverseSync = dir => ({
    path: dir,
    children: fs.readdirSync(dir).map(file => {
        const Path = path.join(dir, file);
        return fs.lstatSync(Path).isDirectory() ? traverseSync(Path) : { Path };
    })
});