// Function to enable and disabled the POST button. 
$("#postTextarea").keyup(event => {
    var input = $(event.target)
    // Trim the value so the user is not able to print a post with only spaces.
    var value = input.val().trim()

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
    $.post("/api/posts", data, (postData, status, xhr) => {
        alert(postData)
    })
})