function mousePressed() {
    if(mouseIn()) {
        refreshMouse();
        let onAPoint = false;
        let indexPoint = null;
        let onAnElement = false;
        let indexElement = null;
        /*
            * Can't select an element and a point on the same time
            * Points have the priority on elements
        */
        for(var i=0; i<p.length; i++) {
            if(p[i].mouseOn()) {
                onAPoint = true;
                indexPoint = i;
                break;
            }
        }
        if(!onAPoint) {
            for(var i=0; i<elements.length; i++) {
                if(elements[i].mouseOn()) {
                    onAnElement = true;
                    indexElement = i;
                    break;
                }
            }
        }
        /* -------------------- */
        /* Zero point or element clicked */
        if(!onAPoint && !onAnElement && action == "") {
            /* Disable all elements */
            for(var i=0; i<p.length; i++) {
                p[i].active = false;
            }
            for(var i=0; i<elements.length; i++) {
                elements[i].active = false;
            }
        }
        /* -------------------- */
        if(action != "") {
            if(onAPoint) {
                actionPoints.push(p[indexPoint]);
            }else{
                if(!onAnElement) {
                    if(["point","line","longline","polygon","lagrange","circle"].includes(action)) {
                        newPoint(mouseX,mouseY);
                        actionPoints.push(lastPoint());
                    }
                }else{
                    actionElements.push(elements[indexElement]);
                }
            }
        }
        if(action != "") {
            switch(action) {
                case "point":
                    if(!onAPoint && !onAnElement) {
                        resetActionArray();
                    }
                    break;
                case "line":
                    if(actionPoints.length == 2) {
                        let e = new Line(actionPoints[0],actionPoints[1]);
                        elements.push(e);
                        addElementList(e.id);
                        addChildrenToPoint(e);
                        resetActionArray();
                    }
                case "longline":
                    if(actionPoints.length == 2) {
                        let e = new LongLine(actionPoints[0],actionPoints[1]);
                        elements.push(e);
                        addElementList(e.id);
                        addChildrenToPoint(e);
                        resetActionArray();
                    }
                    break;
                case "perpendicular":
                    if(actionElements.length == 1 && actionPoints.length == 1) {
                        let e = new LongLine(actionElements[0],actionPoints[0]);
                        elements.push(e);
                        addElementList(e.id);
                        addChildrenToPoint(e);
                        addChildrenToElement(e);
                        resetActionArray();
                    }else if(actionPoints.length == 1 && actionElements.length == 0){
                        actionPoints = new Array();
                    }
                    break;
                case "lagrange":
                    if(actionPoints.length > 1 && actionPoints[actionPoints.length-1] == actionPoints[0]) {
                        actionPoints = actionPoints.splice(0,actionPoints.length-1);
                        let e = new Polynomial("points",actionPoints);
                        elements.push(e);
                        addElementList(e.id);
                        nbPolynomials++;
                        addChildrenToPoint(e);
                        resetActionArray();
                    }
                    break;
                case "polygon":
                    if(actionPoints.length > 2 && actionPoints[0] == actionPoints[actionPoints.length-1]) {
                        let e = new Polygon(actionPoints);
                        elements.push(e);
                        addElementList(e.id);
                        addChildrenToPoint(e);
                        resetActionArray();
                    }
                    break;
                case "inter":
                    if(actionElements.length == 2) {
                        let e = new Intersection(actionElements[0],actionElements[1]);
                        elements.push(e);
                        addElementList(e.id);
                        addChildrenToElement(e);
                        resetActionArray();
                    }
                    break;
                case "integrale":
                    if(actionElements[0] instanceof Polynomial) {
                        let e = new Polynomial("integrale",actionElements[0]);
                        elements.push(e);
                        addElementList(e.id);
                        addChildrenToElement(e);
                        resetActionArray();
                    }else{
                        resetActionArray();
                    }
                    break;
                case "derivate":
                    if(actionElements[0] instanceof Polynomial) {
                        let e = new Polynomial("derivate",actionElements[0]);
                        elements.push(e);
                        addElementList(e.id);
                        addChildrenToElement(e);
                        
                    }else if(actionElements[0] instanceof Function) {
                        let expr = math.derivative(actionElements[0].expr,'x');
                        let e = new Function(expr);
                        elements.push(e);
                        addElementList(e.id);
                        addChildrenToElement(e);
                    }
                    resetActionArray();
                    break;
                case "circle":
                    if(actionPoints.length == 2) {
                        let m = mousePosInRel();
                        deletePointList(lastPoint());
                        p = p.splice(0,p.length-1);
                        actionPoints = [actionPoints[0]];
                        let e = new Circle(actionPoints[0],dist(m.x,m.y,actionPoints[0].x,actionPoints[0].y));
                        elements.push(e);
                        addElementList(e.id);
                        addChildrenToPoint(e);
                        resetActionArray();
                    }
                    break;
            }
        }
    }
}

/* ---------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------- */

function mouseDragged() {
    /* ---------- Camera moving ---------- */
    if(mouseIn()) {
        dragging = true;
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

/* ---------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------- */

function mouseReleased() {
    dragging = false;
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

/* ---------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------- */


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