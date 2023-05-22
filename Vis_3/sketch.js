// CREDIT for processing version: www.openprocessing.org/user/10280
// translated to p5 by isob

//In version 2C, instead of calculating exactly the raios of all possibilities,
// we take a heuristic approach, and don't resplit if it's not bat (close to 1:1, square ratio).

let randomHue; //color matching... the key to everything!
let totalValue = 0; //the total values of all elements together, just to write % on square.
let numbers;
let nbItems;
let table;
let numbers_2017 = [];
let numbers_2018 = [];
let numbers_2019 = [];
let numbers_2020 = [];
let numbers_2021 = [];
let numbers_2022 = [];
let selector;

function preload() {
  table = loadTable('../data_src/CRI_PIB.csv', 'csv', 'header');
}

function setup() {
  colorMode(HSB, 105); //it's just nicer this way... you know...
  canvas1=createCanvas(1600, 800);
  canvas1.position(100, 250);
  //noLoop();
  smooth();

  let id_2017 = 0;
  let id_2018 = 1;
  let id_2019 = 2;
  let id_2020 = 3;
  let id_2021 = 4;
  let id_2022 = 5;
  let coffe_contribution = 0.0;
  //cycle through the table
  for (let r = 0; r < table.getRowCount(); r++) {
    for (let c = 0; c < table.getColumnCount(); c++) {
      if ((c == 1) || (c == 5)){
        coffe_contribution = 0.0;
        if (c == 1)
        {
          coffe_contribution = float(table.getString(r, 5))
        }

        if (r == id_2017) {
          append(numbers_2017,  float(table.getString(r, c)) - coffe_contribution);
        }
        else if (r == id_2018) {
          append(numbers_2018,  float(table.getString(r, c)) - coffe_contribution);
        }
        else if (r == id_2019) {
          append(numbers_2019,  float(table.getString(r, c)) - coffe_contribution);
        }
        else if (r == id_2020) {
          append(numbers_2020,  float(table.getString(r, c)) - coffe_contribution);
        }
        else if (r == id_2021) {
          append(numbers_2021,  float(table.getString(r, c)) - coffe_contribution);
        }
        else if (r == id_2022) {
          append(numbers_2022,  float(table.getString(r, c)) - coffe_contribution);
        }
      }
    }
  }

  numbers = numbers_2017;
  nbItems = numbers.length;
  calculate(410, 10);

  numbers = numbers_2018;
  nbItems = numbers.length;
  calculate(610, 10);

  numbers = numbers_2019;
  nbItems = numbers.length;
  calculate(810, 10);

  numbers = numbers_2020;
  nbItems = numbers.length;
  calculate(1010, 10);

  numbers = numbers_2021;
  nbItems = numbers.length;
  calculate(1210, 10);

  numbers = numbers_2022;
  nbItems = numbers.length;
  calculate(1410, 10);
}


//MOUSE PRESS
//function mousePressed() {
//  setup();
//}

function drawRect(x1, y1, w1, h1, value) {
  let hStart = 50 - 0.1;
  let hEnd = 50 + 0.1;
  let h = random(hStart, hEnd);
  let s = random(7, 100);
  let b = random(90, 70);
  fill(h, s, b);
  rect(x1, y1, w1, h1); //we draw a rectangle    
  fill(1);
  //  text(str(value), x1+6, y1+20);  (we don't care about the actual value now that we have the pcnt...)
  let myPcntStr;
  let myPcnt = int(round((value / totalValue) * 100));
  print([totalValue, value, myPcnt])
  let myPcntDecimal = int(round((value / totalValue) * 1000));
  myPcntDecimal = myPcntDecimal / 10;


  myPcntStr = str(myPcntDecimal) + "%";
  text(myPcntStr, x1 + (w1 / 2) - 10, y1 + (h1 / 2) + 5);

  print("++++ totalValue = " + totalValue);
}

///   FIND GOOD SPLIT NUMBER - advantagous block aspect ratio.
function getPerfectSplitNumber(numbers, blockW, blockH) {
  // This is where well'll need to calculate the possibilities
  // We'll need to calculate the average ratios of created blocks.
  // For now we just try with TWO for the sake of the new functionn...

  //Let's just split in either one or two to start...

  // print("blockW = "+blockW);
  //print("blockH = "+blockH);

  let valueA = numbers[0]; //our biggest value
  let valueB = 0; //value B will correspond to the sum of all remmaining objects in array
  for (let i = 1; i < numbers.length; i++) {
    valueB += numbers[i];
  }

  let ratio = float(valueA) / float(valueB + valueA);

  let heightA, widthA;
  if (blockW >= blockH) {
    heightA = blockH;
    widthA = floor(blockW * ratio);
  } else {
    heightA = floor(blockH * ratio);
    widthA = blockW;
  }

  let ratioWH = float(widthA) / float(heightA);
  let ratioHW = float(heightA) / float(widthA);
  let diff;

  if (widthA >= heightA) { // Larger rect //ratio = largeur sur hauteur,
    //we should spit vertically...
    diff = 1 - ratioHW;
  } else { //taller rectangle ratio
    diff = 1 - ratioWH;
  }

  if ((diff > 0.5) && (numbers.length >= 3)) { //this is a bit elongated (bigger than 2:1 ratio)
    print("======================--> 22222");
    return 2; //TEMPORARY !!!!
  } else { //it's a quite good ratio! we don't touch it OR, it's the last one, sorry, no choice.   
    print("======================--> 11111");
    return 1;
  }

  //diff is the difference (between 0...1) to the square ratio.
  // 0 mean we have a square (don't touch, it's beautifull!)
  // 0.9 mean we have a very long rectangle.

  /* Previous ghetto mehod
  
  if(numbers.length >= 3){//if there are 3 elements or more in our array, we try fragmenting A for better RAtios.
    return 2;//the two is really hardcoded, we should calculate average ratios of all blocks...
  }else{
    return 1;
  } */

}

///   Start the recursion
function calculate(refX, refY) {
  totalValue = 0;
  
  for (let i = 0; i <= numbers.length - 1; i++) {
    
    print(totalValue + " + " + numbers[i] + " = ...");
    totalValue += numbers[i]; //There's a problem here, the total is never accurate...
    print("numbers = \n" + numbers);
    
  }

  //basic param for the sake of this prototype ...
  //let refX = 10;
  //let refY = 10;
  let blockWidth = 200;
  let blockHeigh = 200;
  let blockW = blockWidth - 20;
  let blockH = blockHeigh - 20;

  makeBlock(refX, refY, blockW, blockH, numbers); //x,y,w,h
}

///   MAKE BLOCK
function makeBlock(refX, refY, blockW, blockH, numbers) {
  // We sort the received array.
  ///////////////////////////////////////////////////////////////
  numbers = reverse(sort(numbers)); // we sort the array from biggest to smallest value.
  //First we need to asses the optimal number of item to be used for block A
  // How do we do that?

  let nbItemsInABlock = 1
  let valueA = 0; //the biggest value
  let valueB = 0; //value B will correspond to the sum of all remmaining objects in array
  let numbersA = []; //in the loop, we'll populate these two out of our main array.
  let numbersB = [];
  
  for (let i = 0; i < numbers.length; i++) {
    if (i < nbItemsInABlock) { //item has to be placed in A array...
      numbersA = append(numbersA, numbers[i]);
      //numbersA[i] = numbers[i]; //we populate our new array of values, we'll send it recursivly...
      valueA += numbers[i];
    } else {
      numbersB = append(numbersB, numbers[i]);
      //numbersB[i-nbItemsInABlock] = numbers[i]; //we populate our new array of values, we'll send it recursivly...
      valueB += numbers[i];
    }
  }
  let ratio = float(valueA) / float(valueB + valueA);

  print("ratio = " + ratio);
  print("A val = " + valueA);
  print("B val = " + valueB);
  //now we split the block in two according to the right ratio...

  /////////////// WE SET THE X, Y, WIDTH, AND HEIGHT VALUES FOR BOTH RECTANGLES.

  let xA, yA, heightA, widthA, xB, yB, heightB, widthB;
  if (blockW > blockH) { //si plus large que haut...
    //we split vertically; so height will stay the same...

    xA = refX;
    yA = refY; // we draw the square in top right corner, so same value.
    heightA = blockH;
    widthA = floor(blockW * ratio);

    xB = refX + widthA;
    yB = refY;
    heightB = blockH;
    widthB = blockW - widthA; //the remaining portion of the width...

  } else { //tall rectangle, we split horizontally.
    xA = refX;
    yA = refY; // we draw the square in top right corner, so same value.
    heightA = floor(blockH * ratio);
    widthA = blockW;

    xB = refX;
    yB = refY + heightA;
    heightB = blockH - heightA;
    widthB = blockW; //the remaining portion of the width...

  }

  /////////////// END OF Block maths.

  // if the ratio of the A block is too small (elongated rectangle)
  // we take an extra value for the A sqare, don't draw it, then send the 2 element 
  // it represents to this function (treat it recusvily as if it was a B block).
  // We dont care about the ratio of B block because they are divided after...

  //drawRect(xA, yA, widthA, heightA, valueA); //(x, y, width, height)
  //int pcntA = floor(valueA / float(valueA + valueB)*100);
  //int pcntB = floor(valueB / float(valueA + valueB)*100);
  print("numbers.length = " + numbers.length);
  print("numbersA.length = " + numbersA.length);
  print("numbersB.length = " + numbersB.length);
  //We add the block A to the display List
  // for now, we just draw the thing, let's convert to OOP later...


  if (numbersA.length >= 2) { //this mean there is still stuff in this arary...
    makeBlock(xA, yA, widthA, heightA, numbersA);
  } else {
    //if it's done, we add the B to display list, and that's it for recussivity, we return to main level... 
    // the main function will then deal with all the data...
    drawRect(xA, yA, widthA, heightA, valueA);
  }

  if (numbersB.length >= 2) { //this mean there is still stuff in this arary...
    makeBlock(xB, yB, widthB, heightB, numbersB);
  } else {
    //if it's done, we add the B to display list, and that's it for recussivity, we return to main level... 
    // the main function will then deal with all the data...
    drawRect(xB, yB, widthB, heightB, valueB);
  }

  //If it represent more than one value, we send the block B to be split again (recursivly)

}