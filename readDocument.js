const mdLinks = require("./index.js")
const process = require('process')
const axios = require('axios')

mdLinks()
    .then((result) => {
        if (process.argv[3] === '--validate' &&
        !process.argv[4]) {
            validateLinks(result)
        }
        else if (process.argv[3] === '--stats' &&
        !process.argv[4]) {
            console.log(getStats(result))
        }
        else if (process.argv[3] === '--stats' &&
            process.argv[4] === '--validate') {
            console.log('this: ', statsAndValidation(result))
        }
        else if (!process.argv[3]) console.log(result)
    })
    .catch((error) => { console.log(error) })

const validateLinks = (result) => {
    result.forEach(element => {
        axios
            .get(element.href)
            .then((data) => {
                element.statuscodigo = data.status
                element.statustext = data.statusText 
                console.log(result) //como hacer para que no se impriman tantas veces
            })
            .catch((err) => {
                element.statuscodigo = 'non-existent'
                element.statustext = 'fail'
                console.log(result)
            })
    })
}

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