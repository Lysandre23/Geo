const width = window.innerWidth*0.75,
      height = window.innerHeight*0.99

var cam = new Camera();
var cellSize = window.innerWidth/cam.w;
var mousePos;
var zoom = 1;
var action = "";
var dragging = false;
var actionHelpDrawing = false;
var gridDrawing = true;
var actionPoints = new Array();
var actionElements = new Array();
var pointMoving = false;
var indexPointMoving = null;
var elementMoving = false;
var indexElementMoving = null;
var p = [

]
var elements = [

];
var nbPolynomials = 0;

var activePoint = false;

function setup() {
    var canvas = createCanvas(width,height);
    canvas.parent("listandcanvas");
    textSize(20);
    turnActionHelp("off");
}

function draw() { 
    background(255);
    translate(width/2,height/2);
    refreshMouse();
    if(gridDrawing) {
        drawGrid();
    }
    drawActionInfo();
    for(var i=0; i<elements.length; i++) {
        elements[i].draw();
        try {
            elements[i].updateList();
        }catch {

        }
    }
    for(var i=0; i<p.length; i++) {
        p[i].draw();
        p[i].updateList();
    }
}

function drawGrid() {
    let bottomLeftCorner = {
        x: cam.x-cam.w/2,
        y: cam.y-cam.w/2
    }
    let firstVerticalLineX = 1-bottomLeftCorner.x%(1/1);
    let firstHorizontalLineY = 1-bottomLeftCorner.y%(1/1);
    for(var i=-1; i<cam.w; i+=(1/1)) {
        if(bottomLeftCorner.x+i+firstVerticalLineX == 0) {
            strokeWeight(3);
            stroke(180);
        }else{
            strokeWeight(1);
            stroke(220);
        }
        line((bottomLeftCorner.x+i+firstVerticalLineX-cam.x)*cellSize,-height/2,(bottomLeftCorner.x+i+firstVerticalLineX-cam.x)*cellSize,height/2);
        stroke(150);
        fill(150);
        strokeWeight(1);
        textSize(10);
        text(Math.round(bottomLeftCorner.x+firstVerticalLineX+i),(bottomLeftCorner.x+i+firstVerticalLineX-cam.x)*cellSize+5,height/2-60);
        
    }
    for(var i=-1; i<2*cam.h; i+=(1/1)) {
        if(abs(bottomLeftCorner.y+firstHorizontalLineY+i) <= 0.2) {
            strokeWeight(3);
            stroke(180);
        }else{
            strokeWeight(1);
            stroke(220)
        }
        line(-width/2,-(bottomLeftCorner.y+firstHorizontalLineY+i-cam.y)*cellSize,width/2,-(bottomLeftCorner.y+firstHorizontalLineY+i-cam.y)*cellSize);
        stroke(150);
        fill(150);
        strokeWeight(1);
        textSize(10);
        text(Math.round((bottomLeftCorner.y+firstHorizontalLineY+i)),-width/2+10,-(bottomLeftCorner.y+firstHorizontalLineY+i-cam.y)*cellSize-10);
    }
}

function newPoint(mouseX,mouseY) {
    let m = mousePosInRel();
    let newp = new Point(m.x,m.y);
    p.push(newp);
    addElementList(newp.id);
}


function refreshCellSize() {
    cellSize = window.innerWidth/cam.w;
}


function newPolynomial() {
    let c = new Array();
    let newc;
    let i = 0;
    while(true) {
        newc = prompt("Coefficient for x^" + i + " // Tap 'end' to finish");
        if(newc == "end") {
            break;
        }
        c.push(parseFloat(newc));
        i++;
    }
    let e = new Polynomial(c,"name:" + nbPolynomials);
    addElementList(e.id);
    elements.push(e);
    nbPolynomials++;
}

function lastPoint() {
    return p[p.length-1];
}

function resetActionArray() {
    actionPoints = new Array();
    actionElements = new Array();
}

function addChildrenToPoint(e) {
    for(var i=0; i<actionPoints.length; i++) {
        actionPoints[i].children.push(e);
    }
}
function addChildrenToElement(e) {
    for(var i=0; i<actionElements.length; i++) {
        actionElements[i].children.push(e);
    }
}