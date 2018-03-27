//Javascript file for sorting functions



module.exports = {
updateVisu: function (clients) {
		HT = prob_array;
		for (var i in clients) {
			if (clients[i]['start'] && clients[i]['end']) {
				HT = make_histo(HT, clients[i]['start'], clients[i]['end'], 300);
			}
			console.log('histogram = ', HT);
			visu.emit('histogram', HT);
		}
	     },

color_changer: function (index, histogram) {
		if (histogram[index] > 9) {
			change10();
		} else if (histogram[index] > 4) {
			change20();
		} else {
			change30();
		}
	     }
};


