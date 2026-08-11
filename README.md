# Chawan
Matcha Online Shop

DEVELOPMENT LOG
Day #1 
* Brainstormed what kind of website I would do
* Looked through different colors for Calm, Soft, and Warmer (mostly colors that matches MATCHA)
* Sketch the wireframe and layout

Day #2
* Finalizing the wireframe
* Started GitHub repository 
* Started building the HTML page

Day #3 
* Started working on each section of the page 
    * Header
    * Story
    * Shop
    * How to prepare
    * Favorites
    * Footer
* Started working on CSS as well (Worked on CSS section by section)
* Started working on JS
* Created mock server using postman



DEBUGGING LOG

Problem #1: Making the mock server using postman

* What was not working
    * Postman currently offers two types of mock servers (called "code mock" and "classic mock"), and the more recent code-mock flow requires a paid Solo plan in order to actually deploy. 
    Initially, attempting to deploy a Postman mock server encountered a paywall. 
    * Second, the Shop area of the page remained entirely blank when we obtained a functional (free) mock server, and the console displayed a JavaScript error (Cannot read properties of undefined, reading 'toFixed').
* What I tried
    * Initially, I attempted the default "Create Mock" procedure for the paywall, which led to the premium code-mock feature without making that clear up front.
    * For the blank Shop area, I visited the browser's DevTools Console and Network tab to view the real error rather than speculating after determining whether the problem was with file:// or a local server (which it wasn't because I was already using Live Server).
* What fixed the problem
    * In place of the paywall, I found the old fake server flow by going to the collection's "•••" menu → "More" → the classic mock option. This is free and doesn't require a subscription plan.
    * The actual reason for the blank Shop section was that jQuery's $.get() was treating the mock server's response as plain text rather than instantly identifying it as JSON. $.get() had to parse correctly when "json" was included as an explicit third argument.
    * Another, minor problem also surfaced: my local picture filenames didn't match the filenames mentioned in the product data, thus until I saw it and renamed to precisely match, the photos appeared broken.
* What I learned
    * Being clear about dataType helps prevent silent parsing errors because $.get() doesn't always assume the correct answer type.
    * Browser caching can make a real fix look like it didn't work — a hard refresh (Ctrl+Shift+R) is worth trying before assuming code is wrong.
    * My data and my real files must have identical filenames, with only a minor naming discrepancy (.png vs.A simple and frequent source of "broken image" issues is jpg, or wako vs. wa-latte.