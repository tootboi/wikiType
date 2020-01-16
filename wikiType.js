
$(document).ready(function() {
    //variable
    var wordCount = 0;
    var totTime = 0;
    var spanId = 0;
    var finalTime = 0;
    //for typing
    var charIndex = 0;

    //to call wikipedia API and create spans of characters
    $("button").click(function() {
        //reset charIndex, totTime, spandId, finalTime
        charIndex = 0;
        totTime = 0;
        spanId = 0;
        finalTime = 0;
        //clear the div
        $(type).empty();

        var title = $("#title").val();
        var url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + title;

        fetch(url)
            .then(function(response){return response.json();})
            .then(function(response) {
                //counts how many words there are. Counts number of whitespaces, then + 1.
                var regex = new RegExp(/\s/g);
                wordCount = response.extract.match(regex).length + 1;
                //console.log(wordCount);
                jQuery.map((response.extract + "").split(""), function(n) {
                    if (n.charCodeAt() != 10) {
                        $("#type").append("<span id="+spanId+">"+n+"</span>");
                        spanId += 1;
                    }
                })
            })
            .catch(function(error){console.log(error);});
    });
      
    //for triggering button when pressing enter in input
    $("#title").keypress(function(e){
        if (e.keyCode == 13) {
            $("button").click();
        }  
    });

    //for typing
    $("#type").focus(function(){
        //remove previous event handler. -- without this multiple events will be active at the same time.
        $("#type").off();
        $("#" + charIndex).addClass("focus");

        //starts timer
        var start = new Date;

        $("#type").keypress(function(e){
            //this prevents browswer shortcuts like ' to pop up.
            e.preventDefault();
            e.stopPropagation();
            //console.log(charIndex);
            //console.log(e.keyCode);
            if (String.fromCharCode(e.keyCode) == $("#"+charIndex).html()) { //for correct
                //remove all classes
                $("#" + charIndex).removeClass();
                //add green correct class on character
                $("#" + charIndex).addClass("correct");
                charIndex += 1;
                //remove all classes
                $("#" + charIndex).removeClass();
                //add focus to next character
                $("#" + charIndex).addClass("focus");
                //for completion
                if (charIndex == (spanId)) {
                    //stop timer
                    totTime += (new Date - start);
                    finalTime = totTime;
                    console.log(wordCount);
                    console.log(finalTime / 1000 + " seconds");
                    alert(Math.floor((60/(finalTime / 1000)) * wordCount) + " wpm");
                }
            } else {                                                         //for wrong
                //remove all classes
                $("#" + charIndex).removeClass();
                //add wrong class
                $("#" + charIndex).addClass("wrong");
                charIndex += 1;
                //add focus to next character
                $("#" + charIndex).addClass("focus");
                //for completion
                if (charIndex == (spanId)) {
                    //stop timer
                    totTime += (new Date - start);
                    finalTime = totTime;
                    console.log(wordCount);
                    console.log(finalTime / 1000 + " seconds");
                    alert(Math.floor((60/(finalTime / 1000)) * wordCount) + " wpm");
                }
            }
        });

        $("#type").keydown(function(e) {
            if (e.keyCode == 8) {                                    //for backspace
                if (charIndex > 0) {
                    //remove all classes
                    $("#" + charIndex).removeClass();
                    charIndex -= 1;
                    //remove all classes
                    $("#" + charIndex).removeClass();
                    $("#" + charIndex).addClass("focus");
                }
            }
        });

        $("#type").focusin(function(){
            $("#" + charIndex).addClass("focus");
            start = new Date;
            //console.log("focusin");
        });

        $("#type").focusout(function(){
            $("#" + charIndex).removeClass();
            totTime += (new Date - start);
            //console.log(totTime / 1000 + " seconds")
            //console.log("focusout");
        });
    });

}); 