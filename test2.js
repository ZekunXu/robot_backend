
const stringCode = "/assets/img/wwRobot202104151701525626.png";

let abc;


if( stringCode.startsWith('http:') ) {

    abc = stringCode.slice(28);

}

console.log(abc);