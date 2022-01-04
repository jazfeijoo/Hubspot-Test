const express = require('express');
const router = express.Router();
const axios = require('axios')

const url = 'https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=a168c48ca7c2e3962934e8f21bdb'
const postUrl = 'https://candidate.hubteam.com/candidateTest/v3/problem/result?userKey=a168c48ca7c2e3962934e8f21bdb'
let sessions = {}

router.get('/', async (req, res, next) => {
  let fin = await axios.get(url)
  let data = fin.data
  let eventsArr = data.events

  let visitorId = eventsArr.map((item) => {
    return item['visitorId']
  })
  let uniqueIds = [...new Set(visitorId)]
  //console.log(uniqueIds)

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
    } else {
      //ID exists...add new session or add to current?
      let sessionsArr = sessions[currId]
      for(let i=0; i < sessionsArr.length; i++){
        let currSession = sessionsArr[i]
        let startMin = new Date (currSession['startTime']).getMinutes()
        let endMin = new Date (currSession['startTime'] + currSession['duration']).getMinutes()
        let currMin = new Date(currTimeStamp).getMinutes()
        if (startMin - 10 <= currMin && currMin <= endMin + 10){
          currSession['pages'].push(currUrl)
          return 
        } 
        sessionsArr.push({
          'duration': 0,
          'pages': [currUrl],
          'startTime': currTimeStamp
        })
        

      } //end of for 
    }
  }

  axios.post(postUrl, {'sessionsByUser': sessions})
  res.status(200).send({'sessionsByUser': sessions})  
})

module.exports = router;


// let y = new Date(1512711000000).getMinutes()
// let t = new Date(1512709065294).getMinutes()
// let r = new Date(1512709024000).getMinutes()

// console.log(t-r)