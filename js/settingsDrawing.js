function turnActionHelp(param) {
    if(actionHelpDrawing) {
        switch(param) {
            case "on":
                $("#actionHelp").show();
                break;
            case "off":
                $("#actionHelp").hide();
        }
    }else{
        $("#actionHelp").hide();
    }
}

function drawActionHelpOrNot() {
    actionHelpDrawing = !actionHelpDrawing;
    if(actionHelpDrawing) {
        $("#actionHelp").show();
    }else{
        $("#actionHelp").hide();
    }
}

function setTextActionHelp(t) {
    $('#actionHelp').children('p').text(t);
}

function drawGridOrNot() {
    gridDrawing = !gridDrawing;
}