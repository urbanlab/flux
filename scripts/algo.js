//Javascript file for sorting functions

const fs   = require('fs');
const path = require('path');

const nbr_people = 1500;

module.exports = {

//Sort all user by time and ask
sort_users: function (clients) {
	prob_array = get_prob_array('./ressources/prob_file.json');
	
	//TODO: Adding algo
	return (prob_array);
}
};

//Get probabilities from a file
function get_prob_array(path_to_file) {
	file = fs.readFileSync(path_to_file, {encoding: 'utf-8'});
	ret = JSON.parse(file);
	return (ret);
};

//Get an index from an hour
function hour_to_index(hour) {
	trunc_hour = parseInt(hour);
	minutes = hour - trunc_hour;
	index = ((trunc_hour - 6) * 4) + Math.round(minutes / 0.15)
	return (index);
};
