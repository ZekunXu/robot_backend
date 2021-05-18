const axios = require('axios');
const fs = require('fs');
const download = require('download');


Promise
    .resolve()
    .then(async ()=>{

        const url = "https://wallpaperaccess.com/download/high-resolution-4k-508751";
    
        console.log('a');

        await download(url, './file', {filename: 'abc.png'});

        console.log('b');
    })