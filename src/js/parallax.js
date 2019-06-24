
(function () {
  const parallaxes = document.querySelectorAll('.jarallax')
  jarallax( parallaxes, {
    speed: 0.75
  });
  parallaxes.forEach( parallax => {
    if (parallax.dataset.gradient) {
      let final = `${parallax.dataset.gradient}, ${parallax.lastChild.firstChild.style.backgroundImage}`
      parallax.lastChild.firstChild.style.backgroundImage = final
    }
  })
})();
