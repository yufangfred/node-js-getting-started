// Read Synchrously
var fs = require("fs");
console.log("\n *START* \n");
var content = fs.readFileSync("content.txt");
console.log("Output Content : \n"+ content);
console.log("\n *EXIT* \n");