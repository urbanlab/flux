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

function extract(Rinitial, s, e, Num)
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

function get_rand_index(soft, rand_float)
{
	var prev = soft[0];
	var next = 0;
	var i = 1;

	for (i in soft) {
		next = Number(soft[i]) + prev;
		if (prev <= rand_float && rand_float <= next)
			return (i - 1);
		prev = next;
		i = Number(i) + 1;
	}
	return (-1);
}

function random_from_probability(vector, s, e, num)
{
	var extracted = extract(vector, s, e, num);
	var soft = my_softmax(extracted);
	var rand_float = Math.random().toFixed(4);
	return get_rand_index(soft, rand_float);
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

function index2hour(index) {
	hour = Math.floor((index / 4) + 6);
	minutes = Math.floor(index % 4) * 15;
	if (minutes < 10)
		minutes = '0' + minutes;
	return (hour + ':' + minutes);
}

function getRandIndex(softab) {
	var rando = Math.random();
	var prev  = softab[0];
	var next  = softab[1] + prev;

	for (var i = 0 in softab) {
		if (prev <= rando && rando <= next) {
			break;
		} else {
			prev = next;
			next = softab[i] + prev;
		}
	}

}

function time2index(time) {
    var res = /([0-9]{1,2}):([0-9]{2})/.exec(time);
    if(res) {
        var hours = res[1];
        var minutes = res[2];
        var timeIndex = (hours - 6) * 4 + Math.ceil(minutes / 15);
        if(timeIndex < 0) {
            timeIndex = 0;
        } else if(timeIndex > 24) {
            timeIndex = 24;
        }
        return timeIndex;
    } else {
        return undefined;
    }
}
function getSuggestedTime(client, histo, start, end)
{
	console.log(start);
	console.log(end);
	if (end != start)
		rando = Math.floor((Math.random() * 10000000)) % (end - start) + start;
	else
		rando = end;
	console.log('Rando = ', rando);
	return (index2hour(rando));
}


function getTimeMove(client, histo, index)
{
	console.log('client time = ', client.time);
	console.log('histo time = ', histo[index]);
	var value = Math.ceil(Number(client.time) + Number(histo[index]) * 0.8);
	return (value);
}

module.exports = {
    updateVisu: function (visu, clients, sockets) {
        console.log("Updating repartition: ", clients);
		HT = prob_array;
		for (var clientId in clients) {
			console.log("Reaffectation profile",clientId, ":", clients[clientId]);
			if (!(clients[clientId]['start'] === undefined) && !(clients[clientId]['end'] === undefined)) {
				HT = make_histo(HT, clients[clientId]['start'], clients[clientId]['end'], Number(clients[clientId]['count']));
				if(sockets[clientId]) {
					var time = getSuggestedTime(clients[clientId], HT, clients[clientId]['start'], clients[clientId]['end']);
                    			sockets[clientId].emit('suggestion', time);
					sockets[clientId].emit('time-move', getTimeMove(clients[clientId], probabilite, time2index(time)));
				}
			}
		}
		visu.emit('histogram', scale_histogram(HT,150));
		visu.emit('times', ['8:00', '8:00', '8:00']);
    },
    scale_histogram: scale_histogram
}
