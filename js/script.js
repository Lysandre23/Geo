const width = window.innerWidth*0.75,
      height = window.innerHeight*0.99

var cam = new Camera();
var cellSize = window.innerWidth/cam.w;
var mousePos;
var zoom = 1;
var action = "";
var actionHelpDrawing = true;
var gridDrawing = true;
var actionPoints = new Array();
var actionElements = new Array();
var drawCircleWhenCreating = false;
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

function keyPressed() {
    switch(keyCode) {
        case 8: /* DELETE */
            for(var i=0; i<p.length; i++) {
                if(p[i].mouseOn() || p[i].active) {
                    for(var j=0; j<p[i].children.length; j++) {
                        p[i].children[j].dead = true;
                        $("#"+p[i].children[j].id).remove();
                    }
                    $('#'+p[i].id).remove();
                    p.splice(i,1);
                }
            }
            for(var i=0; i<elements.length; i++) {
                if(elements[i].mouseOn() || elements[i].active) {
                    elements[i].dead = true;
                    if(elements[i] instanceof Polynomial) {
                        elements[i].die(); // Affects all generations
                    }
                    $('#'+elements[i].id).remove();
                    for(var j=0; j<elements[i].children.length; j++) {
                        elements[i].children[j].dead = true;
                        $("#"+elements[i].children[j].id).remove();
                    }
                }
            }
            break;
        case 27: /* ECHAP */
            disableToolsButton();
            turnActionHelp("off");
            break;
    }
}

function newPoint(mouseX,mouseY) {
    let m = mousePosInRel();
    let newp = new Point(m.x,m.y);
    p.push(newp);
    addElementList(newp.id);
}

function mouseWheel(event) {
    if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        if(event.delta < 0) {
            cam.w += 0.3;
        }
        if(event.delta > 0 && cam.w > 0.15) {
            cam.w -= 0.3;
        }
        cam.h = cam.w*height/width;
        if(cam.w > 5) {
            zoom = 1;
        }else if(cam.w > 2) {
            zoom = 2;
        }else {
            zoom = 4;
        }
        refreshCellSize();
    }
}

function mouseDragged() {
    /* ---------- Camera moving ---------- */
    if(mouseIn()) {
        if(!pointMoving) {
            for(var i=0; i<p.length; i++) {
                if((p[i].mouseOn() || p[i].active) ) {
                    pointMoving = true;
                    indexPointMoving = i;
                }else{
                    p[i].active = false;
                    $('#'+p[i].id).removeClass('active')
                }
            }
        }
        if(!elementMoving && !pointMoving) {
            for(var i=0; i<elements.length; i++) {
                if((elements[i].mouseOn() || elements[i].active) ) {
                    elementMoving = true;
                    indexElementMoving = i;
                }else{
                    elements[i].active = false;
                    $('#'+elements[i].id).removeClass('active')
                }
            }
        }
        if(!pointMoving && !elementMoving) {
            let previousMousePos = mousePos || {x: mouseX, y: mouseY};
            refreshMouse();
            let depX = -(mousePos.x-previousMousePos.x)/cellSize;
            let depY = (mousePos.y-previousMousePos.y)/cellSize;
            cam.move(depX,depY);
        }else{
            if(pointMoving) {
                // Make point move
                for(var i=0; i<p.length; i++) {
                    if(i != indexPointMoving) {
                        p[i].active = false;
                        $('#'+p[i].id).removeClass('active')
                    }
                }
                p[indexPointMoving].x = convertPosAbsToRel(mouseX,0).x;
                p[indexPointMoving].y = convertPosAbsToRel(0,mouseY).y;
            }
            if(elementMoving) {
                for(var i=0; i<elements.length; i++) {
                    if(i != indexElementMoving) {
                        elements[i].active = false;
                        $('#'+elements[i].id).removeClass('active')
                    }
                }
                if(elements[indexElementMoving] instanceof LongLine || elements[indexElementMoving] instanceof Line) {
                    let previousMousePos = mousePos || {x: mouseX, y: mouseY};
                    refreshMouse();
                    let depX = -(mousePos.x-previousMousePos.x)/cellSize;
                    let depY = (mousePos.y-previousMousePos.y)/cellSize;
                    elements[indexElementMoving].p1.x -= depX;
                    elements[indexElementMoving].p2.x -= depX;
                    elements[indexElementMoving].p1.y -= depY;
                    elements[indexElementMoving].p2.y -= depY;
                }
            }
        }
    }
    /* ----------------------------------- */
}

function mouseReleased() {
    if(pointMoving) {
        p[indexPointMoving].active = false;
        $('#'+p[indexPointMoving].id).removeClass('active');
        pointMoving = false;
        indexPointMoving = null;
    }
    if(elementMoving) {
        p[indexElementMoving].active = false;
        $('#'+elements[indexElementMoving].id).removeClass('active');
        elementMoving = false;
        indexElementMoving = null;
    }
}

function refreshMouse() {
    mousePos = {
        x: mouseX,
        y: mouseY
    }
}

function refreshCellSize() {
    cellSize = window.innerWidth/cam.w;
}

function doubleClicked() {
    let onAPoint = 0;
    for(var i=0; i<p.length; i++) {
        if(p[i].mouseOn()) {
            onAPoint = p[i];
        }
    }
    if(onAPoint != 0) {
        let s = prompt("x;y").split(";");
        onAPoint.x = s[0];
        onAPoint.y = s[1];
    }else{
        for(var i=0; i<elements.length; i++) {
            if(elements[i].mouseOn()) {
                if(elements[i] instanceof Circle) {
                    let s = prompt("r=? or d=?");
                    let t = (s[0] == 'r' ? 'r' : 'd');
                    s = s.slice(2);
                    elements[i].d = (t == 'd' ? s : 2*s);
                }
            }
        }
    }
    
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