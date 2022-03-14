(function($){
  $(function(){
    $('.sidenav').sidenav();
  }); 
})(jQuery);

$(document).ready(function() {
  stopIntroAnimation();
  getBooksWhileTyping($('#myInput'));
  colorfulBg();
  setUpBookAnimation();
  setUpBackToSearchBtn();
  checkWindowSize();
});

$(window).resize(function(){
  checkWindowSize();
});

var checkWindowSize = function() {
  var ww = document.body.clientWidth;
  if (ww < 600) {
    $('.card').removeClass('horizontal');
  } else if (ww >= 601) {
    $('.card').addClass('horizontal');
  };
};

function setUpBackToSearchBtn() {
  $('.btn-back-search').click(function() {
    $('.autocomplete').removeClass('d-none').fadeIn('slow');
    $('.output').html('');
    $('.btn-back-search').fadeOut('slow');
    $('.spinning-books').fadeIn('slow').removeClass('d-none');
  });
}

function setUpBookAnimation() {
  $('.click-book-animation').click(function() {
    startIntroAnimation();
  });
}

function startIntroAnimation() {
  $('.main-search-page').fadeOut('slow');
  $('.page-footer').fadeOut('slow');
  $('.navigation-wrapper').fadeOut('slow');
  $('#book-pile-wrapper').fadeIn('slow');
  stopIntroAnimation();
}

function stopIntroAnimation() {
  setTimeout(function() {
      $('.main-search-page').fadeIn('slow').removeClass('d-none');
      $('.page-footer').fadeIn('slow').removeClass('d-none');
      $('.navigation-wrapper').fadeIn('slow').removeClass('d-none');
      $('#book-pile-wrapper').fadeOut('slow');
  }, 3500);
}

function colorfulBg() {
  // Some random colors
  const colors = ["#3CC157", "#2AA7FF", "#1B1B1B", "#FCBC0F", "#F85F36"];

  const numBalls = 50;
  const balls = [];

  for (let i = 0; i < numBalls; i++) {
    let ball = document.createElement("div");
    ball.classList.add("ball");
    ball.style.background = colors[Math.floor(Math.random() * colors.length)];
    ball.style.left = `${Math.floor(Math.random() * 100)}vw`;
    ball.style.top = `${Math.floor(Math.random() * 100)}vh`;
    ball.style.transform = `scale(${Math.random()})`;
    ball.style.width = `${Math.random()}em`;
    ball.style.height = ball.style.width;
    
    balls.push(ball);
    // document.body.append(ball);
    document.getElementById('book-pile-wrapper').prepend(ball);
  }

  // Keyframes
  balls.forEach((el, i, ra) => {
    let to = {
      x: Math.random() * (i % 2 === 0 ? -11 : 11),
      y: Math.random() * 12
    };

    let anim = el.animate(
      [
        { transform: "translate(0, 0)" },
        { transform: `translate(${to.x}rem, ${to.y}rem)` }
      ],
      {
        duration: (Math.random() + 1) * 2000, // random duration
        direction: "alternate",
        fill: "both",
        iterations: Infinity,
        easing: "ease-in-out"
      }
    );
  });
}

function getBooksWhileTyping(inputEl) {
  $('#myInput').keyup(function(event) {
    var element = document.getElementById("loading-css");
    element.classList.remove("d-none");
    $('.output').html('');
    let a, b, i, val = this.value;
    closeAllLists();
    if (!val) { 
        closeAllLists();
        element.classList.add("d-none");
        return false;
    }
    fetch(`https://openlibrary.org/search.json?q=${$('#myInput').val()}&limit=10`)
    .then(a=>a.json())
    .then(response=>{
        closeAllLists();
      console.log(response);
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      
      for (i = 0; i < response.docs.length; i++) {
          let coverArtImg;
          if (!response.docs[i].cover_i) {
              coverArtImg = `/img/cover-img.png`;
          } else {
              coverArtImg = `https://covers.openlibrary.org/b/id/${response.docs[i].cover_i}-S.jpg`;
          }
          b = document.createElement("DIV");
          b.setAttribute("class", "flex box");
          b.innerHTML = `<div class="cover-img-wrapper"><img class="type-cover-img" src="${coverArtImg}" alt=""></div>`;
          b.innerHTML += `<div><a data-id="${response.docs[i].title}" data-key="${response.docs[i].key}" data-author-key="${response.docs[i].author_key[0]}"class="purple-text book-titles" onclick="getBookDetails(this)">` + response.docs[i].title + "</a><br>by: " + response.docs[i].author_name[0] + "</div>";
          b.addEventListener("click", function(e) {
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });

          window.addEventListener('click', function(e){   
              if (document.getElementById('myInputautocomplete-list') && document.getElementById('myInputautocomplete-list').contains(e.target)){
              } else {
                // Clicked outside the box
                closeAllLists();
                $('#myInput').val('');
              }
          });
          element.classList.add("d-none");
          a.appendChild(b);
        }
        if (!response.docs.length || response.numFound == 0 || response.num_found == 0) {
          $('.output').html(`<span class="no-such-results">No Such Results</span>`);
          closeAllLists();
          element.classList.add("d-none");
        }
      });
      const keycode = (event.keyCode ? event.keyCode : event.which);
      if (keycode == '13') {
        event.preventDefault();
        closeAllLists();
        getBooks();
      }
  });
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inputEl) {
          x[i].parentNode.removeChild(x[i]);
      }
    }
  }
}

function getBookDetails(identifier) {
  $('.autocomplete').addClass('d-none');
  $('.spinning-books').fadeOut('slow').addClass('d-none');
  $('.btn-back-search').removeClass('d-none').fadeIn('slow');

  const authorKey = $(identifier).data('author-key'); 
  let authorName = '';
  let authorBio = 'No Bio Yet';
  let authorBioHtml = '';
  let authorWiki = '';
  let authorWikiHtml = '';
  let authorPhoto = '';
  let authorPhotoHtml = '';
  fetch(`https://openlibrary.org/authors/${authorKey}.json`)
    .then(a=>a.json())
    .then(response=>{
        // console.log('author info: ',response);
        authorName = response.name;
        if (response.bio) {
          authorBio = response.bio;
          if (response.bio.value) {
            authorBio = response.bio.value;
          }
        }
        authorBioHtml = `<div class="card-content">Biography: ${authorBio}</div>`;
        if (response.wikipedia) {
          authorWiki = response.wikipedia;
          authorWikiHtml = `<div class="card-action">
                            <a class="purple-text" href="${authorWiki}" target="_blank">Author Wikipedia</a>
                          </div>`;
        }

        authorPhoto = `https://covers.openlibrary.org/a/olid/${authorKey}.jpg`; // https://covers.openlibrary.org/a/$key/$value-$size.jpg, ex: https://covers.openlibrary.org/a/olid/OL229501A-S.jpg
        authorPhotoHtml = `<img class="author-photo" src="${authorPhoto}" alt="author photo">`;
    }
  );

  const bookKey = $(identifier).data('key');
  fetch(`https://openlibrary.org${bookKey}.json`)
  .then(a=>a.json())
  .then(response=>{
    console.log(response);
    let outputText = '';
    let coverArtImg = `/img/cover-img.png`; // placeholder
    let bookDescription = '';
    let subjectMatters = '';

    if (response.covers && response.covers.length) {
      coverArtImg = `https://covers.openlibrary.org/b/id/${response.covers[0]}-L.jpg`;
    }
    
    if (response.description) {
      bookDescription = `<p class="description-box"><span class="text-bold">Description: ${response.description}</span>`;
      if (response.description.value) {
        bookDescription = `<p class="description-box"><span class="text-bold">Description: ${response.description.value}</span>`;
      } 
    } 
    if (response.subjects && response.subjects.length) {
      subjectMatters = `<p><span class="text-bold">Subject: `;
      response.subjects.forEach(function(subject){
        subjectMatters += `<span class="subject-matters">${subject}</span>`;
      });
      subjectMatters += `<span>`;
    }
    
    outputText += `
      <div class="col s12 m7">
        <div class="card horizontal">
            <div class="card-image">
              <img class="cover-img cover-img-searched" src="${coverArtImg}" alt="">
            </div>
            <div class="card-stacked">
              <div class="card-content">
                <h5>${response.title}</h5>
                <ul class="collapsible">
                  <li>
                    <div class="collapsible-header purple-text"><i class="material-icons">account_box</i>
                      <span class="text-bold">By:&nbsp;</span>${authorName}
                    </div>
                    <div class="collapsible-body">
                      <div class="card">
                        <div class="card-image">
                          ${authorPhotoHtml}
                        </div>
                        <div class="card-stacked">
                          ${authorBioHtml}
                          ${authorWikiHtml}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                ${bookDescription}
                ${subjectMatters}
              </div>
            </div>
          </div>
      </div>`;
    $('.output').html(outputText);
    $('.collapsible').collapsible();
    checkWindowSize();
  });
}