"use strict";

// ===================== SHOP: LOAD PRODUCTS VIA AJAX =====================
$(function () {
   const mockUrl = "https://a84b49fe-c46b-440f-94f2-6d0b0ce99c53.mock.pstmn.io/products";

   $.get(mockUrl, function (products) {
      let html = "";

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
      $("#productGrid").html("<p>Sorry, we couldn't load our products right now.</p>");
   });
});