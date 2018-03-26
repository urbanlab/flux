//Javascript file for sorting functions

const fs   = require('fs');
const path = require('path');

module.exports = {

//Sort all users
sort_users: function () {
	prob_array = get_prob_array('./prob_file.json');
	
	return (sorted_histogram);
}
};

function get_prob_array(path_to_file) {

	file = fs.readFileSync(path_to_file, {encoding: 'utf-8'});
	ret = JSON.parse(file);
	return (ret);
}
