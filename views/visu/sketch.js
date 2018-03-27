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
var button

function setup() {
  createCanvas(windowWidth, windowHeight);
  img  = loadImage("/assets-visu/assets/bg.png");
  tree = loadImage("/assets-visu/assets/arbre.png");
    console.log('yo');
    background(30);

    slider = createSlider(0, 24, 24);
    slider.position(100, 1000);
    slider.style('width', '1750px');


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
}

function change10() {
  r = 255;
  g = 0;
  b = 0;

  r1 = 255;
  g1 = 69;
  b1 = 0;

  r2 = 255;
  g2 = 0;
  b2 = 0;

  r3 = 255;
  g3 = 255;
  b3 = 0;

  r4 = 255;
  g4 = 255;
  b4 = 0;

  r5 = 255;
  g5 = 0;
  b5 = 0;
}

function change20() {
  r = 255;
  g = 0;
  b = 0;

  r1 = 255;
  g1 = 255;
  b1 = 0;

  r2 = 255;
  g2 = 255;
  b2 = 0;

  r3 = 0;
  g3 = 255;
  b3 = 0;

  r4 = 0;
  g4 = 255;
  b4 = 0;

  r5 = 255;
  g5 = 255;
  b5 = 0;
}

function change30() {
  r = 255;
  g = 69;
  b = 0;

  r1 = 0;
  g1 = 255;
  b1 = 0;

  r2 = 0;
  g2 = 255;
  b2 = 0;

  r3 = 0;
  g3 = 255;
  b3 = 0;

  r4 = 0;
  g4 = 255;
  b4 = 0;

  r5 = 255;
  g5 = 255;
  b5 = 0;
}


function draw() {
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




//SLIDERS
/*
if(slider.value = 1) {
  r = 0;
} else {
  r = 255;
}
*/
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
      line(600, 0, 600, 2000);
      //avant virage
      stroke(r, g, b);
      strokeWeight(30);
      line(600, 580, 600, 2000);

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
      noFill();
      stroke(r1, g1, b1);
      strokeWeight(30);
      strokeCap(SQUARE);
      //smooth();
      arc(1100, 605, 1001, 880, PI, PI + HALF_PI);

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
      line(1400, 589, 1550, 589);
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
      rect(1250, 680, 150, 100);

    //cache
      fill(30);
      stroke(255);
      strokeWeight(10);
      rect(0, 950, 2000, 150);





}
