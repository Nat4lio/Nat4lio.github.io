const progress = document.querySelector('.scroll-progress span');
const reveals = document.querySelectorAll('.reveal');
const tickerBand = document.querySelector('.marquee-band');
const tickerTrack = document.querySelector('.marquee-track');
const tickerPhrase = document.querySelector('.ticker-phrase');

const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
};

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach((element) => revealObserver.observe(element));
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const startTicker = () => {
  if (!tickerBand || !tickerTrack || !tickerPhrase) return;

  const text = tickerPhrase.dataset.text || '';
  tickerPhrase.textContent = text;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    tickerTrack.style.transform = 'none';
    return;
  }

  // Começa exatamente fora da borda direita para entrar carácter a carácter
  let x = tickerBand.clientWidth;
  let lastTime = null;
  const speed = 135; // Velocidade em píxeis por segundo (podes ajustar entre 70 e 110)

  const animate = (timestamp) => {
    if (lastTime === null) lastTime = timestamp;
    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    x -= speed * delta;

    const endX = -tickerPhrase.offsetWidth;

    // Assim que o último carácter desaparece na esquerda, volta a entrar na direita
    if (x <= endX) {
      x = tickerBand.clientWidth;
    }

    tickerPhrase.style.transform = `translate3d(${x}px, -50%, 0)`;
    requestAnimationFrame(animate);
  };

  // Se a janela mudar de tamanho, mantém os limites certos
  window.addEventListener('resize', () => {
    if (x > tickerBand.clientWidth) {
      x = tickerBand.clientWidth;
    }
  });

  requestAnimationFrame(animate);
};

startTicker();