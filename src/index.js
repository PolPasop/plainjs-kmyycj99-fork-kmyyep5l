

class MyCounter extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement("template");
    template.innerHTML = /*html*/`
      <style>

      </style>
      <p>${ this.getAttribute('value') }</p>
      <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
        <!-- Simple rect element -->
        <rect x="0" y="0" width="${ this.getAttribute('value') }" height="20" />
      </svg>
      `;
   
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("bar-chart", MyCounter);
