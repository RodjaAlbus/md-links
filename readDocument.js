const index = require("./index.js")
const process = require('process')
const axios = require('axios')

//index.readFile('README.md')
//index.readDir('./')
//index.joinPath('./home/Laboratoria', "./text.txt")

index()
    .then((result) => {
        // console.log(result)
        if (process.argv[3] === '--validate') {
            result.forEach(element => {
                axios
                    .get(element.href)
                    .then((data) => {
                        element.statuscodigo = data.status
                        element.statustext = data.statusText
                        console.log(result)
                    })
                    //.catch((err) => )
            });


        } else if (!process.argv[3]) console.log('No Validate')
    })
    .catch((error) => { console.log(error) })