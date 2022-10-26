const mdLinks = require("./index.js")
const process = require('process')
const axios = require('axios')
const fs = require("fs")

mdLinks()
    .then((result) => {
        if (process.argv[3] === '--validate' &&
            !process.argv[4]) {
            console.log(validateLinks(getLinks(result)))
        }
        else if (process.argv[3] === '--stats' &&
            !process.argv[4]) {
            console.log(getStats(result))
        }
        else if (process.argv[3] === '--stats' &&
            process.argv[4] === '--validate') {
            console.log('this: ', statsAndValidation(result))
        }
        else if (!process.argv[3]) {
            console.log(getLinks(result))
        }
    })
    .catch((error) => { console.log(error) })

const getLinks = (result) => {
    let httpsArray = []
    result.forEach(file => {
        const data = fs.readFileSync(file).toString()
        let text = ''
        for (let i = 0; i < data.length; i++) {
            if (data[i] === '(' &&
                data[i + 1] === "h" &&
                data[i + 2] === "t" &&
                data[i + 3] === "t" &&
                data[i + 4] === "p") {
                for (let y = i; y < data.length; y--) {
                    if (data[y] === "[") {
                        text = data.substring(y, i)
                        break
                    }
                }
                for (let x = i; x < data.length; x++) {
                    if (data[x] === ')') {
                        httpsArray.push({ href: data.substring(i + 1, x), text: text, file: file })
                        break
                    }
                }
            }
        }
    })
    return httpsArray
}

const validateLinks = (result) => {
    result.forEach(element => {
        axios
            .get(element.href)
            .then((data) => {
                element.statuscodigo = data.status
                element.statustext = data.statusText
                // console.log(result) //como hacer para que no se impriman tantas veces
            })
            .catch((err) => {
                element.statuscodigo = 'non-existent'
                element.statustext = 'fail'
                //console.log(result)
            })
    })
}

const axiosLink = (link) => axios.get(link)

const getStats = (result) => {
    let total = result.length
    for (let i = 0; i < total; i++) {
        let duplicate = 0
        for (let j = 0; j < total; j++) {
            if (i !== j) {
                if (result[i].href === result[j].href) {
                    duplicate++
                    result[i].duplicate = duplicate
                    result.splice(j, 1, '')
                }
            }
        }
    }
    let unique = 0;
    result.forEach(element => {
        if (element.href && !element.duplicate) {
            unique++
        }
    });
    let stats = { Total: total, Unique: unique }
    return stats
}

const statsAndValidation = (result) => {
    let total = result.length
    for (let i = 0; i < total; i++) {
        let duplicate = 0
        for (let j = 0; j < total; j++) {
            if (i !== j) {
                if (result[i].href === result[j].href) {
                    duplicate++
                    result[i].duplicate = duplicate
                    result.splice(j, 1, '')
                }
            }
        }
    }
    let unique = 0
    let broken = 0
    let validateStats = { Total: total, Unique: unique, Broken: broken }
    result.forEach(element => {
        if (element.href) {
            axios
                .get(element.href)
                .catch(() => {
                    broken++
                    console.log(broken)
                    validateStats.Broken = broken
                    // 
                    //retornar valor obtenido para promises all
                    //simplemente el estatus fallo. 
                })
            if (!element.duplicate) {
                unique++
                validateStats.Unique = unique
            }
        }
    });
    return validateStats
}