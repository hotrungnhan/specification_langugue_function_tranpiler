var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function a(...arr) {
    return arr
}
const arr = []
const parramIndex = [0, 2, 3]

rl.on('line', function (line) {
    if (parramIndex.find((value) => value == arr.length) != undefined) {
        arr.push(line.split(" "))
    } else {
        arr.push(line)
    }
    if (arr.length >= 2) {
        console.log(a(...arr))
        rl.close()
    }
})

// console.log("1 2 3 4".split(" "));