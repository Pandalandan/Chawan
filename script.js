"use strict";

// ===================== SHOP: LOAD PRODUCTS VIA AJAX =====================
$(function () {

   // This is the web address (URL) of our "backend" server using postman. 
   const mockUrl = "https://a84b49fe-c46b-440f-94f2-6d0b0ce99c53.mock.pstmn.io/products";

   // $.get() sends a request to that URL. If it works, the function inside runs and "products" will be the array of product objects we get back.
   $.get(mockUrl, function (products) {
      let html = "";

      // Loop through every product we got back and turn each one into a little HTML "card" with an image, name, price, and two icons.
      for (const product of products) {
         html += `
            <div class="product-card" data-id="${product.id}">
               <div class="product-image-wrap">
                  <img src="images/${product.image}" alt="${product.name}">
                  <button class="favorite-icon" aria-label="Favorite">&#9825;</button>
                  <button class="cart-icon" aria-label="Add to cart">&#128722;</button>
               </div>
               <div class="product-info">
                  <p class="product-name">${product.name}</p>
                  <p class="product-price">$${product.price.toFixed(2)}</p>
               </div>
            </div>`;
      }

      $("#productGrid").html(html);
   }, "json").fail(function () {

        // If something goes wrong with the request (like the server being down), show a friendly message instead of leaving the section blank with no explanation.
      $("#productGrid").html("<p>Sorry, we couldn't load our products right now.</p>");
   });
});

// ===================== GRADE COMPARISON: JQUERY TABS =====================
// This turns our plain list of tab links and content sections into an actual clickable tab widget. jQuery UI's .tabs()
$(function () {
   $("#gradeTabs").tabs();

   // jQuery UI fires a "tabsactivate" event every time the user switches to a different tab.
   $("#gradeTabs").on("tabsactivate", function (event, ui) {
      // Each tab panel has a data-image attribute in the HTML that tells us which photo goes with it.
      const newImage = ui.newPanel.data("image");
      $("#gradeImage").attr("src", newImage);
   });
});
 
// ===================== HOW TO PREPARE: CAROUSEL =====================
// This carousel only moves when the user clicks an arrow or a dot. it never auto-plays. I learned this method through watching youtube videos about JS carousel. It looks nice so I wanted to add this.
$(function () {
   const $slides = $(".carousel-slide");
   const $track = $(".carousel-track");
   const $dotsContainer = $("#carouselDots");
   const $caption = $("#carouselCaption");
   const totalSlides = $slides.length;
 
   // Keeps track of which slide is currently showing. Starts at 0
   let currentIndex = 0;
 
   // Build one small dot button for every slide we have, so the number of dots always matches the number of slides automatically
   for (let i = 0; i < totalSlides; i++) {
      $dotsContainer.append(`<button class="carousel-dot" data-index="${i}" aria-label="Go to step ${i + 1}"></button>`);
   }
   const $dots = $(".carousel-dot");
 
   // This is the function that actually moves the carousel.
   function goToSlide(index) {
      currentIndex = index;
      $track.css("transform", `translateX(-${currentIndex * 100}%)`);
 
      // Update which dot looks "active" so the user can see.
      $dots.removeClass("active");
      $dots.eq(currentIndex).addClass("active");
 
      // Each image stores its own caption text in a data-caption attribute.
      const newCaption = $slides.eq(currentIndex).find("img").data("caption");
      $caption.text(newCaption);
   }
 
   // Clicking the right arrow moves forward one step.
   $(".carousel-next").on("click", function () {
      goToSlide((currentIndex + 1) % totalSlides);
   });
 
   // Clicking the left arrow moves back one step.
   $(".carousel-prev").on("click", function () {
      goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
   });
 
   // Clicking a dot jumps straight to that step instead of having to click through the arrows one at a time.
   $dotsContainer.on("click", ".carousel-dot", function () {
      goToSlide($(this).data("index"));
   });
 
   // Set up the very first slide and dot as active as soon as the page loads.
   goToSlide(0);
});