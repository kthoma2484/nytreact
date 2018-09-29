// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      //
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
  });
  
  
  // Whenever someone clicks scrap botton
  $(document).on("click", "#scrape", function() {

    // Make an ajax call to scrap articles
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the  information to the page
      .then(function(data) {
        console.log(data);
      
  });
  
  });