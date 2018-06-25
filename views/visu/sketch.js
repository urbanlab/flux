var slider;
var histogram;
var trajet;

var time = ['06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45' ,'11:00', '11:15', '11:30', '11:45', '12:00'];
var flux = [
  [600, 880], [600,860], [600, 840], [600,820], [600, 800], [600, 780], [600,760], [600, 740], [600,720], [600, 700], [600, 680], [600,660], [600, 640], [600,620], [600, 600], [600,580], [602,560], [605,540], [609,520], [614,500], [620,480], [627,460], [635,440], [645,420], [656,400], [668,380], [682,360], [700,340], [700,340], [717,320], [740,300], [763,280], [788,260], [820,240], [856,220], [890,205], [925,193], [955,183], [985,176], [1015,170], [1045,167], [1075,165], [1098,165], [1110,190], [1130,205], [1155,220], [1155,240], [1155,260], [1155,280], [1155,300], [1155,320], [1155,340], [1155,360], [1155,380], [1155,400], [1155,420], [1155,440], [1155,460], [1155,480], [1155,500], [1155,520], [1155,540], [1155,560], [1155,580], [1155,600], [1155,620], [1155,640], [1155,660], [1155,680], [1155,700], [1155,720], [1155,740], [1155,760], [1155,780], [1155,800], [1155,820], [1155,840], [1175,850], [1195,850], [1215,850], [1235,850], [1255,850], [1275,850], [1295,850], [1320,850], [1320, 830]
]

var temps_trajets_a_vide = [35, 45, 25];
var temps_trajets_max = [66, 76, 56];

var congestionMin = 1;
var congestionMax = 13;
var congestionPropagationInitial = 13;
var congestionPropagation = congestionPropagationInitial;
var congestionPropagationFactor = 1.5;
var colorGreen = 120;
var colorRed = 0;

var congestion = 5;

var flashlights = new Array();
var flashlightsDensity = 1;
var flashlightsFramesCountMax = 2;
var flashlightsFramesCount = 0;
var flashlightsSlowFramesCountMax = 1;
var flashlightsSlowFramesCount = 0;
var flashlightsSlowIndex = 43;

var xt = 2000;
var scaling_histogramme = 12;


// Paramètres d'affichage de l'interface, windowWidth = 1920 et windowHeight = 1080 ici
// windowWidth et windowHeight n'existent que dans draw, il faut donc définir les paramètres
// d'affichage dans draw via cette fonction.
function definir_reperes(windowWidth, windowHeight) {
  var xsep = Math.floor(3 * windowWidth / 4);
  var ysep = Math.floor(3 * windowHeight / 4);

  var y1 = Math.floor(windowHeight / 3);
  var y2 = Math.floor(2 * windowHeight / 3);
  return {'xsep':xsep, 'ysep':ysep, 'y1':y1, 'y2':y2};
}

function resc_x(x) {
  return Math.floor((x - 485) * (xsep / (windowWidth - 485)));
}

function resc_y(y) {
  return Math.floor(y * (ysep / 900));
}

function image_rescalee(img, windowWidth, windowHeight, x, y, L, H, offset=true) {
  var cste_recalage = offset ? -70 : 0;  // pour une raison qui m'échappe rescaler l'image globale ne suffit pas: on la décale vers le hau
  var nv_x = resc_x(x);
  var nv_y = resc_y(y) + cste_recalage;
  var nv_L = Math.floor(L * (xsep / (windowWidth - 485)));
  var nv_H = Math.floor(H * (ysep / 900));
  image(img, nv_x, nv_y, nv_L, nv_H);
}

// Fonctions utilisées pour le traçage des différents éléments
function tracer_carte(windowWidth, windowHeight) {
  image_rescalee(img, windowWidth, windowHeight, 0, 0, windowWidth, strokeWeight);
  //Autoroute
    //droite
      //fond
      stroke(0, 0, 0, 30);
      strokeWeight(60);
      line(resc_x(585), resc_y(0), resc_x(585), resc_y(2000));
      //voie de droite
      stroke(230);
      strokeWeight(30);
      line(resc_x(600), resc_y(0), resc_x(600), resc_y(600));

      colorMode(HSB, 360, 100, 100);

      //avant virage
      stroke(min(congestionColor+congestionPropagation*11, colorGreen), 70, 100);
      strokeWeight(30);
      line(resc_x(600), resc_y(900), resc_x(600), resc_y(1000));

      stroke(min(congestionColor+congestionPropagation*10, colorGreen), 70, 100);
      strokeWeight(30);
      line(resc_x(600), resc_y(800), resc_x(600), resc_y(900));

      stroke(min(congestionColor+congestionPropagation*9, colorGreen), 70, 100);
      strokeWeight(30);
      line(resc_x(600), resc_y(700), resc_x(600), resc_y(800));

      stroke(min(congestionColor+congestionPropagation*8, colorGreen), 70, 100);
      strokeWeight(30);
      line(resc_x(600), resc_y(580), resc_x(600), resc_y(700));

      colorMode(RGB, 360);
    
    //gauche
      //fond
      stroke(0, 0, 0, 30);
      strokeWeight(60 );
      line(resc_x(515), resc_y(0), resc_x(515), resc_y(2000));
      //voie de droite
      stroke(230);
      strokeWeight(30);
      line(resc_x(500), resc_y(0), resc_x(500), resc_y(2000));

    //virage
      colorMode(HSB, 360, 100, 100);

      noFill();
      stroke(congestionColor,100,100);
      strokeWeight(30);
      strokeCap(SQUARE);
      arc(resc_x(1100), resc_y(605), 1001 * xscale, resc_y(880), PI, 4.7);

      noFill();
      stroke(min(congestionColor+congestionPropagation, colorGreen), 70, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      arc(resc_x(1100), resc_y(605), 1001 * xscale, resc_y(880), PI, 4.5);

      noFill();
      stroke(min(congestionColor+congestionPropagation*2, colorGreen), 70, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      arc(resc_x(1100), resc_y(605), 1001 * xscale, resc_y(880), PI, 4.3);

      noFill();
      stroke(min(congestionColor+congestionPropagation*3, colorGreen), 70, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      arc(resc_x(1100), resc_y(605), 1001 * xscale, resc_y(880), PI, 4.1);

      noFill();
      stroke(min(congestionColor+congestionPropagation*4, colorGreen), 70, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      arc(resc_x(1100), resc_y(605), 1001 * xscale, resc_y(880), PI, 3.9);

      noFill();
      stroke(min(congestionColor+congestionPropagation*5, colorGreen), 70, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      arc(resc_x(1100), resc_y(605), 1001 * xscale, resc_y(880), PI, 3.7);

      noFill();
      stroke(min(congestionColor+congestionPropagation*6, colorGreen), 70, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      arc(resc_x(1100), resc_y(605), 1001 * xscale, resc_y(880), PI, 3.5);

      noFill();
      stroke(min(congestionColor+congestionPropagation*7, colorGreen), 70, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      arc(resc_x(1100), resc_y(605), 1001 * xscale, resc_y(880), PI, 3.3);

      colorMode(RGB, 360);

  //Routes internes(droite)
    //rond point 2
      //fond
      noFill();
      stroke(230);
      strokeWeight(30);
      strokeCap(SQUARE);
      ellipse(resc_x(1550), resc_y(300), 100 * xscale, resc_y(100));

    //rond point2 vers la Droite
      //route principale
      noFill();
      stroke(230);
      strokeWeight(30);
      strokeCap(SQUARE);
      line(resc_x(1600), resc_y(310), resc_x(2000), resc_y(310));
      //impasse
        //droite1
        noFill();
        stroke(230);
        strokeWeight(15);
        strokeCap(ROUND);
        line(resc_x(1700), resc_y(500), resc_x(1850), resc_y(500));
        //bas
        noFill();
        stroke(230);
        strokeWeight(15);
        strokeCap(ROUND);
        line(resc_x(1700), resc_y(500), resc_x(1700), resc_y(310));
        //bas et haut
        noFill();
        stroke(230);
        strokeWeight(15);
        strokeCap(ROUND);
        line(resc_x(1850), resc_y(400), resc_x(1850), resc_y(600));
        //bas2
        noFill();
        stroke(230);
        strokeWeight(15);
        strokeCap(ROUND);
        line(resc_x(1750), resc_y(500), resc_x(1750), resc_y(560));
        //gauche
        noFill();
        stroke(230);
        strokeWeight(15);
        strokeCap(ROUND);
        line(resc_x(1750), resc_y(560), resc_x(1720), resc_y(560));

    //rond point 2 vers le haut
      noFill();
      stroke(230);
      strokeWeight(30);
      strokeCap(SQUARE);
      line(resc_x(1550), resc_y(240), resc_x(1550), -resc_y(20));

    //Relie les deux rond points
      noFill();
      stroke(230);
      strokeWeight(30);
      strokeCap(SQUARE);
      line(resc_x(1220), resc_y(180), resc_x(1500), resc_y(285));

    //Relie le rond point 2 avec la route sud
      noFill();
      stroke(230);
      strokeWeight(15);
      strokeCap(SQUARE);
      line(resc_x(1510), resc_y(350), resc_x(1155), resc_y(750));

    //Relie le rond point 2 avec la route est
      //bas
      noFill();
      stroke(230);
      strokeWeight(30);
      strokeCap(SQUARE);
      line(resc_x(1550), resc_y(350), resc_x(1550), resc_y(700));
      //virage
      noFill();
      stroke(230);
      strokeWeight(30);
      strokeCap(SQUARE);
      arc(resc_x(1615), resc_y(700), 130 * xscale, resc_y(130), HALF_PI, PI);
      //droite
      noFill();
      stroke(230);
      strokeWeight(30);
      strokeCap(SQUARE);
      line(resc_x(1610), resc_y(765), resc_x(2000), resc_y(765));
      //bas2
      noFill();
      stroke(230);
      strokeWeight(30);
      strokeCap(SQUARE);
      line(resc_x(1550), resc_y(700), resc_x(1550), resc_y(2000));
      //impasse Droite
      noFill();
      stroke(230);
      strokeWeight(15);
      strokeCap(ROUND);
      line(resc_x(1560), resc_y(965), resc_x(1730), resc_y(965));

    //Relie route est avec route entreprise
    noFill();
    stroke(230);
    strokeWeight(15);
    strokeCap(SQUARE);
    line(resc_x(1396), resc_y(589), resc_x(1550), resc_y(589));
    noFill();
    stroke(230);
    strokeWeight(15);
    strokeCap(SQUARE);
    arc(resc_x(1350), resc_y(615), 50 * xscale, resc_y(50), 0, HALF_PI);
    noFill();
    stroke(230);
    strokeWeight(15);
    strokeCap(SQUARE);
    arc(resc_x(1400), resc_y(615), 50 * xscale, resc_y(50), HALF_PI*2, PI + HALF_PI);

    //Route nord
    stroke(230);
    strokeWeight(30);
    strokeCap(ROUND);
    line(resc_x(1155), resc_y(0), resc_x(1155), resc_y(80));

    //3eme sortie rond point
    stroke(230);
    strokeWeight(15);
    strokeCap(ROUND);
    line(resc_x(1100), resc_y(120), resc_x(950), -resc_y(20));

    //Mini vers la droite
    stroke(230);
    strokeWeight(15);
    strokeCap(SQUARE);
    line(resc_x(1144), resc_y(640), resc_x(1350), resc_y(640));

    //Vers la gauche, impasse
      //gauche1
      stroke(230);
      strokeWeight(15);
      strokeCap(ROUND);
      line(resc_x(1144), resc_y(540), resc_x(900), resc_y(540));
      //bas
      stroke(230);
      strokeWeight(15);
      strokeCap(SQUARE);
      line(resc_x(900), resc_y(540), resc_x(900), resc_y(740));
      //gauche2
      stroke(230);
      strokeWeight(15);
      strokeCap(ROUND);
      line(resc_x(900), resc_y(740), resc_x(650), resc_y(740));

    //rond point 1
      //fond
      noFill();
      stroke(230);
      strokeWeight(30);
      strokeCap(SQUARE);
      arc(resc_x(1160), resc_y(150), 130 * xscale, resc_y(130), 0, TWO_PI);
      //ellipse(1150, 165, 100, 100);
      //virage
      colorMode(HSB, 360, 100, 100);
      noFill();
      stroke(80, 100, 100);
      strokeWeight(30);
      strokeCap(SQUARE);
      arc(resc_x(1160), resc_y(150), 130 * xscale, resc_y(130), HALF_PI, PI);
      colorMode(RGB, 255);

  //Route sud
    //fond
    stroke(164);
    strokeWeight(30);
    strokeCap(ROUND);
    line(resc_x(1155), resc_y(214), resc_x(1155), resc_y(2000));
    //portion colorée
    colorMode(HSB, 360, 100, 100);
    stroke(120, 70, 100);
    strokeWeight(30);
    line(resc_x(1155), resc_y(214), resc_x(1155), resc_y(840));
    colorMode(RGB, 255);

  //Droite vers entreprise
    //fond
    stroke(164);   // Sandro a modifié ça
    strokeWeight(15);
    strokeCap(SQUARE);
    line(resc_x(1144), resc_y(850), resc_x(1375), resc_y(850));
    colorMode(HSB, 360, 100, 100);
    //portion colorée
    stroke(120, 70, 100);
    strokeWeight(15);
    strokeCap(SQUARE);
    line(resc_x(1140), resc_y(850), resc_x(1330), resc_y(850));
    //remontée
    stroke(120, 70, 100);
    strokeWeight(28);
    strokeCap(SQUARE);
    line(resc_x(1322), resc_y(832), resc_x(1322), resc_y(858));
    colorMode(RGB, 255);

  image_rescalee(autoroute, windowWidth, windowHeight, 510, 300, windowWidth/24, windowHeight/24);

  if (xt > 1570){xt = xt - 10} else {xt = 2200};
  image_rescalee(tram, windowWidth, windowHeight, xt, 870, 100, 50);
  image_rescalee(tunnel, windowWidth, windowHeight, 1565, 870, 60, 60);

  noFill();
  stroke(165);
  strokeWeight(15);
  strokeCap(SQUARE);
  arc(resc_x(1375), resc_y(785), 130 * xscale, resc_y(130), 0, HALF_PI);
  noFill();
  stroke(165);
  strokeWeight(15);
  strokeCap(SQUARE);
  line(resc_x(1440), resc_y(425), resc_x(1440), resc_y(790));
}

function tracer_bordures(windowWidth, windowHeight) {
  fill(30);
  stroke(0);
  strokeWeight(2);
  rect(0, ysep, xsep, windowHeight - ysep); // fond de l'histogramme
  rect(xsep, 0, windowWidth - xsep, y1);      // fonds des profils
  rect(xsep, y1, windowWidth - xsep, y2 - y1);
  rect(xsep, y2, windowWidth - xsep, windowHeight - y2);
}

function tracer_histogramme(windowWidth, windowHeight) {
  var lar = Math.floor(xsep / 25);
  var complementaire = xsep % 25;
  var nb_barres = histogram.length;
  var largeur_barre;

  colorMode(HSB, 360, 100, 100);

  for(var i=0; i < nb_barres; i++) {
    largeur_barre = (i < nb_barres - 1) ? (lar + 1) : (lar + complementaire - 2);
    if (histogram.hasOwnProperty(i)) {
      stroke(0);
      strokeWeight(1);
      var color = int(map(histogram[i], congestionMin, congestionMax, colorGreen, colorRed));
      fill(min(color, colorGreen), 70, 90);

      if (i == slider.value()) {
        fill(255);
        rect(lar * i, windowHeight-histogram[i]*scaling_histogramme, largeur_barre, histogram[i] * scaling_histogramme);
        fill(min(congestionColor + congestionPropagation, colorGreen), 100, 100);
      };
      rect(lar * i, windowHeight-histogram[i]*scaling_histogramme, largeur_barre, histogram[i] * scaling_histogramme);
      textFont(MontserratBold);
      textSize(14);
      textAlign(CENTER, BOTTOM)
      fill(255);
      strokeWeight(2);
      text(time[i], i*lar + lar/2, windowHeight - 3);
    };
    };
}

function tracer_horloge(windowWidth, windowHeight) {
  var lar = Math.floor(xsep / 25);
  var x_horloge = lar * slider.value() + lar / 2 - 25;
  var y_ligne = ysep + 30;

  stroke(70);
  strokeWeight(1);
  line(x_horloge + 25, y_ligne, x_horloge + 25, windowHeight);

  stroke(255);
  strokeWeight(1);
  strokeCap(SQUARE);
  line(0, y_ligne, xsep - 2, y_ligne);

  image(horloge, x_horloge, y_ligne - 25, 50, 50);

};

function echelle_couleur(temps_trajet, temps_trajet_min, temps_trajets_max) {
  var valeur_perdue = (temps_trajet - temps_trajet_min) / (temps_trajets_max - temps_trajet_min);
  var r = 255 * valeur_perdue;
  var g = 255 * (1 - valeur_perdue);
  var b = 0;
  return [r,g,b];
}

function tracer_profils(windowWidth, windowHeight) {
  var noms = ['Lucie', 'Alphonse', 'Gaby'];
  var couleurs = trajet.map((temps, i) => echelle_couleur(temps, temps_trajets_a_vide[i], temps_trajets_max[i]));
  var x_nom = xsep + (windowWidth - xsep) / 2;
  var y_nom;
  var x_icone = xsep + (windowWidth - xsep) / 2 - 125;
  var y_icone;
  var x_temps = xsep + (windowWidth - xsep) / 2;
  var y_temps;
  for(var i=0; i<3; i++) {
    y_nom = i * y1 + 40;
    y_icone = i * y1 + (y1 / 2) - 125;
    y_temps = (i + 1) * y1 - 50;

    textFont(MontserratBold);
    textSize(45);
    textAlign(CENTER, CENTER);
    fill(255);
    strokeWeight(2);
    text(noms[i], x_nom, y_nom);

    try {tint.apply(this, couleurs[i])} catch(err) {'erreur couleurs encore indéfinies'};
    image(voiture, x_icone, y_icone, 250, 250);

    textSize(40);
    text(String(trajet[i]) + ' minutes', x_temps, y_temps);
  };
  noTint();
};

function tracer_flashlights(windowWidth, windowHeight) {
    noStroke();
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
  for(var h in flux) {
     if (flux.hasOwnProperty(h)) {
      noStroke();
      strokeWeight(5);
      fill(255, 255, 255, 120);

        if (flashlights.indexOf(parseInt(h)) != -1) {
          stroke(255, 255, 255);
          strokeWeight(10);
          fill(255, 255, 255);
        }
      ellipse(resc_x(flux[h][0]), resc_y(flux[h][1]), 10, 10);
     }
  }
}


// Fonctions d'initialisation du tracé
function preload() {
  Montserrat = loadFont('/assets-visu/assets/Montserrat-Regular.ttf');
  MontserratBold = loadFont('/assets-visu/assets/Montserrat-Bold.ttf');
}


function setup() {  // revoir la partie slider
  createCanvas(windowWidth, windowHeight);
  img = loadImage("/assets-visu/assets/bg.png");
  tree = loadImage("/assets-visu/assets/arbre.png");
  autoroute = loadImage("/assets-visu/assets/a6.png");
  tram = loadImage("/assets-visu/assets/tram.png");
  tunnel = loadImage("/assets-visu/assets/tunnel.png");
  voiture = loadImage("/assets-visu/assets/car.png");
  horloge = loadImage("/assets-visu/assets/clock.png");
  slider = createSlider(0, 24, 0, 1);
  slider.position(100, 1040);
  slider.style('width', '0px');
  slider.hide();
}


// Fonctions nécessaires au traçage
function updateColor(_histogram, index) {
  histogram = _histogram;
  congestion = histogram[index];
  congestionAnticipationIndex = index + 5;

  if (congestionAnticipationIndex > histogram.length) {
    congestionAnticipationIndex = congestionAnticipationIndex - histogram.length;
  }

  flashlightsDensity = int(map(histogram[congestionAnticipationIndex], 1, 13, 2000, 50));
}


function updateTrajet(_trajet, index) {
  trajet = _trajet;
  heure = trajet[index];
}

// Routine utilisée pour le tracé en temps réel de la démo

function draw() {

  background(255);
  colorMode(RGB, 360);

  updateTrajet(trajet);
  updateColor(histogram, slider.value());
  
  congestionColor = int(map(congestion, congestionMin, congestionMax, colorGreen, colorRed));
  congestionPropagationFactor = map(congestion, congestionMin, congestionMax, 1, 0);
  congestionPropagation = congestionPropagationInitial * congestionPropagationFactor;

  var reperes = definir_reperes(windowWidth, windowHeight);
  xsep = reperes.xsep, ysep = reperes.ysep, y1 = reperes.y1, y2 = reperes.y2;
  xscale = xsep / (windowWidth - 485)

  tracer_carte(windowWidth, windowHeight);
  tracer_bordures(windowWidth, windowHeight);
  tracer_profils(windowWidth, windowHeight);
  tracer_horloge(windowWidth, windowHeight);
  tracer_histogramme(windowWidth, windowHeight);
  tracer_flashlights(windowWidth, windowHeight);
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