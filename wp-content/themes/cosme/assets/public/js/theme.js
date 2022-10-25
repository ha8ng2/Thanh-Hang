"use strict";

var cosme = cosme || {};

/**
 * Is the DOM ready?
 *
 * This implementation is coming from https://gomakethings.com/a-native-javascript-equivalent-of-jquerys-ready-method/
 *
 * @param {Function} fn Callback function to run.
 */

 cosme.helpers = {
    cosmeDomReady: function cosmeDomReady(fn) {
      if (typeof fn !== 'function') {
        return;
      }
  
      if (document.readyState === 'interactive' || document.readyState === 'complete') {
        return fn();
      }
  
      document.addEventListener('DOMContentLoaded', fn, false);
    },
    ajax: function ajax(action, nonce, extraParams, successCallback) {
      var ajax = new XMLHttpRequest();
      ajax.open('POST', cosme.ajaxurl, true);
      ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  
      ajax.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          successCallback.apply(this);
        }
      };
  
      var extraParamsStr = '';
      extraParams = Object.entries(extraParams);
  
      for (var i = 0; i < extraParams.length; i++) {
        extraParamsStr += '&' + extraParams[i].join('=');
      }
  
      ajax.send('action=' + action + '&nonce=' + nonce + extraParamsStr);
    },
    setCookie: function setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    getCookie: function getCookie(cname) {
      var name = cname + "=",
          ca = document.cookie.split(';');
  
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
  
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
  
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
  
      return "";
    }
  };


/**
 * Quantity button
 */

 cosme.qtyButton = {
    init: function init(type) {
      this.events(type);
      this.wooEvents();
    },
    events: function events(type) {
      var qty = document.querySelectorAll('form .quantity');
  
      if (qty.length < 1) {
        return false;
      }
  
      for (var i = 0; i < qty.length; i++) {
        if (qty[i].classList.contains('hidden')) {
          return false;
        }
  
        var plus = qty[i].querySelector('.cosme-quantity-plus'),
            minus = qty[i].querySelector('.cosme-quantity-minus');
        plus.classList.add('show');
        minus.classList.add('show');
        plus.addEventListener('click', function (e) {
          var input = this.parentNode.querySelector('.qty'),
              changeEvent = document.createEvent('HTMLEvents');
          e.preventDefault();
          input.value = input.value === '' ? 0 : parseInt(input.value) + 1;
          changeEvent.initEvent('change', true, false);
          input.dispatchEvent(changeEvent);
        });
        minus.addEventListener('click', function (e) {
          var input = this.parentNode.querySelector('.qty'),
              changeEvent = document.createEvent('HTMLEvents');
          e.preventDefault();
          input.value = parseInt(input.value) > 0 ? parseInt(input.value) - 1 : 0;
          changeEvent.initEvent('change', true, false);
          input.dispatchEvent(changeEvent);
        });
      }
    },
    wooEvents: function wooEvents() {
      var _self = this;
  
      if (typeof jQuery !== 'undefined') {
        jQuery('body').on('updated_cart_totals', function () {
          _self.events();
        });
      }
    }
  };

/**
 * Back to top button
 */

cosme.backToTop = {
    init: function init() {
      this.backToTop();
      window.addEventListener('scroll', function () {
        this.backToTop();
      }.bind(this));
    },
    backToTop: function backToTop() {
      var button = document.getElementsByClassName('back-to-top')[0];
  
      if ('undefined' !== typeof button) {
        var scrolled = window.pageYOffset;
  
        if (scrolled > 300) {
          button.classList.add('display');
        } else {
          button.classList.remove('display');
        }
  
        button.removeEventListener('click', this.scrollToTop);
        button.addEventListener('click', this.scrollToTop);
      }
    },
    scrollToTop: function scrollToTop() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    },
};

cosme.helpers.cosmeDomReady(function () {
    cosme.backToTop.init(); 
    cosme.qtyButton.init(); 
});
