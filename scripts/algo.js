//Javascript file for sorting functions

const fs   = require('fs');
const path = require('path');

function my_softmax (list) {
	var n = 0;
	var e = 0;
	var x = 0;
	var count = 0;
	var soft = [];

	for (e in list) {
		n = Number(n) + Number(list[e]);
	}
	if (n == 0) {
		for (x in list) {
			soft[count] = 0;
			count++;
		}
		return (soft);
	}
	for (x in list) {
		soft[count] = list[x] / n;
		count++;
	}
	return (soft);
}

function reverse_vector (vector) {
	var n = 0;
	var rev = [];

	for (n in vector)
		rev[n] = 1 - vector[n];
	rev = my_softmax(rev);
	return (rev);
}

function reverse_proba (vector) {
	var vec = my_softmax(vector);
	vec = reverse_vector(vec);
	return vec;
}

function reverse_proba_special(vector, s, e) {
	var vec = my_softmax(vector);
	var n = 0;
	var rev = [];

	for (n in vec) {
		if (n >= s && n <= e)
			rev[n] = 1 - vec[n];
		else
			rev[n] = 0;
	}
	rev = my_softmax(rev);
	return (rev);
}

function get_coef(Rinitial, s, e, Num) {
	var i = 0;
	var sum = 0;

	for (i in Rinitial) {
		if (i >= s && i <= e) {
			sum += Number(Rinitial[i]);
		}
	}
	if (sum != 0)
		return (Number(Num) / Number(sum));
	else
		return (0);
}

function extract (Rinitial, s, e, Num)
{
	var i = 0;
	var normalized = my_softmax(Rinitial);
	var extract_vect = [];
	var coef = get_coef(normalized, s, e, Num);
	console.log('coef = ', coef);

	for (i in normalized) {
		if (i >= s && i <= e) {
			extract_vect[i] = Math.round(Number(normalized[i]) * Number(coef));
		} else
			extract_vect[i] = 0;
	}
	return extract_vect;
}

function sub_extract(Rinitial, extract) {
	var i = 0;
	var sub_vect = [];

	for (i in Rinitial)
		sub_vect[i] = Number(Rinitial[i]) - Number(extract[i]);
	return sub_vect;
}

function push_extract(sub_vect, new_extract) {
	var i = 0;
	var add_vect = [];

	for (i in sub_vect)
		add_vect[i] = Number(sub_vect[i]) + Number(new_extract[i]);
	return add_vect;
}

function repart_proba(sub_vect, s, e, Num) {
	console.log('reverse = ', reverse = reverse_proba_special(sub_vect, s, e));
	console.log('new_extract = ', new_extract = extract(reverse, s, e, Num));
	return push_extract(sub_vect, new_extract);
}

function repart_mean(sub_vect, s, e, Num) {
	var sum = 0;
	var little_sum = 0;
	var mean = 0;
	var nb_little = 0;
	var little_mean = 0;
	var repart = [];

	for (var i = s; i <= e; i++)
		sum += Number(sub_vect[i]);
	if ((e - s) != 0)
		mean = (sum + Num) / (e - s);
	for (var i = s; i <=e; i++) {
		if (Number(sub_vect[i]) <= Number(mean)) {
			little_sum += Number(sub_vect[i]);
			nb_little++;
		}
	}
	if (nb_little != 0)
		little_mean = Number(little_sum + 300) / Number(nb_little);
	for (var i in sub_vect)  {
		if (sub_vect[i] <= Number(mean))
			repart[i] = Number(little_sum) - Number(sub_vect[i]);
		else
			repart[i] = 0;
	}
	console.log('MEAN = ', mean);
	console.log('LITTLE = ', little_mean);
	console.log(repart);
}

module.exports = {

//Sort all user by time and ask
sort_users: function () {
	prob_array = get_prob_array('./prob_file.json');
	Num = 600;
	start = 1;
	end = 3;

	console.log('Rinitial =', list =  [100, 500, 1100, 2700, 1200, 400, 200]);
	console.log('extract_vect = ', (extract_vect = extract(list, start, end, Num)));
	console.log('sub_vect = ', (sub_vect = sub_extract(list, extract_vect)));
	console.log('repart = ', repart_proba(sub_vect, start, end, Num));
	repart_mean(sub_vect, start, end, Num);
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
