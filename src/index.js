

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

    

  }

  

  connectedCallback() {
    this.animate();
  }

  animate () {

    // animation utils
    // ==============

    const trackTime = id => {
      const [entry] = performance.getEntriesByName(id);
      if (!entry) {
        performance.mark(id);
        return 0;
      }
      
      return performance.now() - entry.startTime;
    };

    const delay = (callback, duration) => {
      const tick = () => 
        getProgress(time) < 1 ? requestAnimationFrame(tick) : callback();
      const time = {
        duration,
        id: requestAnimationFrame(tick)
      };
    };

    const getProgress = ({duration = 1000, id}) => {
      const progress = duration ? Math.min(trackTime(id) / duration, 1) : 1;
      if (progress == 1) performance.clearMarks(id);
      return progress;
    };

    const getCurrentValue = ({from = 0, to, easing}) =>
      from + (to - from) * easing;
    

    // easing equations
    // ================

    const ease = {
      in: {
        cubic: progress => Math.pow(progress, 3),
        quartic: progress => Math.pow(progress, 4),
        quintic: progress => Math.pow(progress, 5),
        exponential: progress => progress > 0 ? Math.pow(1024, progress - 1) : 0,
        circular: progress => 1 - Math.sqrt(1 - Math.pow(progress, 2)),
        elastic: progress => {
          if (progress == 0) return 0;
          if (progress == 1) return 1;
          return -Math.pow(2, 10 * (progress - 1)) * Math.sin((progress - 1.1) * 5 * Math.PI);
        }
      },
      out: {
        cubic: progress => Math.pow(--progress, 3) + 1,
        quartic: progress => 1 - Math.pow(--progress, 4),
        quintic: progress => Math.pow(--progress, 5) + 1,
        exponential: progress => progress < 1 ? 1 - Math.pow(2, -10 * progress) : 1,
        circular: progress => Math.sqrt(1 - Math.pow(--progress, 2)),
        elastic: progress => {
          if (progress == 0) return 0;
          if (progress == 1) return 1;
          return Math.pow(2, -10 * progress) * Math.sin((progress - .1) * 5 * Math.PI) + 1;
        }
      },
      inOut: {
        cubic: progress =>
          (progress *= 2) < 1
            ? .5 * Math.pow(progress, 3)
            : .5 * ((progress -= 2) * Math.pow(progress, 2) + 2),
        quartic: progress =>
          (progress *= 2) < 1
            ? .5 * Math.pow(progress, 4)
            : -.5 * ((progress -= 2) * Math.pow(progress, 3) - 2),
        quintic: progress =>
          (progress *= 2) < 1
            ? .5 * Math.pow(progress, 5)
            : .5 * ((progress -= 2) * Math.pow(progress, 4) + 2),
        exponential: progress => {
          if (progress == 0) return 0;
          if (progress == 1) return 1;
          return (progress *= 2) < 1
            ? .5 * Math.pow(1024, progress - 1)
            : .5 * (-Math.pow(2, -10 * (progress - 1)) + 2);
        },
        circular: progress =>
          (progress *= 2) < 1
            ? -.5 * (Math.sqrt(1 - Math.pow(progress, 2)) - 1)
            : .5 * (Math.sqrt(1 - (progress -= 2) * progress) + 1),
        elastic: progress => {
          if (progress == 0) return 0;
          if (progress == 1) return 1;
          progress *= 2;
          const sin = Math.sin((progress - 1.1) * 5 * Math.PI);
          return progress < 1
            ? -.5 * Math.pow(2, 10 * (progress - 1)) * sin
            : .5 * Math.pow(2, -10 * (progress - 1)) * sin + 1;
        }
      }
    };

    // animation example
    // =================

    const animate = () => {
      const tick = () => {
        const progress = getProgress(animation);
        if (progress < 1) requestAnimationFrame(tick);

        // 1.Animation logic -----------------------------------------------------------
        const easing = ease.out.elastic(progress);
        const value = getCurrentValue({from: 0, to: this.getAttribute('value'), easing});
        this.indicator.setAttribute("width", value);
      };

      const animation = {
        // 2. optionnaly specify a duration (defaults to 1s) ---------------------------
        duration: 1200,
        id: requestAnimationFrame(tick)
      };
    };

    // 3. optionally set a timeout ----------------------------------------------------
    delay(animate, 250);
  }


}

customElements.define("bar-chart", MyCounter);
