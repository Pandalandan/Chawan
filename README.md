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


Problem #2: Missing jQuery UI script tag (tabs not clickable)

* What was not working
    * The Ceremonial, Culinary, and How to Choose Grade Comparison tabs were completely broken. Nothing happened when you clicked on any of the tab buttons; neither the content nor the appearance changed.
* What I tried
    * I opened the browser console (DevTools) to check for errors. I saw this message: Uncaught TypeError: $(...).tabs is not a function. Since other sections of the website, like as the Shop area, were loading without any issues, this indicated to me that jQuery itself was functioning, but the.tabs() method in particular was not accessible.
* What fixed the problem
    * I discovered that I was completely missing the jQuery UI script tag. The.tabs() widget, which comes from a different library called jQuery UI and needs to be linked in the HTML as its own script element, is not included by jQuery core alone. This script tag must be added alongside the other external library scripts, and it must load after jQuery core but before my own script.js file, as I recalled from the video exercises. The tabs began functioning right away once I put the missing line to my HTML's head in the proper order.
* What I learned 
    * Some jQuery features, such as UI widgets (tabs, accordions, sliders, etc.), require loading jQuery UI as an extra, independent script. Instead of an error in my own code, a "not a function" issue thrown by a jQuery method typically indicates that the necessary library or plugin script is just not loaded.

Problem #3: HTML code error
* What was not working
    * No matter which tab I clicked, the images adjacent to the Grade Comparison tabs remained the same. It was intended to change based on which page was open (Ceremonial, Culinary, or How to Choose). The peculiar aspect was that no errors appeared in the console at all, making it more difficult to identify the issue.
* What I tried
    * I knew the jQuery UI tabs widget was functioning since the tabs themselves were toggling appropriately (the text content updated without any issues). In order to see if the src attribute of the img element had changed, I launched the browser's DevTools and examined it in the Elements panel while switching between tabs. It didn't; regardless of what I clicked, the source remained unchanged.
* What fixed the problem
    * I found that the content div of each tab was meant to have a data-image="..." tag that told the JavaScript which photo was associated with that tab. The real data-image attributes were absent from my HTML page, even tho my JavaScript code was already correctly prepared to retrieve that attribute (ui.newPanel.data ("image"). The images began to switch correctly after I inserted data-image="..." to each of the three tab divs.
* What I learned 
    * Not all bugs result in an error message. Setting an image's src to undefined fails silently with no output in the terminal because JavaScript simply returns undefined rather than failing when it attempts to read a data-attribute that doesn't exist. My JS code was only as good as the data it was really reading from the page, which showed me that HTML and JavaScript must line up precisely. Checking the actual HTML in the browser inspector, as opposed to simply rereading my own code, is how I find a discrepancy like this when there isn't an error to indicate the issue.