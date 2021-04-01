

class MyCounter extends HTMLElement {
  constructor() {
    super();

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.display = 'block';
    svg.setAttribute("viewBox", "0 0 100 10");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    this.track = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.track.setAttribute("x", "0");
    this.track.setAttribute("y", "0");
    this.track.setAttribute("width", '100');
    this.track.setAttribute("height", "10");
    this.indicator = this.track.cloneNode(true);
    this.indicator.setAttribute("width", '0');
    this.track.style.fill = "var(--track-color, #9E9E9E)";
    this.indicator.style.fill = "var(--track-color, red)";

    svg.appendChild(this.track);
    svg.appendChild(this.indicator);
    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(svg);

    const time = {
      start: performance.now(),
      total: 1200
    };
    const easeOut = progress => Math.pow(--progress, 5) + 1;
    const easeOutElastic = progress => Math.pow(2, -10 * progress) * Math.sin((progress - .1) * 5 * Math.PI) + 1;

    const finalPosition = this.getAttribute('value');    
    const tick = now => {
      time.elapsed = now - time.start;
      const progress = time.elapsed / time.total;
      const easing = easeOutElastic(progress);
      const position = easing * finalPosition;
      // element.style.transform = `translate(${position}px)`;
      this.indicator.setAttribute("width", position);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  connectedCallback() {
    

    

  }


}

customElements.define("bar-chart", MyCounter);
