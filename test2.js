var abc = "hahahha";

JSON.stringify(abc).replace(/"/g, "").replace(/\'/g, "\"");

console.log(abc);