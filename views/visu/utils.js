//Javascript file for sorting functions
//

function color_changer (index, histogram) {
		if (histogram[index] > 9) {
			change10();
		} else if (histogram[index] > 4) {
			change20();
		} else {
			change30();
		}
}


