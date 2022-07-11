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
                                    setTextActionHelp("Select the first line");
                                }
                                if(actionElements.length == 1) {
                                    setTextActionHelp("Select the second line");
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
                                break;
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
                        if(actionPoints.length == 1) {
                            setTextActionHelp("Select the second point");
                        }
                        break;
                    case "circle":
                        if(actionPoints.length == 1) {
                            drawCircleWhenCreating = true;
                        }
                        setTextActionHelp("Set the radius");
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
                        if(actionPoints.length == 1) {
                            setTextActionHelp("Select the second point");
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
                        }else{
                            setTextActionHelp("Add point, select the first point to complete");
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
                        }else{
                            setTextActionHelp("Add point, select the first point to complete");
                        }
                        break;
                    case "perpendicular":
                        if(actionElements.length == 1) {
                            let e = new LongLine(actionElements[0],actionPoints[0]);
                            addElementList(e.id);
                            elements.push(e);
                            actionElements = new Array();
                            actionPoints = new Array();
                        }else{
                            setTextActionHelp("Select a point");
                            actionPoints = new Array();
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
                            setTextActionHelp("Select the second point");
                        }else if(actionPoints.length == 1) {
                            newPoint(mouseX,mouseY);
                            actionPoints.push(p[p.length-1]);
                            let e = new Line(actionPoints[0],actionPoints[1]);
                            for(var i=0; i<actionPoints.length; i++) {
                                actionPoints[i].children.push(e);
                            }
                            elements.push(e);
                            addElementList(e.id);
                            setTextActionHelp("Select the first point");
                            actionPoints = new Array();
                            actionElements = new Array();
                        }
                        break;
                    case "longline":
                        if(actionPoints.length == 0) {
                            newPoint(mouseX,mouseY);
                            actionPoints.push(p[p.length-1]);
                            setTextActionHelp("Select the second point");
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
                            setTextActionHelp("Select the first point");
                        }
                        break;
                    case "polygon":
                        newPoint(mouseX,mouseY);
                        actionPoints.push(p[p.length-1]);
                        setTextActionHelp("Add point, select the first point to complete");
                        break;
                    case "lagrange":
                        newPoint(mouseX,mouseY);
                        actionPoints.push(p[p.length-1]);
                        setTextActionHelp("Add point, select the first point to complete");
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