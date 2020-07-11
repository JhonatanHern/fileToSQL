const fs = require('fs')

const path = '/home/wyp/apps/rates-runner/data/dolartoday/'

const dotFilter = arr => arr.filter( str => str[0] !== '.' )

const filenameToTime = name => {
    const data = name.match(/^(\d\d)-(\d\d)\.json$/)
    if (!data) {
        console.log('TIME ERROR, RECEIVED: ', name)
        return null
    }
    return `${data[1]}:${data[2]}:00`
}

fs.readdir(path,(err,years)=>{
    if (err) {
        console.log('error reading first folder')
        console.log(err)
        return
    }
    let res = []
    dotFilter(years).forEach(year=>{
        try{
            let months = dotFilter(fs.readdirSync(`${path}/${year}`))
            months.forEach(month=>{
                try{
                    let days = dotFilter(fs.readdirSync(`${path}/${year}/${month}`))
                    days.forEach(day=>{
                        try{
                            let prices = dotFilter(fs.readdirSync(`${path}/${year}/${month}/${day}`))
                            let lastPrice = -1
                            prices.forEach(time=>{
                                try {
                                    let data = JSON.parse(fs.readFileSync(`${path}/${year}/${month}/${day}/${time}`,'utf8'))
                                    let dayPrice = data['USD']['transferencia']
                                    if (dayPrice !== lastPrice) {
                                        console.log(`INSERT INTO dolartoday (rate,registered_at) VALUES (${dayPrice}, '${year}-${month}-${day} ${filenameToTime(time)}')`)
                                        lastPrice = dayPrice
                                    }
                                } catch (e) {
                                    console.log('DATA ERROR')
                                    Console.LOG(e)
                                }
                            })
                        }catch(e){
                            console.log('DAY ERROR')
                            console.log(e)
                        }
                    })
                }catch(e){
                    console.log('MONTH ERROR')
                    console.log(e)
                }
            })
        }catch(e){
            console.log('YEAR ERROR')
            console.log(e)
        }
    })
})