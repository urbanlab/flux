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
    reverse = reverse_proba_special(sub_vect, s, e);
	console.log('reverse = ', reverse);

	new_extract = extract(reverse, s, e, Num)
	console.log('new_extract = ', new_extract);

	reparted = push_extract(sub_vect, new_extract);
	console.log('reparted = ', reparted);

	return reparted;

}

function get_min(sub_vect, s, e)
{
	var min = s;

	for (i = s; i <= e; i++) {
		if (sub_vect[i] < sub_vect[min])
			min = i;
	}
	return (min);
}

function my_repart(sub_vect, s, e , num)
{
	var i = 0;
	var index = 0;

	for (var y = 0; y < num; y++) {
		index = get_min(sub_vect, s, e);
		sub_vect[index]++;
	}
	return (sub_vect);
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

const nbr_people = 1500;

function make_histo (histogram, start, end, num) {
    console.log("Updating histogram start=",start," end=",end, "num=",num);
	extract_vect = extract(histogram, start, end, num);
	console.log('extract = ', extract_vect);

	sub_vect = sub_extract(histogram, extract_vect);
	console.log('sub_vect = ', sub_vect);

	repart = my_repart(sub_vect, start, end, num);
	console.log('repart = ', repart);
	return (repart);
	//repart_mean(sub_vect, start, end, Num);
}

function scale_histogram(hist, n) {
    var pHist = my_softmax(hist);
    console.log(n);
    var rHist = [];
    for(var i=0; i<pHist.length; i++) {
        rHist[i] = Math.round(pHist[i] * n);
    }
    return rHist;
}

module.exports = {
    updateVisu: function (visu, clients) {
        console.log("Updating repartition: ", clients);
		HT = prob_array;
		for (var i in clients) {
			console.log("Reaffectation profile ",i, clients[i]);
			if (clients[i]['start'] && clients[i]['end']) {
				HT = make_histo(HT, clients[i]['start'], clients[i]['end'], 300);
			}
		}
		visu.emit('histogram', scale_histogram(HT,150));
    },
    scale_histogram: scale_histogram
}
