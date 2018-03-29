var slider;
var histogram;
var trajet;

var time = ['06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45' ,'11:00', '11:15', '11:30', '11:45', '12:00'];
var flux = [
	[600, 880], [600,860], [600, 840], [600,820], [600, 800], [600, 780], [600,760], [600, 740], [600,720], [600, 700], [600, 680], [600,660], [600, 640], [600,620], [600, 600], [600,580], [602,560], [605,540], [609,520], [614,500], [620,480], [627,460], [635,440], [645,420], [656,400], [668,380], [682,360], [700,340], [700,340], [717,320], [740,300], [763,280], [788,260], [820,240], [856,220], [890,205], [925,193], [955,183], [985,176], [1015,170], [1045,167], [1075,165], [1098,165], [1110,190], [1130,205], [1155,220], [1155,240], [1155,260], [1155,280], [1155,300], [1155,320], [1155,340], [1155,360], [1155,380], [1155,400], [1155,420], [1155,440], [1155,460], [1155,480], [1155,500], [1155,520], [1155,540], [1155,560], [1155,580], [1155,600], [1155,620], [1155,640], [1155,660], [1155,680], [1155,700], [1155,720], [1155,740], [1155,760], [1155,780], [1155,800], [1155,820], [1155,840], [1175,850], [1195,850], [1215,850], [1235,850], [1255,850], [1275,850], [1295,850], [1320,850], [1320, 830]
]
//var cars;
//var button;

var congestionMin = 1;
var congestionMax = 13;
var congestionPropagationInitial = 13;
var congestionPropagation = congestionPropagationInitial;
var congestionPropagationFactor = 1.5;
var colorGreen = 120;
var colorRed = 0;

var congestion = 1;

var flashlights = new Array();
var flashlightsDensity = 1;
var flashlightsFramesCountMax = 15;
var flashlightsFramesCount = 0;
var flashlightsSlowFramesCountMax = 5;
var flashlightsSlowFramesCount = 0;
var flashlightsSlowIndex = 43;

function preload() {
  Montserrat = loadFont('/assets-visu/assets/Montserrat-Regular.ttf');
  MontserratBold = loadFont('/assets-visu/assets/Montserrat-Bold.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  img  = loadImage("/assets-visu/assets/bg.png");
  tree = loadImage("/assets-visu/assets/arbre.png");
	autoroute = loadImage("/assets-visu/assets/a6.png");
	histogrey = loadImage("/assets-visu/assets/histogrey.png");
	tram = loadImage("/assets-visu/assets/tram.png")
    console.log('yo');

    /*
    cars = createSlider(0,100,100);
    cars.position(100, 800);
    cars.style('width', '300px');
    */


    slider = createSlider(0, 24, 0, 1);
    slider.position(100, 1040);
    slider.style('width', '0px');
    slider.hide();
    /*
    ten = createButton('10%');
    ten.position(100, 100);
    ten.mousePressed(change10)
    ten.size(100, 100);

    twenty = createButton('20%');
    twenty.position(100, 300);
    twenty.mousePressed(change20)
    twenty.size(100, 100);

    thirty = createButton('30%');
    thirty.position(100, 500);
    thirty.mousePressed(change30)
    thirty.size(100, 100);
    */

}

function updateColor(_histogram, index) {
  histogram = _histogram;
  congestion = histogram[index];

	flashlightsDensity = int(map(congestion, 1, 13, 2000, 500));

  console.log('congestion:',congestion);
}

function updateTrajet(_trajet, index) {
	trajet = _trajet;
	heure = trajet[index];
	console.log('heure', heure);
}

function draw() {
  background(255);


  colorMode(RGB, 360);

	updateTrajet(trajet);
  updateColor(histogram, slider.value());
  var congestionColor = int(map(congestion, congestionMin, congestionMax, colorGreen, colorRed));
  congestionPropagationFactor = map(congestion, congestionMin, congestionMax, 1, 0);

  congestionPropagation = congestionPropagationInitial * congestionPropagationFactor;

  //var clr = cars.value();

  //fill(255)
  //rect(100, 200-congestion*10, 100, congestion*10);

  /*
  if(clr <= 25){
    r = 0;
    g = 255;
    b = 0;

    r1 = 0;
    g1 = 255;
    b1 = 0;

  }else if (clr >= 25 && clr <= 75) {
    r = 255;
    g = 255;
    b = 0;

    r1 = 0;
    g1 = 255;
    b1 = 0;

  }else if (clr >= 75) {
    r = 255;
    g = 0;
    b = 0;

    r1 = 255;
    g1 = 255;
    b1 = 0;
  }
  */
  //fill(r, g, b);
  //rect(100, 100, 100, 100);


 //image(img, 0, 0, windowWidth, windowHeight);

image(img, 0, 0, windowWidth, windowHeight);
//au dessus virage
	/*
  image(tree, 680, 180);
  image(tree, 780, 70);
  image(tree, 820, 50);
  image(tree, 700, 100);
//sous virage
  image(tree, 700, 500);
  image(tree, 900, 450);
  image(tree, 1000, 300);
  image(tree, 850, 960);
//droite sud
  image(tree, 1200, 400);
  image(tree, 1400, 90);
  image(tree, 1300, 900);
  image(tree, 1370, 950);
  image(tree, 1650, 560);
*/

 //CARTE

  //Autoroute
    //droite
      //fond
      stroke(0, 0, 0, 30);
      strokeWeight(60);
      line(585, 0, 585, 2000);
      //voie de droite
      stroke(230);
      strokeWeight(30);
      line(600, 0, 600, 600);

      colorMode(HSB, 360, 100, 100);

      //avant virage
      stroke(min(congestionColor+congestionPropagation*11, colorGreen), 70, 100);
      strokeWeight(30);
      line(600, 900, 600, 1000);

      stroke(min(congestionColor+congestionPropagation*10, colorGreen), 70, 100);
      strokeWeight(30);
      line(600, 800, 600, 900);

      stroke(min(congestionColor+congestionPropagation*9, colorGreen), 70, 100);
      strokeWeight(30);
      line(600, 700, 600, 800);

      stroke(min(congestionColor+congestionPropagation*8, colorGreen), 70, 100);
      strokeWeight(30);
      line(600, 580, 600, 700);


      colorMode(RGB, 360);
    //gauche
      //fond
      stroke(0, 0, 0, 30);
      strokeWeight(60 );
      line(515, 0, 515, 2000);
      //voie de droite
      stroke(230);
      strokeWeight(30);
      line(500, 0, 500, 2000);

    //virage


      colorMode(HSB, 360, 100, 100);


      //noFill();
      //stroke(r, g, b);
      //strokeWeight(30);
      //strokeCap(SQUARE);
      //smooth();
      //arc(1100, 605, 1001, 880, PI, PI + HALF_PI);

      noFill();
      stroke(congestionColor,100,100);
      strokeWeight(30);
      strokeCap(SQUARE);
      //smooth();
      arc(1100, 605, 1001, 880, PI, 4.7);

      noFill();
      stroke(min(congestionColor+congestionPropagation, colorGreen), 70, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      //smooth();
      arc(1100, 605, 1001, 880, PI, 4.5);

      noFill();
      stroke(min(congestionColor+congestionPropagation*2, colorGreen), 70, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      //smooth();
      arc(1100, 605, 1001, 880, PI, 4.3);

      noFill();
      stroke(min(congestionColor+congestionPropagation*3, colorGreen), 70, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      //smooth();
      arc(1100, 605, 1001, 880, PI, 4.1);

      noFill();
      stroke(min(congestionColor+congestionPropagation*4, colorGreen), 70, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      //smooth();
      arc(1100, 605, 1001, 880, PI, 3.9);

      noFill();
      stroke(min(congestionColor+congestionPropagation*5, colorGreen), 70, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      //smooth();
      arc(1100, 605, 1001, 880, PI, 3.7);

      noFill();
      stroke(min(congestionColor+congestionPropagation*6, colorGreen), 70, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      //smooth();
      arc(1100, 605, 1001, 880, PI, 3.5);

      noFill();
      stroke(min(congestionColor+congestionPropagation*7, colorGreen), 70, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      //smooth();
      arc(1100, 605, 1001, 880, PI, 3.3);



        colorMode(RGB, 360);

  //Routes internes(droite)


    //rond point 2
      //fond
        noFill();
        stroke(230);
        strokeWeight(30);
        strokeCap(SQUARE);
        //arc(1160, 150, 130, 130, 0, TWO_PI);
        ellipse(1550, 300, 100, 100);

    //rond point2 vers la Droite
      //route principale
        noFill();
        stroke(230);
        strokeWeight(30);
        strokeCap(SQUARE);
        line(1600, 310, 2000, 310);
      //impasse
        //droite1
          noFill();
          stroke(230);
          strokeWeight(15);
          strokeCap(ROUND);
          line(1700, 500, 1850, 500);
        //bas
          noFill();
          stroke(230);
          strokeWeight(15);
          strokeCap(ROUND);
          line(1700, 500, 1700, 310);
        //bas et haut
          noFill();
          stroke(230);
          strokeWeight(15);
          strokeCap(ROUND);
          line(1850, 400, 1850, 600);
        //bas2
          noFill();
          stroke(230);
          strokeWeight(15);
          strokeCap(ROUND);
          line(1750, 500, 1750, 560);
        //gauche
          noFill();
          stroke(230);
          strokeWeight(15);
          strokeCap(ROUND);
          line(1750, 560, 1720, 560);

    //rond point 2 vers le haut
      noFill();
      stroke(230);
      strokeWeight(30);
      strokeCap(SQUARE);
      line(1550, 240, 1550, -20);

    //Relie les deux rond points
      noFill();
      stroke(230);
      strokeWeight(30);
      strokeCap(SQUARE);
      line(1220, 180, 1500, 285);

    //Relie le rond point 2 avec la route sud
      noFill();
      stroke(230);
      strokeWeight(15);
      strokeCap(SQUARE);
      line(1510, 350, 1155, 750);

    //Relie le rond point 2 avec la route est
      //bas
        noFill();
        stroke(230);
        strokeWeight(30);
        strokeCap(SQUARE);
        line(1550, 350, 1550, 700);
      //virage
        noFill();
        stroke(230);
        strokeWeight(30);
        strokeCap(SQUARE);
        arc(1615, 700, 130, 130, HALF_PI, PI);
      //droite
        noFill();
        stroke(230);
        strokeWeight(30);
        strokeCap(SQUARE);
        line(1610, 765, 2000, 765);
      //bas2
        noFill();
        stroke(230);
        strokeWeight(30);
        strokeCap(SQUARE);
        line(1550, 700, 1550, 2000);
      //impasse Droite
        noFill();
        stroke(230);
        strokeWeight(15);
        strokeCap(ROUND);
        line(1560, 965, 1730, 965);

    //Relie route est avec route entreprise
      noFill();
      stroke(230);
      strokeWeight(15);
      strokeCap(SQUARE);
      arc(1375, 785, 130, 130, 0, HALF_PI);
      noFill();
      stroke(230);
      strokeWeight(15);
      strokeCap(SQUARE);
      line(1440, 425, 1440, 790);
      noFill();
      stroke(230);
      strokeWeight(15);
      strokeCap(SQUARE);
      line(1396, 589, 1550, 589);
      noFill();
      stroke(230);
      strokeWeight(15);
      strokeCap(SQUARE);
      arc(1350, 615, 50, 50, 0, HALF_PI);
      noFill();
      stroke(230);
      strokeWeight(15);
      strokeCap(SQUARE);
      arc(1400, 615, 50, 50, HALF_PI*2, PI + HALF_PI);

    //Route nord
      stroke(230);
      strokeWeight(30);
      strokeCap(ROUND);
      line(1155, 0, 1155, 80);

    //3eme sortie rond point
      stroke(230);
      strokeWeight(15);
      strokeCap(ROUND);
      line(1100, 120, 950, -20);

    //Mini vers la droite
      stroke(230);
      strokeWeight(15);
      strokeCap(SQUARE);
      line(1144, 640, 1350, 640);

    //Vers la gauche, impasse
      //gauche1
        stroke(230);
        strokeWeight(15);
        strokeCap(ROUND);
        line(1144, 540, 900, 540);
      //bas
        stroke(230);
        strokeWeight(15);
        strokeCap(SQUARE);
        line(900, 540, 900, 740);
      //gauche2
        stroke(230);
        strokeWeight(15);
        strokeCap(ROUND);
        line(900, 740, 650, 740);

        //rond point 1
          //fond
            noFill();
            stroke(230);
            strokeWeight(30);
            strokeCap(SQUARE);
            arc(1160, 150, 130, 130, 0, TWO_PI);
            //ellipse(1150, 165, 100, 100);
          //virage
            colorMode(HSB, 360, 100, 100);
            noFill();
            stroke(80, 100, 100,);
            strokeWeight(30);
            strokeCap(SQUARE);
            arc(1160, 150, 130, 130, HALF_PI, PI);
            colorMode(RGB, 255);

    //Route sud
      //fond
        stroke(164);
        strokeWeight(30);
        strokeCap(ROUND);
        line(1155, 214, 1155, 2000);
      //portion colorée
        colorMode(HSB, 360, 100, 100);
        stroke(120, 70, 100);
        strokeWeight(30);
        line(1155, 214, 1155, 840);
        colorMode(RGB, 255);

    //Droite vers entreprise
      //fond
        stroke(164);   // Sandro a modifié ça
        strokeWeight(15);
        strokeCap(SQUARE);
        line(1144, 850, 1375, 850);

        colorMode(HSB, 360, 100, 100);
      //portion colorée
        stroke(120, 70, 100);
        strokeWeight(15);
        strokeCap(SQUARE);
        line(1140, 850, 1330, 850);
      //remontée
        stroke(120, 70, 100);
        strokeWeight(28);
        strokeCap(SQUARE);
        line(1322, 819, 1322, 858);
        colorMode(RGB, 255);

			//tram
				//if((i <= 2000 &&  ))



    //entreprise
      //fill(200);
      //noStroke();
      //stroke(255, 0 , 0);
      //strokeWeight(10);
      //rect(1200, 730, 200, 100);

    //cache
      fill(30);
      //stroke(255);
      //strokeWeight(10);
			noStroke();
      rect(-30, 900, 2000, 350);

			tint(255, 127);
			image(histogrey, 0, 920);
			tint(255, 255);



  //histogram
    var lar = windowWidth/25;
    //var len = histogram.lenght;
    colorMode(HSB, 360, 100, 100);
    //rectMode(CORNER);
    for(var i in histogram) {
       if (histogram.hasOwnProperty(i)) {
        noStroke();
        fill(255);
				var color = int(map(histogram[i], congestionMin, congestionMax, colorGreen, colorRed));
				fill(min(color, colorGreen), 70, 100);

				if (i == slider.value()) {
          //stroke(255);
          //strokeWeight(5);
					fill(255);
					rect(lar * i, 1080-histogram[i]*13, lar+1, histogram[i]*13);
          fill(min(congestionColor+congestionPropagation, colorGreen), 100, 100);

        }
        rect(lar * i, 1080-histogram[i]*12, lar+1, histogram[i]*12);
       }
    }
    for(var j in time) {
       if (time.hasOwnProperty(j)) {
        textSize(140);
        textFont(MontserratBold);
        textAlign(CORNER);
        noStroke();
        fill(255, 255, 255, 0)
        if (j == slider.value()){
          fill(0);
        }
        text(time[j], 40, 200);
       }

    }
    colorMode(RGB, 255);
		ellipseMode(CENTER);

		flashlightsFramesCount++;
		flashlightsSlowFramesCount++;

		if (flashlightsFramesCount == flashlightsFramesCountMax) {
			if (flashlights.length == 0) {
				flashlights.unshift(-1); // add light
			}

			for(var i = 0; i < flashlights.length; i++) {
				if (flashlights[i] < flashlightsSlowIndex) {
					flashlights[i]++;

					if (flashlights[i] > flux.length) {
						flashlights.splice(i, 1); // remove light
					}
				}
			}

			flashlightsFramesCount = 0;
		}


		if (flashlightsSlowFramesCount == flashlightsSlowFramesCountMax) {
			if (flashlights.length == 0) {
				flashlights.unshift(-1); // add light
			}

			for(var i = 0; i < flashlights.length; i++) {
				if (flashlights[i] >= flashlightsSlowIndex) {
					flashlights[i]++;

					if (flashlights[i] > flux.length) {
						flashlights.splice(i, 1); // remove light
					}
				}
			}

			flashlightsSlowFramesCount = 0;
		}

		textFont(MontserratBold);
		textSize(30);
		textAlign(CORNERS);
		fill(0);
		text('Heure d\'arrivée estimée', 50, 350);
		fill(255);
		rect(50, 380, 420, 500);
		textFont(Montserrat);
		textSize(30);
		textAlign(CORNERS);
		fill(0);
		text('Lucie :', 50, 400);
		//text('Lucie', 50, 400);
		text('Jean-Marie :', 50, 460);
		//text('Lucie', 50, 400);
		text('Luc :', 50, 520);
		//text('Lucie', 50, 400);



		console.log(flashlights);

		for(var h in flux) {
       if (flux.hasOwnProperty(h)) {
        // stroke(255, 255, 255, 0);
				noStroke();
        strokeWeight(5);
        fill(255, 255, 255, 120);
          //console.log(flux[h][1]);

					if (flashlights.indexOf(parseInt(h)) != -1) {
						stroke(255, 255, 255);
						strokeWeight(10);
						fill(255, 255, 255);
					}
        ellipse(flux[h][0], flux[h][1], 10, 10);
       }
    }

		image(autoroute, 510, 300, windowWidth/24, windowHeight/24);


    //rectMode(CENTER);




}

var sliderCurrentIndex = 0;

window.onload = function() {
  setInterval(function() {
    sliderCurrentIndex++;
    if(sliderCurrentIndex == 25) {sliderCurrentIndex = 0}
    document.getElementsByTagName('input')[0].value = sliderCurrentIndex;
  },2500);
	createLight();
};


function createLight() {
	flashlights.unshift(-1);

	setTimeout(function(){
		createLight();
	}, flashlightsDensity);
}
