function keyPressed() {
    switch(keyCode) {
        case 8: /* DELETE */
            for(var i=0; i<p.length; i++) {
                if(p[i].mouseOn() || p[i].active) {
                    for(var j=0; j<p[i].children.length; j++) {
                        p[i].children[j].dead = true;
                        $("#"+p[i].children[j].id).remove();
                        if(p[i].children[j] instanceof Polynomial) {
                            p[i].children[j].die();
                        }
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
                        if(elements[i] instanceof Polynomial) {
                            elements[i].children[j].die();
                        }
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