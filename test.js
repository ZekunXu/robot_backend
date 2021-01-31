

var abc = "abc";

Promise
    .resolve()
    .then(()=>{
        console.log(1);
    })
    .then(()=>{
        console.log(2);
        abc = "123";
    })
    .then(()=>{
        console.log(abc);
        console.log(3);
    })
    .catch((err)=>{
        switch(err){
            case 101:
                console.log(4);
                break;
        }
    })