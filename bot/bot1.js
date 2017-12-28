status.command({
    name: "greet",
    title: "Greeter",
    description: "Helps you choose greetings",
    color: "#0000ff",
    params: [{
             name: "greet",
             type: status.types.TEXT,
             suggestions: helloSuggestions
            }]
});

function suggestionsContainerStyle(suggestionsCount) {
   return {
       marginVertical: 1,
       marginHorizontal: 0,
       keyboardShouldPersistTaps: "always",
       height: Math.min(150, (56 * suggestionsCount)),
       backgroundColor: "white",
       borderRadius: 5,
       flexGrow: 1
   };
}
var suggestionSubContainerStyle = {
   height: 56,
   borderBottomWidth: 1,
   borderBottomColor: "#0000001f"
};

var valueStyle = {
   marginTop: 9,
   fontSize: 14,
   fontFamily: "font",
   color: "#000000de"
};

function helloSuggestions() {
   var suggestions = ["Hello", "Goodbye"].map(function(entry) {
       return status.components.touchable(
           {onPress: status.components.dispatch([status.events.SET_VALUE, entry])},
           status.components.view(
               suggestionsContainerStyle,
               [status.components.view(
                   suggestionSubContainerStyle,
                   [
                       status.components.text(
                           {style: valueStyle},
                           entry
                       )
                   ]
               )]
           )
       );
   });

   // Let's wrap those two touchable buttons in a scrollView
   var view = status.components.scrollView(
       suggestionsContainerStyle(2),
       suggestions
   );

   // Give back the whole thing inside an object.
   return {markup: view};
}

status.addListener("on-message-send", function (params, context) {
    var result = {
            err: null,
            data: null,
            messages: ["Hello"]
        };

    try {
        result["text-message"] = "Hello! You're amazing, master!";
    } catch (e) {
        result.err = e;
    }

    return result;
});



