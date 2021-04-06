const colors = ["266dd3","344055","888098","cfb3cd","dfc2f2"];



const getPosition = (values, index) => {
  console.log("index",index);
  const valuesInNumbers = values.map( value => Number(value));
  const previousValues = valuesInNumbers.slice(0,index);
  console.log("previousValues",previousValues);

  var previousValuesTotal = previousValues.reduce(function (sum, current) { 
    return sum + current;
  }, 0);
   console.log("previousValuesTotal",previousValuesTotal);


  /*
  console.log(index > 0);
  let position = 0;
  let values = 0;

  values += Number(value);
  position += (index > 0) ? 0 : values;
  console.log("index", index, "position", position);
  return position;*/



  /*
  console.log("xbef", x);
  x += Number(value);
  console.log("xaft", x);
  
  const position = (index > 0) ? x : 0;
  return position;
  */
  const position = (index > 0) ? previousValuesTotal : 0;
  return position;
  
};

const template = (values) => {
  console.log("template values", values);
  return `
    <svg style="display:block" viewBox="0 0 100 4" fill="none" xmlns="http://www.w3.org/2000/svg">
      
      <rect width="100" height="4" fill="#e3e3e3"></rect>
      
      ${values.map( (value, index) => `
      <rect x="${getPosition(values, index)}"  width="${value}" height="4" fill="#${colors[index]}"></rect>
      `).join('')}

    </svg>`
};

class MyCounter extends HTMLElement {
  constructor() {
    super();

    // One value
    if (this.getAttribute('value')) this.values = [this.getAttribute('value')];
    
    // Multi value
    if (this.getAttribute('values')) this.values = this.getAttribute('values').split(',');
    
    

    if (this.values > 1) {
      // this.generateMultiBarGraph(obvalues);
    } else {
      // this.generatePlainBarGraph(value);
    }

/*
    this.indicator = this.track.cloneNode(true);
    this.indicator.setAttribute("width", '0');
    this.indicator.style.fill = `var(--track-color, #${colors[0]})`;

    
    this.svg.appendChild(this.indicator);
*/
    let shadowRoot = this.attachShadow({mode: 'open'});
    // shadowRoot.appendChild(this.svg);
  }

  generatePlainBarGraph(value) {
    this.createRect({x:0, y:0, rx:1 , ry:1 , width:100, height:4, color:"#e3e3e3"});
    this.createRect({x:0, y:0, rx:1 , ry:1 , width:0, height:4, color:`#${colors[0]}`, animation: "width"});
    this.createText({x:2, content:value})
  }

  generateMultiBarGraph(values) {
    let position = 0;
    values.map( (myvalue, index) => {
      this.createRect({x: position, y:0, width: myvalue, height:4, color: `#${colors[index]}`})
      this.createText({x: position,content:myvalue})
      position += Number(myvalue);
    });
  }

  createText({x, content}) {
    this.textel = document.createElementNS("http://www.w3.org/2000/svg","text");
    this.textel.setAttribute("x", x + 2);
    this.textel.setAttribute("y", "50%");
    this.textel.style.fontFamily = 'mono';
    this.textel.style.fontSize = '10%';
    this.textel.innerHTML = content;
    this.svg.appendChild(this.textel);
  }

  createRect({x, y, rx, ry, width, height, color, animation}) {
    console.log("do rect", color);
    this.track = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.track.setAttribute("x", x);
    this.track.setAttribute("y", y);
    this.track.setAttribute("rx", rx);
    this.track.setAttribute("ry", ry);
    this.track.setAttribute("width", width);
    this.track.setAttribute("height", height);
    this.track.style.fill = `var(--track-color, ${color})`;
    console.log(template(width, height, color));
    
    
    this.svg.appendChild(this.track);
    if (animation) this.animate(this.track);
  }

  getPosition() {

  }
  
  connectedCallback() {
     // this.animate(this.indicator);
     this.update();
  }

  update() {
    console.log(this.values);
    this.shadowRoot.innerHTML = template(this.values);
  }

  animate (element) {

    // https://gist.github.com/bendc/4d66878dce526da728997d1e4e39325f

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
        element.setAttribute("width", value);
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
