//Autoroute
  var r = 255; //rouge
  var g = 0; //vert
  var b = 0; //bleu

//virage
  var r1 = 255; //rouge
  var g1 = 0; //vert
  var b1 = 0; //bleu

//rond point
  var r2 = 255; //rouge
  var g2 = 0; //vert
  var b2 = 0; //bleu

//sud
  var r3 = 255; //rouge
  var g3 = 0; //vert
  var b3 = 0; //bleu

//droite
  var r4 = 255; //rouge
  var g4 = 0; //vert
  var b4 = 0; //bleu

//remontée
  var r5 = 255; //rouge
  var g5 = 0; //vert
  var b5 = 0; //bleu

var slider;
var histogram;
//var cars;
//var button;

var congestionMin = 1;
var congestionMax = 10;
var congestionPropagationInitial = 10;
var congestionPropagation = congestionPropagationInitial;
var congestionPropagationFactor = 1;
var colorGreen = 120;
var colorRed = 0;

var congestion = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  img  = loadImage("/assets-visu/assets/bg.png");
  tree = loadImage("/assets-visu/assets/arbre.png");
    console.log('yo');


    /*
    cars = createSlider(0,100,100);
    cars.position(100, 800);
    cars.style('width', '300px');
    */


    slider = createSlider(0, 24, 0, 1);
    slider.position(100, 1040);
    slider.style('width', '0px');

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
  console.log('congestion:',congestion);
}

function draw() {
  background(30);


  colorMode(RGB, 360);

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

//image(img, 0, 0, windowWidth, windowHeight);
//au dessus virage
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


 //CARTE

  //Autoroute
    //droite
      //fond
      stroke(0);
      strokeWeight(60);
      line(585, 0, 585, 2000);
      //voie de droite
      stroke(100);
      strokeWeight(30);
      line(600, 0, 600, 600);

      colorMode(HSB, 360, 100, 100);

      //avant virage
      stroke(min(congestionColor+congestionPropagation*11, colorGreen), 100, 100);
      strokeWeight(30);
      line(600, 900, 600, 1000);

      stroke(min(congestionColor+congestionPropagation*10, colorGreen), 100, 100);
      strokeWeight(30);
      line(600, 800, 600, 900);

      stroke(min(congestionColor+congestionPropagation*9, colorGreen), 100, 100);
      strokeWeight(30);
      line(600, 700, 600, 800);

      stroke(min(congestionColor+congestionPropagation*8, colorGreen), 100, 100);
      strokeWeight(30);
      line(600, 580, 600, 700);


      colorMode(RGB, 360);
    //gauche
      //fond
      stroke(0);
      strokeWeight(60 );
      line(515, 0, 515, 2000);
      //voie de droite
      stroke(100);
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
      stroke(min(congestionColor+congestionPropagation, colorGreen), 100, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      //smooth();
      arc(1100, 605, 1001, 880, PI, 4.5);

      noFill();
      stroke(min(congestionColor+congestionPropagation*2, colorGreen), 100, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      //smooth();
      arc(1100, 605, 1001, 880, PI, 4.3);

      noFill();
      stroke(min(congestionColor+congestionPropagation*3, colorGreen), 100, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      //smooth();
      arc(1100, 605, 1001, 880, PI, 4.1);

      noFill();
      stroke(min(congestionColor+congestionPropagation*4, colorGreen), 100, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      //smooth();
      arc(1100, 605, 1001, 880, PI, 3.9);

      noFill();
      stroke(min(congestionColor+congestionPropagation*5, colorGreen), 100, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      //smooth();
      arc(1100, 605, 1001, 880, PI, 3.7);

      noFill();
      stroke(min(congestionColor+congestionPropagation*6, colorGreen), 100, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      //smooth();
      arc(1100, 605, 1001, 880, PI, 3.5);

      noFill();
      stroke(min(congestionColor+congestionPropagation*7, colorGreen), 100, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      //smooth();
      arc(1100, 605, 1001, 880, PI, 3.3);



        colorMode(RGB, 360);

  //Routes internes(droite)
    //rond point 1
      //fond
        noFill();
        stroke(100);
        strokeWeight(30);
        strokeCap(SQUARE);
        arc(1160, 150, 130, 130, 0, TWO_PI);
        //ellipse(1150, 165, 100, 100);
      //virage
        //noFill();
        //stroke(r2, g2, b2);
        //strokeWeight(30);
        //strokeCap(SQUARE);
        //arc(1160, 150, 130, 130, HALF_PI, PI);

    //rond point 2
      //fond
        noFill();
        stroke(100);
        strokeWeight(30);
        strokeCap(SQUARE);
        //arc(1160, 150, 130, 130, 0, TWO_PI);
        ellipse(1550, 300, 100, 100);

    //rond point2 vers la Droite
      //route principale
        noFill();
        stroke(100);
        strokeWeight(30);
        strokeCap(SQUARE);
        line(1600, 310, 2000, 310);
      //impasse
        //droite1
          noFill();
          stroke(100);
          strokeWeight(15);
          strokeCap(ROUND);
          line(1700, 500, 1850, 500);
        //bas
          noFill();
          stroke(100);
          strokeWeight(15);
          strokeCap(ROUND);
          line(1700, 500, 1700, 310);
        //bas et haut
          noFill();
          stroke(100);
          strokeWeight(15);
          strokeCap(ROUND);
          line(1850, 400, 1850, 600);
        //bas2
          noFill();
          stroke(100);
          strokeWeight(15);
          strokeCap(ROUND);
          line(1750, 500, 1750, 560);
        //gauche
          noFill();
          stroke(100);
          strokeWeight(15);
          strokeCap(ROUND);
          line(1750, 560, 1720, 560);

    //rond point 2 vers le haut
      noFill();
      stroke(100);
      strokeWeight(30);
      strokeCap(SQUARE);
      line(1550, 240, 1550, -20);

    //Relie les deux rond points
      noFill();
      stroke(100);
      strokeWeight(30);
      strokeCap(SQUARE);
      line(1220, 180, 1500, 285);

    //Relie le rond point 2 avec la route sud
      noFill();
      stroke(100);
      strokeWeight(15);
      strokeCap(SQUARE);
      line(1510, 350, 1155, 750);

    //Relie le rond point 2 avec la route est
      //bas
        noFill();
        stroke(100);
        strokeWeight(30);
        strokeCap(SQUARE);
        line(1550, 350, 1550, 700);
      //virage
        noFill();
        stroke(100);
        strokeWeight(30);
        strokeCap(SQUARE);
        arc(1615, 700, 130, 130, HALF_PI, PI);
      //droite
        noFill();
        stroke(100);
        strokeWeight(30);
        strokeCap(SQUARE);
        line(1610, 765, 2000, 765);
      //bas2
        noFill();
        stroke(100);
        strokeWeight(30);
        strokeCap(SQUARE);
        line(1550, 700, 1550, 2000);
      //impasse Droite
        noFill();
        stroke(100);
        strokeWeight(15);
        strokeCap(ROUND);
        line(1560, 965, 1730, 965);

    //Relie route est avec route entreprise
      noFill();
      stroke(100);
      strokeWeight(15);
      strokeCap(SQUARE);
      arc(1375, 785, 130, 130, 0, HALF_PI);
      noFill();
      stroke(100);
      strokeWeight(15);
      strokeCap(SQUARE);
      line(1440, 425, 1440, 790);
      noFill();
      stroke(100);
      strokeWeight(15);
      strokeCap(SQUARE);
      line(1396, 589, 1550, 589);
      noFill();
      stroke(100);
      strokeWeight(15);
      strokeCap(SQUARE);
      arc(1350, 615, 50, 50, 0, HALF_PI);
      noFill();
      stroke(100);
      strokeWeight(15);
      strokeCap(SQUARE);
      arc(1400, 615, 50, 50, HALF_PI*2, PI + HALF_PI);

    //Route nord
      stroke(100);
      strokeWeight(30);
      strokeCap(ROUND);
      line(1155, 0, 1155, 80);

    //3eme sortie rond point
      stroke(100);
      strokeWeight(15);
      strokeCap(ROUND);
      line(1100, 120, 950, -20);

    //Mini vers la droite
      stroke(100);
      strokeWeight(15);
      strokeCap(SQUARE);
      line(1144, 640, 1350, 640);

    //Vers la gauche, impasse
      //gauche1
        stroke(100);
        strokeWeight(15);
        strokeCap(ROUND);
        line(1144, 540, 900, 540);
      //bas
        stroke(100);
        strokeWeight(15);
        strokeCap(SQUARE);
        line(900, 540, 900, 740);
      //gauche2
        stroke(100);
        strokeWeight(15);
        strokeCap(ROUND);
        line(900, 740, 650, 740);

    //Route sud
      //fond
        stroke(100);
        strokeWeight(30);
        strokeCap(ROUND);
        line(1155, 214, 1155, 2000);
      //portion colorée
        //stroke(r3, g3, b3);
        //strokeWeight(30);
        //line(1155, 214, 1155, 840);

    //Droite vers entreprise
      //fond
        stroke(100);
        strokeWeight(15);
        strokeCap(SQUARE);
        line(1144, 850, 1375, 850);
      //portion colorée
        //stroke(r4, g4, b4);
      //  strokeWeight(15);
        //strokeCap(SQUARE);
        //line(1140, 850, 1300, 850);
      //remontée
        //stroke(r5, g5, b5);
        //strokeWeight(30);
      //  strokeCap(SQUARE);
      //  line(1300, 680, 1300, 858);

    //entreprise
      fill(200);
      noStroke();
      //stroke(255, 0 , 0);
      //strokeWeight(10);
      rect(1200, 730, 200, 100);

    //cache
      fill(30);
      stroke(255);
      strokeWeight(10);
      rect(-30, 900, 2000, 350);

  //histogram
    var lar = windowWidth/25;
    //var len = histogram.lenght;
    colorMode(HSB, 360, 100, 100);
    //rectMode(CORNER);
    for(var i in histogram) {
       if (histogram.hasOwnProperty(i)) {
        noStroke();
        fill(255);
        if (i == slider.value()) {
          fill(min(congestionColor+congestionPropagation, colorGreen), 100, 100);
        }
        rect(lar * i, 1080-histogram[i]*15, lar+1, histogram[i]*15);
       }
    }
    colorMode(RGB, 255);
    //rectMode(CENTER);





}

var sliderCurrentIndex = 0;

window.onload = function() {
  setInterval(function() {
    sliderCurrentIndex++;
    if(sliderCurrentIndex == 25) {sliderCurrentIndex = 0}
    document.getElementsByTagName('input')[0].value = sliderCurrentIndex;
  }, 200);
};
