// ==UserScript==
// @name        新浪图床修复
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      zys52712
// @description 2/25/2024, 1:04:42 PM
// ==/UserScript==

const allImages = document.querySelectorAll('img');

allImages.forEach(function(img) {
    if (img.src.includes('sinaimg.cn')) {
        var modifiedLink = "https://i0.wp.com/" + img.src.replace("https://", "").replace("http://", "");
        img.src = modifiedLink;
    }
});
