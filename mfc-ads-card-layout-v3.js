// ==UserScript==
// @name        MFC Classified Ads Card Layout
// @namespace   zys52712
// @match       https://myfigurecollection.net/*
// @grant       none
// @version     1.11
// @license     GNU GPLv3
// @author      zys52712
// @description Show MFC classifieds as cards
// ==/UserScript==
 
const styles = document.createElement('style');
 
styles.innerHTML = `
#wide:has(.tiny-icon-before.icon-circle-o) {
  /*width: 85%;*/
 
  &:has(a[href*="/?_tb=classified&createdBy="]) {
    width: 100%;
  }
 
  .results {
    gap: 16px;
    padding: 16px;
    display: grid;
    grid-template-columns: repeat(auto-fit, 236px);
 
    .result {
      gap: 20px;
      height: 400px;
      flex-direction: column;
      padding: 0;
      margin: 0;
      opacity: 1;
      transition: opacity 0.5s;
      background-color: transparent;
      border-radius: 8px;
      box-shadow: 5px 5px 5px #00000050;
 
      &.associate {
        display: none;
      }
 
      &.loading {
        opacity: 0;
        transition: none;
      }
 
      &:hover {
        .dgst-data {
          /*transform: translateY(calc(100% - 75px));*/
 
          .classified-description {
            max-height: min(var(--max-height), 144px);
            -webkit-line-clamp: 8;       /* Limits the text to 3 lines */
          }
        }
      }
 
      &.transitioning {
        .dgst-data {
          .classified-description {
            -webkit-line-clamp: 8;       /* Limits the text to 3 lines */
          }
        }
      }
    }
  }
 
  .classified-dgst {
    position: relative;
    width: 100%;
  }
 
  .dgst .dgst-wrapper {
    flex-direction: column;
  }
 
  .dgst-data {
    width: calc(100% - 20px);
    transition: transform 0.3s;
    z-index: 1;
    bottom: 0;
    position: absolute;
    padding: 10px;
    border-radius: 8px;
    background-color: #00000090;
    background: linear-gradient(to bottom, rgba(44, 44, 44, .5), #2c2c2c);
 
    .classified-description {
      transition: -webkit-line-clamp 0.3s, max-height 0.3s;
      max-height: 54px;
      display: -webkit-box;        /* Required for applying the ellipsis to multi-line text */
      -webkit-box-orient: vertical; /* Required for applying the ellipsis to multi-line text */
      -webkit-line-clamp: 3;       /* Limits the text to 3 lines */
    }
  }
 
  .dgst-data .meta {
    padding: 0;
  }
 
  .dgst-data * {
    font-family: sans-serif;
  }
 
  .dgst-meta {
    column-gap: 5px;
  }
 
  .dgst-wrapper a img {
    position: absolute;
    height: 100%;
    object-fit: cover;
    object-position: top;
    border-radius: 8px;
  }
 
  .dgst-anchor .tbx-tooltip,
  .dgst-meta .meta:not(:nth-child(2)),
  .dgst-meta .anchor.user-anchor {
    color: #f8f8f8;
    font-weight: 500;
  }
 
  .classified-price.meta {
    font-size: 18px;
    color: white;
    padding: 3px 3px 0 0;
    margin-bottom: 3px;
    display: flex;
  }
 
  .classified-price.meta small {
    font-size: 12px;
    line-height: 12px;
    border-radius: 4px;
    margin: 0 3px;
    align-self: end;
  }
 
  .dgst-anchor {
    padding: 0;
    max-height: none;
    margin-bottom: 3px;
    line-height: 20px;
    display: -webkit-box;        /* Required for applying the ellipsis to multi-line text */
    -webkit-box-orient: vertical; /* Required for applying the ellipsis to multi-line text */
    -webkit-line-clamp: 3;       /* Limits the text to 3 lines */
  }
 
  .meta.category {
    display: none;
  }
 
  .ratio {
    margin-top: 3px;
  }
 
  .scale-company {
    margin-bottom: 2px;
  }
 
  .info-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    margin-top: 3px;
 
    &:last-child {
      height: 24px;
      align-items: self-end;
    }
 
    .time {
      margin-bottom: 2px;
    }
 
    .msrp {
      font-size: 18px;
      /*min-width: 7ch;*/
      line-height: 24px;
    }
 
    .cost {
      font-weight: 500;
      font-size: 20px;
      display: flex;
      gap: 6px;
      align-items: flex-end;
 
      span {
        font-size: 16px;
        opacity: .7;
        margin-bottom: 1px;
      }
    }
  }
}
 
`;
 
document.body.appendChild(styles);
 
const resultElements = document.querySelectorAll('.wrapper > section > .result');
//console.log(resultElements);
 
if (resultElements.length > 0) {
  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'results';
 
  resultElements.forEach(element => {
      resultsContainer.appendChild(element.cloneNode(true));
  });
 
  document.querySelector('.wrapper > section').insertBefore(resultsContainer, resultElements[0]);
 
  resultElements.forEach(element => {
    element.parentNode.removeChild(element);
  });
}
 
function handleMutations(mutations) {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.querySelector) {
            const newElements = node.querySelectorAll('.dgst-data .tbx-tooltip');
            newElements.forEach((element) => {
              initialize.call(element);
            });
          }
        }
      });
    }
  });
}
 
const observer = new MutationObserver(handleMutations);
 
observer.observe(document.body, {
  childList: true,
  subtree: true
});
 
const unbindAll = document.querySelectorAll('.tbx-tooltip');
unbindAll.forEach((element) => {
  unbindEvents.call(element);
});
 
const initialElements = document.querySelectorAll('.dgst-data .tbx-tooltip');
initialElements.forEach((element) => {
  initialize.call(element);
});
 
function unbindEvents() {
  let $this=$(this);
  $(this).unbind();
}
 
function initialize() {
  let $this=$(this);
  $(this).unbind();
  let urlRegex = /(https?:\/\/[^\s)]+)(?<!\))/;
 
  const tooltip = this;
  const result = this.closest('.result');
 
  let timeout = '';
  result.addEventListener('mouseout', () => {
    result.classList.add('transitioning');
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      result.classList.remove('transitioning');
    }, 300)
  })
 
  const desc = result.querySelector('.classified-description')?.title;
  if (desc) {
    result.querySelector('.classified-description').removeAttribute('title');
    result.querySelector('.classified-description').innerHTML = desc;
    result.style.setProperty('--max-height', result.querySelector('.dgst-meta .classified-description').scrollHeight + 'px');
  }
  result.classList.add('loading');
 
  let price = parseFloat(result.querySelector('.classified-price-value').innerHTML);
 
  let freeShip = false;
  if (result.querySelector('small')) {
    result.querySelector('small').innerHTML = 'FS';
    freeShip = true;
  }
 
  const vars = tooltip.querySelector('meta').content.split(":");
  if (true) {
    fetch('https://myfigurecollection.net/actions.php', {
      method: "POST",
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `commit=loadTooltip&objectId=${vars[1]}&objectType=${vars[0]}`
    })
    .then(response => response.json())
    .then(function(j) {
      let container = document.createElement("div");
      container.innerHTML = j.htmlValues.TOOLTIP;
 
      if (!tooltip.classList.contains('loaded') && ! j.htmlValues.TOOLTIP.toString().includes('icon-heart')) {
        const iconImg = result.querySelector('img').cloneNode(true);
        const tooltipA = result.querySelector('.dgst-anchor .tbx-tooltip');
 
        if (j.htmlValues.TOOLTIP.match(urlRegex)) {
          //tooltipA.parentElement.insertBefore(iconImg, tooltipA);
          result.querySelector('img').src = j.htmlValues.TOOLTIP.match(urlRegex)[1];
          //console.log(j.htmlValues.TOOLTIP.match(urlRegex)[1])
          result.querySelector('img').onload = handleImageLoad;
        }
        else {
          handleImageLoad();
        }
 
        function handleImageLoad() {
          result.classList.remove('loading');
        }
 
        const productName = tooltipA.textContent;
 
        const scaleRegex = / - 1\/\d+| - Nendoroid  \(#\d+[a-zA-Z]?\)| - Figma  \(#[^()]*\)/;
        const companyRegex = /\([^()]*\)$/;
        const scaleMatch = productName.match(scaleRegex);
        const companyMatch = productName.match(companyRegex);
        let scale = '';
        let company = '';
 
        if (scaleMatch) {
          scale = scaleMatch[0];
        }
 
        let scaleTemp = scale.substring(3).split(/\s+/)[0];
        if (productName.includes('[NSFW] - ')) {
          if (scaleTemp === '') {
            scaleTemp = 'NSFW';
          }
          else {
            scaleTemp += ' <small>NSFW</small>';
          }
        }
 
        if (companyMatch) {
          company = companyMatch[0];
        }
 
        const companyTrimmed = trimCompanyName(company);
        const companyNameShort = companyTrimmed.length > 25 ? companyTrimmed.substring(0, 22) + '...' : companyTrimmed;
 
        function trimCompanyName( string ) {
          return string.substring(1, company.length - 1).replace('Good Smile Company', 'GSC').replace(' International Ltd', '');
        }
 
        let scaleCompanyContainer = document.createElement("div");
        scaleCompanyContainer.classList.add('info-container');
        scaleCompanyContainer.classList.add('scale-company');
 
        const scaleCompanyMarkup = `<li class="scale">${scaleTemp}</li><li class="company">${companyNameShort}</li>`;
        scaleCompanyContainer.innerHTML = scaleCompanyMarkup;
 
        if ( scaleMatch || companyMatch ) {
          tooltipA.innerHTML = productName.replace(scale, '').replace(company, '').replace('[NSFW] - ', '') + tooltipA.querySelector('meta').outerHTML;
          result.querySelector('.dgst-anchor').before(scaleCompanyContainer);
        }
 
        const msrp = container.querySelector('.over-data li:last-child');
        msrp.classList.add('msrp');
 
        let cost = document.createElement("li");
        cost.classList.add('cost');
 
        const releaseDate = container.querySelector('.time');
 
        let ratio = Math.floor(parseInt(msrp.innerHTML.substring(1)) / price);
        let ratioMarkup = ratio;
        if ( !freeShip ) {
          const offsetRatio = Math.floor(parseInt(msrp.innerHTML.substring(1)) / ( price + 20 ));
          ratioMarkup = `${offsetRatio}<span>${ratio}</span>`;
        }
 
        cost.innerHTML = ratioMarkup;
 
        let totalMarkupContainer = document.createElement("div");
        totalMarkupContainer.classList.add('info-container');
        if (isNaN(ratio)) {
          msrp.innerHTML = '';
        }
        const totalMarkup = `<li class="msrp">${msrp.innerHTML}</li><li class="time">${releaseDate.innerHTML}</li>`;
        totalMarkupContainer.innerHTML = totalMarkup;
 
        if ( true ) {
          result.querySelector('.dgst-data .dgst-meta:not(:has(+.dgst-meta))').after(totalMarkupContainer);
          //tooltip.closest('.dgst.classified-dgst').after(msrp);
          //tooltip.closest('.dgst.classified-dgst').after(cost);
        }
        tooltip.classList.add('loaded');
      }
    });
  }
}
