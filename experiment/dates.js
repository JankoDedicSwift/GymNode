


var date1 = new Date("2019/06/07");
var date2 = new Date("2019/06/08");
var Difference_In_Time = date2.getTime() - date1.getTime();
var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

console.log(Difference_In_Days);

function compareWithToday(date) {
    if (date == null) {
        return null
    }
    const date1 = new Date();
    const date2 = new Date(date);
    const Difference_In_Time = date2.getTime() - date1.getTime();
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    console.log("FuckMe", Difference_In_Days);
    return Math.round(Difference_In_Days)
}

module.exports.log = compareWithToday;