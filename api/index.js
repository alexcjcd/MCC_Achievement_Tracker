require('dotenv').config()


import express from 'express'
import axios from "axios";

const cors     = require('cors')
const app      = express()
const config = {
    headers: {
        'X-AUTH': process.env.API_KEY,
        'Content-Type' : 'application/json'
    }
}

 app.all('/:gamertag', cors(), async (req, res) => {

    const userXboxAchievements = await getUserXboxAchievements();
    return res.send(userXboxAchievements);


    async function getUserXboxAchievements() {

        // Gets users needed XUID from XAPI using axio's request.
        const userXUID = await axios.get(`https://xapi.us/v2/xuid/${req.params.gamertag}`, config, {timeout: 5000})
                            .then(response => {
                            //console.log(`${req.params.gamertag}'s xuid retrieved: ${response.data['xuid']}`);
                            return response.data['xuid'];
                            })
                            .catch(error => {
                                console.log(`error: ${error}`);
                                return false;
                            });

        // If XUID is valid, then get JSON of users Halo: The Master Chief Collection achievements using their XUID.
        // https://xapi.us/v2/${userXUID}/achievements/1144039928 - URL for MCC achievements
        if(userXUID) {
        const userXboxAchievements = await axios.get(`https://xapi.us/v2/${userXUID}/achievements/1144039928`, config, {timeout: 5000})
            .then(function (response) {
                const achievementsJSON = response.data
                //console.log("User achievements: " + achievementsJSON);
                return achievementsJSON;
            })
            .catch(function (error) {
             console.log("error! : " + error);
            });

            return userXboxAchievements;
        // If XUID is invalid (i.e. gamertag doesnt exist), return false
        } else {
            return false;
        }
    }

    
    
 })

 module.exports = {
   path: '/api/xbox',
   handler: app
 }