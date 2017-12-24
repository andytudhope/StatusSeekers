var booked;
var price = 1;

status.command({
    name: "start",
    description: "Start a new session",
    color: "#CCCCCC",
    handler: function (params) {
        return {
            "text-message": {
                type: "request",
                content: {
                    command: "price",
                    text: "The current Price is " + web3.fromWei(price, "ether") + ". Do you accept this price?"
                }
            }
        };
    },
    preview: function (params) {
        var text = status.components.text({
            style: {
                marginTop: 5,
                marginHorizontal: 0,
                fontSize: 14,
                fontFamily: "font",
                color: "black"
            }
        }, "Starting a new session...");
        return {markup: status.components.view({}, [text])};
    }
});

status.response({
    name: "price",
    description: "accepting the given price",
    color: "#a187d5",
    sequentialParams: true,
    params: [{
        name: "answer",
        type: status.types.TEXT,
        placeholder: "Yes or No",
    }],
    handler: function (params) {
        if (params.answer == "Yes") {
            return {
                "text-message": {
                    type: "request",
                    content: {
                        command: "book",
                        text: "Whenever you are ready, tap on this message to book. You will send " + web3.fromWei(price, "ether") + " ETH to the contract."
                    }
                }
            };    
        }
    },
    preview: function (params) {
        var text = status.components.text({
            style: {
                marginTop: 5,
                marginHorizontal: 0,
                fontSize: 14,
                fontFamily: "font",
                color: "black"
            }
        }, params.answer);
        return {markup: status.components.view({}, [text])};
    },
});


status.response({
    name: "book",
    description: "Book",
    color: "#a187d5",
    handler: function (params, context) {
        return {"text-message": "Booking successful. You can see that Transaction at " + transaction};
    },
    preview: function (params) {
        var text = status.components.text({
            style: {
                marginTop: 5,
                marginHorizontal: 0,
                fontSize: 14,
                fontFamily: "font",
                color: "black"
            }
        }, "Booking...");
        return {markup: status.components.view({}, [text])};
    }
});

status.command({
    name: 'end',
    description: 'End a running session',
    color: "#CCCCCC",
    registeredOnly: false,
    handler: function (params, context) {
        return {"text-message": "Successfully ended the Session"};
    },
    preview: function (params) {
        var text = status.components.text({
            style: {
                marginTop: 5,
                marginHorizontal: 0,
                fontSize: 14,
                fontFamily: "font",
                color: "black"
            }
        }, "Ending a running session...");
        return {markup: status.components.view({}, [text])};
    }
});

status.addListener('init', function (params, context) {
    var cnt = localStorage.getItem("cnt");
    if (!cnt) {
        cnt = 1;
        localStorage.setItem("cnt", cnt);
        return {'text-message': 'Welcome seeker! Knock on the sky and listen for the colour of the wind...'};
    }
});