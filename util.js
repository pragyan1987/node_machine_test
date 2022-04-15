function hour(totalMinutes)
{

    var minutes = totalMinutes % 60;
var hours = (totalMinutes-minutes)/60;
var output = hours + ':' + minutes+ ':'+"00";
return output;
}
module.exports = { hour };