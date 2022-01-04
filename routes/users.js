const express = require('express');
const router = express.Router();
const axios = require('axios')


const url = 'https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=a168c48ca7c2e3962934e8f21bdb'
//const postURL = 'https://candidate.hubteam.com/candidateTest/v3/problem/result?userKey=a168c48ca7c2e3962934e8f21bdb'

//let fin 
/* GET users listing. */
router.get('/', async (req, res, next) => {
  let fin = await axios.get(url)
  let data = fin.data
  let eventsArr = data.events

  let visitorId = eventsArr.map((item) => {
    return item['visitorId']
  })
  let uniqueIds = [...new Set(visitorId)]
  //console.log(uniqueIds)

  let sessions = {}

  for (let i=0; i<eventsArr.length; i++){
    let currEvent = eventsArr[i]
    let currId = currEvent['visitorId']
    let currUrl = currEvent['url']
    let currTimeStamp = currEvent['timestamp']
    if (!sessions[currId]){
      sessions[currId] = []
      sessions[currId].push({
        'duration': 0,
        'pages': [currUrl],
        'startTime': currTimeStamp

      })
    }
  }

  // let post = async (sessions) => {
  //   await axios.post(url, sessions)
  // }
  // //post();
  res.status(200).send({'sessionsByUser': sessions})  
})

module.exports = router;
