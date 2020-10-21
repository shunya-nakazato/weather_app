$(function(){
    Push.Permission.request();

    var now_date = Date.now();

    setInterval(function(){
        Push.create("Hello world!", {
            body: "How's it hangin'?",
            timeout: 4000,
            onClick: function () {
                window.focus();
                this.close();
            }
        });
    }, 10000)
})