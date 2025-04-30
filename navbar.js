// navbar.js
window.addEventListener('DOMContentLoaded', () => {
    fetch('navbar.html')
      .then(res => res.text())
      .then(data => {
        document.body.insertAdjacentHTML('afterbegin', data);
      });
  });