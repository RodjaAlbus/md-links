const mdLinks = require("./index.js")
const process = require('process')
const axios = require('axios')
const fs = require("fs")

mdLinks()
    .then((result) => {
        if (process.argv[3] === '--validate' &&
            !process.argv[4]) {
            Promise.all(validateLinks(getLinks(result))).then(console.log)
        }
        else if (process.argv[3] === '--stats' &&
            !process.argv[4]) {
            console.log(getStats(getLinks(result)))
        }
        else if (process.argv[3] === '--stats' &&
            process.argv[4] === '--validate') {
            Promise.all(validateLinks(getLinks(result))).then(data => console.log(getStats(data)))
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
    return result.map(element => axiosLink(element))
}

const axiosLink = (element) => axios.get(element.href)
    .then(result => {
        return { href: element.href, text: element.text, status: result.status, satusText: result.statusText }
    })
    .catch(() => {
        return { href: element.href, text: element.text, status: 'NA', satusText: 'fail' }
    })

const getStats = (links) => {
    let total = links.length
    for (let i = 0; i < total; i++) {
        let duplicate = 0
        for (let j = 0; j < total; j++) {
            if (i !== j) {
                if (links[i].href === links[j].href) {
                    duplicate++
                    links[i].duplicate = duplicate
                    links.splice(j, 1, '')
                }
            }
        }
    }
    let unique = 0
    let broken = 0
    links.forEach(element => {
        if (element.href && !element.duplicate) {
            unique++
        }
        if (element.status && (element.status != "200" &&
            element.status != "301" &&
            element.status != "302")) {
            broken++
        }
    })
    return links[0].status
        ? stats = { Total: total, Unique: unique, Broken: broken }
        : stats = { Total: total, Unique: unique }
}