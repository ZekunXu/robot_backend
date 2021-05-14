const axios = require('axios');
const GLOBAL_PARAM = require('./lib/global_param.js');





async function abc () {

    await axios.post(
        "http://localhost:3000/api/updateDB/insert", 
        {
            "appName": "test",
            "version": "1.0",
            "build": -1
        },
        {
            headers: {authorization: `Bearer ${GLOBAL_PARAM.BEARTOKEN_FOR_DB}`}
        }
    )
    .then((value)=>{
        console.log(value.data);
    })
    .catch((err)=>{
        console.log(err);
    })


}

abc ();