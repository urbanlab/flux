//Javascript file for sorting functions

module.exports = {
updateVisu: function (clients, visu, histogram) {
		console.log(clients);
		var count = 0;
		var sum = 0;
		for(c in clients) {
			if(clients[c]['start']) {
				sum += Number(clients[c]['start']);
				count++;
			}
		}
		console.log('Sum:',sum);
		taux = sum / count;
		console.log('histogram:',histogram);
		visu.emit('histogram',histogram);
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


