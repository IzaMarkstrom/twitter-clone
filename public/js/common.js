// Function to enable and disabled the POST button. 
$("#postTextarea").keyup(event => {
    var textbox = $(event.target)
    // Trim the value so the user is not able to print a post with only spaces.
    var value = textbox.val().trim()

    var submitBtn = $("#submitPostBtn")

    if(submitBtn.length == 0) return alert("No submit button found")

    if(value == ""){
        submitBtn.prop("disabled", true)
        return
    }
    submitBtn.prop("disabled", false)
})

$("#submitPostBtn").click(() => {
    var button = $(event.target)
    var textbox = $("#postTextarea")

    var data = {
        content: textbox.val()
    }
   // Sending the data to the url and adding a callback function.
    $.post("/api/posts", data, postData => {
        
        var html = createPostHtml(postData);
        $(".postContainer").prepend(html);
        textbox.val("");
        button.prop("disabled", true);
    })
})

function createPostHtml(postData) {

    var postedBy = postData.postedBy

    if(postedBy._id === undefined){
        return console.log("User object not populated.")
    }

    var displayName = postedBy.username
    var timestamp = timeDifference(new Date(), new Date(postData.createdAt))

    return `<div class="post">
                <div class="mainContainer">
                    <div class="userImageContainer">
                        <img src="${postedBy.profilePic}">
                    </div>
                    <div class="postContentContainer">
                        <div class="header">
                            <a href="/profile/${postedBy.username}">${displayName}</a>
                            <span class="date">${timestamp}</span>
                        </div>
                        <div class="postBody">
                            <span>${postData.textContent}</span>
                        </div>
                        <div class="postFooter">
                            <div>
                                <button>
                                    <i class="fa-solid fa-comment"></i>
                                </button>
                            </div>
                            <div>
                                <button>
                                    <i class="fa-solid fa-retweet"></i>
                                </button>
                            </div>
                            <div>
                                <button>
                                    <i class="fa-solid fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000 < 30) return "Just now"

         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}