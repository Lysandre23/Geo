const width = window.innerWidth*0.75,
      height = window.innerHeight*0.99

var cam = new Camera();
var cellSize = window.innerWidth/cam.w;
var mousePos;
var zoom = 1;
var action = "";
var actionPoints = new Array();
var actionElements = new Array();
var drawCircleWhenCreating = false;
var pointMoving = false;
var indexPointMoving = null;
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
}

function draw() { 
    background(255);
    translate(width/2,height/2);
    refreshMouse();
    drawGrid();
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
            break;
    }
}

function disableToolsButton() {
    action = "";
    actionPoints = new Array();
    actionElements = new Array();
    $('.toolsButton').each(function() {
        $(this).removeClass('active');
    });
}

function mousePressed() {
    if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        refreshMouse();
        /*
            * Can't select an element and a point on the same time
            * Points have the priority on elements
        */
        let onAPoint = 0;
        for(var i=0; i<p.length; i++) {
            if(p[i].mouseOn()) {
                onAPoint = p[i];
            }
        }
        if(onAPoint == 0) {
            for(var i=0; i<elements.length; i++) {
                if(elements[i].mouseOn()) {
                    elements[i].active = !elements[i].active;
                    if(action != "") {
                        actionElements.push(elements[i]);
                        switch(action) {
                            case "inter":
                                if(actionElements.length == 2) {
                                    let e = new Intersection(actionElements[0],actionElements[1]);
                                    elements.push(e);
                                    addElementList(e.id);
                                    for(var k=0; k<actionElements.length; k++) {
                                        actionElements[k].children.push(e);
                                    }
                                    actionElements = new Array();
                                    actionPoints = new Array();
                                }
                                break;
                            case "integrale":
                                if(actionElements[0] instanceof Polynomial) {
                                    let e = new Polynomial(actionElements[0], "integrale");
                                    elements.push(e);
                                    addElementList(e.id);
                                    actionElements[0].children.push(e);
                                    actionPoints = new Array();
                                }
                                actionElements = new Array();
                                for(var i=0; i<elements.length; i++) {
                                    elements[i].active = false;
                                }
                            case "derivate":
                                if(actionElements.length == 1) {
                                    if(actionElements[0] instanceof Polynomial) {
                                        let e = new Polynomial(actionElements[0], "derivate");
                                        elements.push(e);
                                        addElementList(e.id);
                                        actionPoints = new Array();
                                        actionElements[0].children.push(e);
                                    }
                                    actionElements = new Array();
                                } 
                                for(var i=0; i<elements.length; i++) {
                                    elements[i].active = false;
                                }
                            case "angle":
                                if(actionElements.length == 2) {
                                    if(actionElements[0] instanceof LongLine && actionElements[1] instanceof LongLine) {
                                        
                                    }
                                }
                        }
                    }
                }else{
                    elements[i].active = false;
                }
            }
        }
        if(onAPoint != 0) {
            if(action != "") {
                actionPoints.push(onAPoint);
                switch(action) {
                    case "line":
                        if(actionPoints.length == 2) {
                            let e = new Line(actionPoints[0],actionPoints[1]);
                            elements.push(e);
                            addElementList(e.id);
                            for(var i=0; i<actionPoints.length; i++) {
                                actionPoints[i].children.push(e);
                            }
                            actionPoints = new Array();
                            actionElements = new Array();
                        }
                        break;
                    case "circle":
                        if(actionPoints.length == 1) {
                            drawCircleWhenCreating = true;
                        }
                        break;
                    case "longline":
                        if(actionPoints.length == 2) {
                            let e = new LongLine(actionPoints[0],actionPoints[1]);
                            elements.push(e);
                            addElementList(e.id);
                            for(var i=0; i<actionPoints.length; i++) {
                                actionPoints[i].children.push(e);
                            }
                            actionPoints = new Array();
                            actionElements = new Array();
                        }
                        break;
                    case "polygon":
                        if(actionPoints.length > 2 && actionPoints[0] == actionPoints[actionPoints.length-1]) {
                            let e = new Polygon(actionPoints);
                            elements.push(e);
                            addElementList(e.id);
                            for(var i=0; i<actionPoints.length; i++) {
                                actionPoints[i].children.push(e);
                            }
                            actionPoints = new Array();
                            actionElements = new Array();
                        }
                        break;
                    case "lagrange":
                        if(actionPoints[actionPoints.length-1] == actionPoints[0] && actionPoints.length > 1) {
                            actionPoints = actionPoints.splice(0,actionPoints.length-1);
                            let coeff = Lagrange(actionPoints);
                            let e = new Polynomial(coeff,actionPoints);
                            elements.push(e);
                            nbPolynomials++;
                            addElementList(e.id);
                            for(var i=0; i<actionPoints.length; i++) {
                                actionPoints[i].children.push(e);
                            }
                            actionPoints = new Array();
                            actionElements = new Array();
                        }
                        break;
                }
            }else{
                /* For the moment */
                for(var i=0; i<elements.length; i++) {
                    elements[i].active = false;
                }
                onAPoint.active = !onAPoint.active;
                if(onAPoint.active) {
                    activePoint = true;
                }else{
                    activePoint = false;
                }
            }
        }else{
            /* Some actions don't use points to step up */ /* Almost all */
            if(action != "") {
                /* Circle case : second step : radius estimation */
                switch(action) {
                    case "circle":
                        if(actionPoints.length == 1) {
                            let m = {
                                x: convertPosAbsToRel(mouseX,mouseY).x,
                                y: convertPosAbsToRel(mouseX,mouseY).y
                            };
                            let e = new Circle(actionPoints[0],dist(m.x,m.y,actionPoints[0].x,actionPoints[0].y));
                            addElementList(e.id);
                            actionPoints[0].children.push(e);
                            elements.push(e);
                            actionPoints[0].children.push(e);
                            actionPoints = new Array();
                        }else{
                            newPoint(mouseX,mouseY);
                            actionPoints.push(p[p.length-1]);
                        }
                        break;
                    /* Line and LongLine can create point when creating rather than spawn on existing points */
                    case "line":
                        if(actionPoints.length == 0) {
                            newPoint(mouseX,mouseY);
                            actionPoints.push(p[p.length-1]);
                        }else if(actionPoints.length == 1) {
                            newPoint(mouseX,mouseY);
                            actionPoints.push(p[p.length-1]);
                            let e = new Line(actionPoints[0],actionPoints[1]);
                            for(var i=0; i<actionPoints.length; i++) {
                                actionPoints[i].children.push(e);
                            }
                            elements.push(e);
                            addElementList(e.id);
                            actionPoints = new Array();
                            actionElements = new Array();
                        }
                        break;
                    case "longline":
                        if(actionPoints.length == 0) {
                            newPoint(mouseX,mouseY);
                            actionPoints.push(p[p.length-1]);
                        }else if(actionPoints.length == 1) {
                            newPoint(mouseX,mouseY);
                            actionPoints.push(p[p.length-1]);
                            let e = new LongLine(actionPoints[0],actionPoints[1]);
                            for(var i=0; i<actionPoints.length; i++) {
                                actionPoints[i].children.push(e);
                            }
                            elements.push(e);
                            addElementList(e.id);
                            actionPoints = new Array();
                            actionElements = new Array();
                        }
                        break;
                    case "polygon":
                        newPoint(mouseX,mouseY);
                        actionPoints.push(p[p.length-1]);
                        break;
                    case "lagrange":
                        newPoint(mouseX,mouseY);
                        actionPoints.push(p[p.length-1]);
                }

                
            }
        }
        /* SPECIAL COMMAND : NEW POINT */
        /* --------------------------- */
        if(action == "point") {
            newPoint(mouseX,mouseY);
            //$('.points').append('<div id="' + c + '" class="pointList"><div class="colorContainer"><div class="color"></div></div><div class="content"></div></div>');
        }
        /* --------------------------- */
        /* --------------------------- */
        if(onAPoint == 0 && action == "") {
            /*
            for(var i=0; i<elements.length; i++) {
                elements[i].active = false;
                
            }
            */
            for(var i=0; i<p.length; i++) {
                p[i].active = false;
            }
        }
    }
}

function newPoint(mouseX,mouseY) {
    let m = {
        x: convertPosAbsToRel(mouseX,mouseY).x,
        y: convertPosAbsToRel(mouseX,mouseY).y
    }
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
        if(!pointMoving) {
            let previousMousePos = mousePos || {x: mouseX, y: mouseY};
            refreshMouse();
            let depX = -(mousePos.x-previousMousePos.x)/cellSize;
            let depY = (mousePos.y-previousMousePos.y)/cellSize;
            cam.move(depX,depY);
        }else{
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

function convertPosRelToAbs(a,b) {
    return {
        x: (a-cam.x)*cellSize,
        y: -(b-cam.y)*cellSize
    }
}

function convertPosAbsToRel(a,b) {
    return {
        x: -(-cam.x-(a-width/2)/cellSize),
        y: (cam.y-(b-height/2)/cellSize)
    }
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

function setAction(param,bt) {
    $('.toolsButton').each(function() {
        if($(this).attr('id') != param) {
            $(this).removeClass('active');
        }
    });
    if(param == action) {
        $(bt).removeClass('active');
    }else{
        $(bt).addClass('active');
    }
    action = (action != param ? param : "");
    actionPoints = new Array();
}

function drawActionInfo() {
    switch(action) {
        case "point":
            let m1 = {
                x: convertPosAbsToRel(mouseX,mouseY).x,
                y: convertPosAbsToRel(mouseX,mouseY).y
            }
            fill(0);
            stroke(0);
            circle(mouseX-width/2,mouseY-height/2,13);
            break;
        case "line":
            if(actionPoints.length == 1) { 
                let m2 = {
                    x: convertPosRelToAbs(actionPoints[0].x,actionPoints[0].y).x,
                    y: convertPosRelToAbs(actionPoints[0].x,actionPoints[0].y).y
                }
                stroke(0);
                strokeWeight(2);
                line(mouseX-width/2,mouseY-height/2,m2.x,m2.y);
            }
            break;
        case "longline":
            if(actionPoints.length == 1) {
                let m2 = {
                    x: convertPosRelToAbs(actionPoints[0].x,actionPoints[0].y).x,
                    y: convertPosRelToAbs(actionPoints[0].x,actionPoints[0].y).y
                }
                stroke(0);
                strokeWeight(2);
                let vec = {
                    x: m2.x-(mouseX-width/2),
                    y: (m2.y-(mouseY-height/2))
                }
                line(m2.x+vec.x*width,m2.y+vec.y*width,m2.x-vec.x*width,m2.y-vec.y*width)
            }
            break;
        case "circle":
            if(actionPoints.length == 1) {
                let m3 = {
                    x: convertPosRelToAbs(actionPoints[0].x,actionPoints[0].y).x,
                    y: convertPosRelToAbs(actionPoints[0].x,actionPoints[0].y).y
                }
                stroke(0);
                let m = {
                    x: convertPosAbsToRel(mouseX,mouseY).x,
                    y: convertPosAbsToRel(mouseX,mouseY).y
                }
                let r = dist(actionPoints[0].x,actionPoints[0].y,m.x,m.y);
                noFill();
                strokeWeight(2);
                circle(m3.x,m3.y,cellSize*2*dist(actionPoints[0].x,actionPoints[0].y,m.x,m.y));
                line(m3.x,m3.y,mouseX-width/2,mouseY-height/2);
                let a = atan2(mouseX-width/2-m3.x,mouseY-height/2-m3.y)-Math.PI/2;
                fill(0);
                noStroke();
                let signIncrementAngle = (m3.x-(mouseX-width/2))/abs((m3.x-(mouseX-width/2)));
                text("r="+Math.round(r*100)/100,m3.x+cos(a+0.3*signIncrementAngle*(signIncrementAngle < 0 ? 1 : 2))*0.7*cellSize*r,m3.y-sin(a+0.3*signIncrementAngle*(signIncrementAngle < 0 ? 1 : 2))*0.7*cellSize*r);
            }
            break;
        case "polygon":
            stroke(100);
            strokeWeight(1);
            fill(200,200,200,50);
            beginShape();
            for(var i=0; i<actionPoints.length; i++) {
                let coords = {
                    x: convertPosRelToAbs(actionPoints[i].x,actionPoints[i].y).x,
                    y: convertPosRelToAbs(actionPoints[i].x,actionPoints[i].y).y
                }
                vertex(coords.x,coords.y);
            }
            vertex(mouseX-width/2,mouseY-height/2);
            endShape(CLOSE);
            break;
    }
}

function selectPointByList(item) {
    disableToolsButton();
    let code = $(item).parent().parent().attr('id');
    for(var i=0; i<elements.length; i++) {
        if(elements[i].id == code) {
            elements[i].active = !elements[i].active;
            break;
        }else{
            elements[i].active = false;
        }
    }
    for(var i=0; i<p.length; i++) {
        if(p[i].id == code) {
            p[i].active = !p[i].active;
            break;
        }else{
            p[i].active = false;
        } 
    }
}

function changeColor(item) {
    let code = $(item).parent().parent().attr('id');
    for(var i=0; i<elements.length; i++) {
        if(elements[i].id == code) {
            elements[i].color = generateColor();
            break;
        }
    }
    for(var i=0; i<p.length; i++) {
        if(p[i].id == code) {
            p[i].color = generateColor();
            break;
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

function addElementList(code) {
    $('.list').append('<div id="' + code + '" class="pointList"><div class="colorContainer"><button class="color" ondblclick="changeColor(this)" onclick="selectPointByList(this)"></button></div><div class="content"></div></div>');
}

function roundPosition() {
    for(var i=0; i<p.length; i++) {
        if(p[i].active) {
            p[i].x = Math.round(p[i].x);
            p[i].y = Math.round(p[i].y);
            p[i].active = false;
        }
    }
}

function interpolation(f,x) {
    
}