//Javascript file for sorting functions

module.exports = {
updateVisu: function (clients, visu) {
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
		console.log('New taux:',taux);
		visu.emit('taux',taux);
	     }
};


