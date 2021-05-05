var spawn = require("child_process").spawn;

var py    = spawn('python', ['abc.py']);
var data = [1,2,3,4,5,6,7,8,9];
var dataString = '';

py.stdout.on('data', function(data){
    console.log(data.toString())
});
py.stdout.on('end', function(){
    console.log('hahahahah');
});

