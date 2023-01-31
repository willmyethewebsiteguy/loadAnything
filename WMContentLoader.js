/* =========
  Content Loader TESTING
  Load Content anywhere you need it
  This Code is Licensed by Will-Myers.com
========== */
(function () {
  const utils = {
    emitEvent: function (type, detail = {}, elem = document) {
      if (!type) return;
      let event = new CustomEvent(type, {
        bubbles: true,
        cancelable: true,
        detail: detail,
      });
      return elem.dispatchEvent(event);
    },
    async getHTML(url, selector = null) {
      try {
        let response = await fetch(`${url}`);

        // If the call failed, throw an error
        if (!response.ok) {
          throw `Something went wrong with ${url}`;
        }

        let data = await response.text(),
            frag = document.createRange().createContextualFragment(data),
            section = frag.querySelector('#sections').innerHTML;

        if (selector) section = frag.querySelector(selector).innerHTML;

        return section;

      } catch (error) {
        console.error(error);
      }
    },
    getPropertyValue: function (el, prop) {
      let propValue = window.getComputedStyle(el).getPropertyValue(prop),
          cleanedValue = propValue.trim().toLowerCase(),
          value = cleanedValue;

      /*If First & Last Chars are Quotes, Remove*/
      if (cleanedValue.charAt(0).includes('"') || cleanedValue.charAt(0).includes("'")) value = value.substring(1);
      if (cleanedValue.charAt(cleanedValue.length-1).includes('"') || cleanedValue.charAt(cleanedValue.length-1).includes("'")) value = value.slice(0, -1);;

      if (cleanedValue == 'true') value = true;
      if (cleanedValue == 'false') value = false;

      return value;
    }
  };

  let LoadContent = (function () {    
    function loadSquarespaceContent(instance){
      let container = instance.elements.container;
      Squarespace.initializeLayoutBlocks(Y, Y.one(container));
    }

    async function buildHTML(instance) {
      let container = instance.elements.container,
          target = instance.settings.target,
          url = instance.settings.url,
          selector = instance.settings.selector;
      
      let html = await utils.getHTML(url, selector);

      container.insertAdjacentHTML('afterbegin', html);
      loadSquarespaceContent(instance);
      
      return container;
    }

    function Constructor(el) {
      let instance = this;
      instance.settings = {
        get target() {
          return el.dataset.target;
        },
        get url() {
          let target = this.target;
          let url;
          if (target.includes(' ')) url = target.split(' ')[0];
          return target;
        },
        get selector() {
          let target = this.target;
          let selector;
          if (target.includes(' ')) selector = target.split(' ')[1];
          return selector;
        }
      };
      instance.elements = {
        container: el
      };
            
      instance.elements.container.classList.add('wm-load-container')
      buildHTML(instance);
    }

    return Constructor;
  }());

  let initContentLoads = () => {
    let contentLoads = document.querySelectorAll('[data-wm-plugin="load"]');
    for (let el of contentLoads) {
      new LoadContent(el);
    }
  }
  initContentLoads();
  window.wmInitContentLoad = initContentLoads;
}());