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
        case "perpendicular":
            if(actionElements.length == 1) {
                let m = convertPosAbsToRel(mouseX,mouseY);
                let a = actionElements[0].b;
                let b = -actionElements[0].a;
                let c = actionElements[0].a*m.y-actionElements[0].b*m.x;
                let xLeftCorner = cam.x-cam.w/2;
                let xRightCorner = cam.x+cam.w/2;
                let yLeftCorner = -(a*xLeftCorner+c)/b;
                let yRightCorner = -(a*xRightCorner+c)/b;
                let c1 = convertPosRelToAbs(xLeftCorner,yLeftCorner);
                let c2 = convertPosRelToAbs(xRightCorner,yRightCorner);
                stroke(0);
                strokeWeight(2);
                if(this.b != 0) {
                    line(c1.x,c1.y,c2.x,c2.y);
                }else{
                    line(mouseX,-height/2,mouseX,height/2);
                }
            }
            break;
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
        turnActionHelp("off");
    }else{
        $(bt).addClass('active');
        turnActionHelp("on");
        switch(param) {
            case "point":
                turnActionHelp("off");
                break;
            case "line":
                setTextActionHelp("Select the first point");
                break;
            case "longline":
                setTextActionHelp("Select the first point");
                break;
            case "lagrange":
                setTextActionHelp("Add point, select the first point to complete");
                break;
            case "polygon":
                setTextActionHelp("Add point, select the first point to complete");
                break;
            case "inter":
                setTextActionHelp("Select the first line");
        }
    }
    action = (action != param ? param : "");
    actionPoints = new Array();
}