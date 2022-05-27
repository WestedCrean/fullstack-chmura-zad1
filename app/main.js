const express = require('express')
const app = express()
const port = 3000
const axios = require('axios')
const moment = require('moment-timezone')

// GET / -
app.get('/', async (req, res) => {

  const ip = (req.socket.remoteAddress || req.headers['X-Forwarded-For']).split(':')[3]
  let locString = "brak danych"
  let timezone = null
  let timestamp = null

  try {

    // zapytanie do http://ip-api.com/json/<nr-ip> zwraca zwraca dane w formacie JSON
    // nt kraju, regionu, przyblizonego miasta i strefy czasowej
    const loc = await axios.get('http://ip-api.com/json/' + ip)
    timezone = loc.timezone
    if (timezone) {
      locString = `${loc.country}, ${loc.regionName}, ${loc.city}`
      timestamp = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss')
    } else {
      locString = loc.message
    }
    
  } catch (e) {
    console.log(e)
  }  
  
  // serwer wysyla tekst z wszystkimi informacjami
  res.send(`
    <p>Zapytanie z IP: ${ip}, przyblizona lokalizacja: ${locString}</p>
    <p>Czas uzytkownika: ${timestamp}</p>
  `)
})

app.listen(port, () => {
  const date = moment().format('YYYY-MM-DD HH:mm:ss')
  console.log(`Autor: Wiktor Flis, data i czas serwera: ${date}`)
  console.log(`Aplikacja nasluchuje portu ${port}`)
})