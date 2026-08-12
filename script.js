"use strict";

// This holds the full list of products once we get them back from the AJAX call below.
let allProducts = [];

// ===================== SHOP: LOAD PRODUCTS VIA AJAX =====================
$(function () {

   // This is the web address (URL) of our "backend" server using postman. 
   const mockUrl = "https://a84b49fe-c46b-440f-94f2-6d0b0ce99c53.mock.pstmn.io/products";

   // $.get() sends a request to that URL. If it works, the function inside runs and "products" will be the array of product objects we get back.
   $.get(mockUrl, function (products) {
      // Save the products where our favorites code can also reach them.
      allProducts = products;
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

// ===================== FAVORITES: CLICK HANDLERS =====================
// We use "event delegation" here — attaching the click listener to the grid container itself instead of to each individual heart icon. This matters because the product cards don't exist yet when the page first loads (they're added later by the AJAX call above), so a normal clickhandler wouldn't find them. 
$(function () {
   $("#productGrid").on("click", ".favorite-icon", function () {
      const $card = $(this).closest(".product-card");
      const productId = Number($card.data("id"));
 
      toggleFavorite(productId);
      updateHeartIcon($card);
      renderFavoritesList();
   });
 
   // Clicking "Remove" in the Favorites list un-favorites that product. We also need to update that product's heart icon back in the Shop grid, in case the user scrolls back up and it's still visible there.
   $("#favoritesList").on("click", ".remove-favorite-btn", function () {
      const productId = Number($(this).data("id"));
 
      toggleFavorite(productId);
      renderFavoritesList();
 
      // Find that same product's card in the Shop grid, if it's there, and refresh its heart icon so it goes back to being outlined.
      $(`.product-card[data-id="${productId}"]`).each(function () {
         updateHeartIcon($(this));
      });
   });
});

// ===================== FAVORITES: WEB STORAGE HELPERS =====================
// These small helper functions handle reading and writing the list of favorited product ids to localStorage. Reads the saved favorites out of localStorage. If nothing has been saved yet (a first-time visitor), localStorage.getItem() returns null,so we fall back to an empty array instead of crashing.
function getFavorites() {
   const stored = localStorage.getItem("chawanFavorites");
   return stored ? JSON.parse(stored) : [];
}
 
// Saves the given array of favorite ids back to localStorage. We have to use JSON.stringify() because local Storage can only store plain text, not actual arrays or objects.
function saveFavorites(favoritesArray) {
   localStorage.setItem("chawanFavorites", JSON.stringify(favoritesArray));
}
 
// Adds or removes a single product id from the saved favorites list, depending on whether it's already in there.
function toggleFavorite(productId) {
   let favorites = getFavorites();
 
   if (favorites.includes(productId)) {
      // It's already a favorite, so clicking again means "un-favorite it."
      favorites = favorites.filter(function (id) {
         return id !== productId;
      });
   } else {
      // It's not a favorite yet, so add it to the list.
      favorites.push(productId);
   }
 
   saveFavorites(favorites);
}
 
// Updates a single heart icon so it matches whatever localStorage says about that product right now — filled in if it's favorited, empty outline if it's not.
function updateHeartIcon($card) {
   const productId = Number($card.data("id"));
   const $heart = $card.find(".favorite-icon");
 
   if (getFavorites().includes(productId)) {
      $heart.addClass("favorited").html("&#9829;");
   } else {
      $heart.removeClass("favorited").html("&#9825;");
   }
}
 
// Rebuilds the whole "Your Saved Favorites" list based on whatever is currently in localStorage.
function renderFavoritesList() {
   const favoriteIds = getFavorites();
   const $list = $("#favoritesList");
 
   // If there's nothing saved yet, show a friendly message instead of just leaving an empty, confusing blank space.
   if (favoriteIds.length === 0) {
      $list.html('<p class="favorites-empty">No favorites saved yet. Browse the shop above and tap the heart icon on anything you love.</p>');
      return;
   }
 
   let html = "";
 
   for (const id of favoriteIds) {
      // Look up the full product details (name, price, image) using the saved id.
      const product = allProducts.find(function (p) {
         return p.id === id;
      });
 
      // If a product was somehow removed from the shop but is still saved as a favorite, skip it instead of showing broken info.
      if (!product) {
         continue;
      }
 
      html += `
         <div class="favorite-item" data-id="${product.id}">
            <img src="images/${product.image}" alt="${product.name}">
            <div class="favorite-info">
               <p class="favorite-name">${product.name}</p>
               <p class="favorite-meta">${product.grade} &middot; $${product.price.toFixed(2)}</p>
            </div>
            <button class="remove-favorite-btn" data-id="${product.id}">Remove</button>
         </div>`;
   }
 
   $list.html(html);
}
 

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