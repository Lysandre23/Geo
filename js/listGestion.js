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

function addElementList(code) {
    $('.list').append('<div id="' + code + '" class="pointList"><div class="colorContainer"><button class="color" ondblclick="changeColor(this)" onclick="selectPointByList(this)"></button></div><div class="content"></div></div>');
}

function disableToolsButton() {
    action = "";
    actionPoints = new Array();
    actionElements = new Array();
    $('.toolsButton').each(function() {
        $(this).removeClass('active');
    });
}