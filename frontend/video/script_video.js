document.querySelector(".search_button").addEventListener('click', function() {
    const url = document.querySelector('.left_text_box').value;
    const urlValid = isValid(url)
    console.log('Is URL valid:', urlValid);
    if (urlValid) {
        console.log('Is URL valid:', urlValid);

        let thumbnail = document.querySelector('.thumbnail');
        // add thumbnail picture to the right side of =
        thumbnail.innerHTML ='' // youtube thumbnail;

        let summary =  document.querySelector('.summary')
        // fetched data to the right side of = 
        summary.innerHTML = '<br><br><br><br><br><br>Hello World'
    } else {
        alert("Invalid URL! Please enter a valid URL.");
    }

    // url validity checker 
   
})


function isValid(url){
    const urlPattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol (optional)
        '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)*[a-zA-Z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3})|' + // OR IP (v4) address
        'localhost)' + // OR localhost
        '(\\:\\d+)?' + // port (optional)
        '(\\/[-a-zA-Z\\d%_.~+]*)*' + // path (optional)
        '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // query string (optional)
        '(\\#[-a-zA-Z\\d_]*)?$' // fragment (optional)
    );

    return urlPattern.test(url);
}

