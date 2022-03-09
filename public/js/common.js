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



// Since the heart btn is dynamic content, it doesn't load until the page is ready.
// Which means that the time this code execute, the btns are not on the page.
$(document).on("click", ".likeBtn", (event) => {
    var button = $(event.target)
    var postId = getPostId(button)
    
    if(postId === undefined) return

    // Since we can't write $.put in ajax.
    $.ajax({
        url: `/api/posts/${postId}/like`, 
        type: "PUT",
        success: (postData) => {
            
            button.find("span").text(postData.likes.length || "")

            if(postData.likes.includes(userLoggedIn._id)){
                button.addClass("active")
            } else {
                button.removeClass("active")
            }
        }
    })
})

$(document).on("click", ".retweetBtn", (event) => {
    var button = $(event.target)
    var postId = getPostId(button)
    
    if(postId === undefined) return

    // Since we can't write $.put in ajax.
    $.ajax({
        url: `/api/posts/${postId}/retweet`, 
        type: "POST",
        success: (postData) => {
            
            console.log(postData)
            // button.find("span").text(postData.likes.length || "")

            // if(postData.likes.includes(userLoggedIn._id)){
            //     button.addClass("active")
            // } else {
            //     button.removeClass("active")
            // }
        }
    })
})

$(document).on("click", ".post", (event) => {
    var element = $(event.target)
    var postId = getPostId(element)

    if(postId !== undefined && !element.is("button")){
        window.location.href = "/posts/" + postId
    }
})


function getPostId(element) {
    var isRoot = element.hasClass("post")
    // .closest is a jquery function that goes up through the DOM three to find a parent with this class. 
    var rootElement = isRoot ? element : element.closest(".post")
    var postId = rootElement.data().id

    if(postId === undefined) return alert("Post id is undefined")    

    return postId
}

function createPostHtml(postData) {

    var postedBy = postData.postedBy;

    if(postedBy._id === undefined) {
        return console.log("User object not populated");
    }

    var displayName = postedBy.username
    var timestamp = timeDifference(new Date(), new Date(postData.createdAt))

    return `<div class="post" data-id="${postData._id}">
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
                            <div class="postBtnContainer">
                                <button>
                                    <i class="fa-solid fa-comment"></i>
                                </button>
                            </div>
                            <div class="postBtnContainer green">
                                <button class="retweetBtn">
                                    <i class="fa-solid fa-retweet"></i>
                                </button>
                            </div>
                            <div class="postBtnContainer red">
                                <button class="likeBtn">
                                    <i class="fa-solid fa-heart"></i>
                                    <span>${postData.likes.length || ""}</span>
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

function outputPosts(results, container) {
    container.html("");

    if(!Array.isArray(results)) {
        results = [results];
    }

    results.forEach(result => {
        var html = createPostHtml(result)
        container.append(html);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
}