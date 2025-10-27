// For each card, track mouse and adjust:
//  - CSS vars --cx and --cy used via clip-path
//  - overlay position set via left/top and diameter via --d
//  - show/hide by setting scale or making diameter 0
const RADIUS = 110; // pixels (feel free to tweak)
document.querySelectorAll('.card').forEach(card => {
  const overlay = card.querySelector('.overlay');
  const light = card.querySelector('.content-light');

  // initial CSS variables
  card.style.setProperty('--d', '0px'); // diameter
  card.style.setProperty('--cx','50%');
  card.style.setProperty('--cy','50%');

  function onMove(e){
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const diameter = (RADIUS * 2) + 'px';
    card.style.setProperty('--d', diameter);

    // position overlay (left/top)
    overlay.style.left = x + 'px';
    overlay.style.top = y + 'px';
    overlay.style.transform = 'translate(-50%,-50%) scale(1)';

    // reveal white text layer by setting clip-path
    light.style.clipPath = `circle(${RADIUS}px at ${x}px ${y}px)`;
  }

  function onLeave(){
    // hide overlay + white clip
    overlay.style.transform = 'translate(-50%,-50%) scale(0)';
    overlay.style.left = '50%';
    overlay.style.top = '50%';
    light.style.clipPath = `circle(0px at 50% 50%)`;
  }

  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseenter', onMove); // ensure shows immediately when entering
  card.addEventListener('mouseleave', onLeave);
});
