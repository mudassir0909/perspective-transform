class Compositor {
  constructor(el, transformedElementsContainer) {
    this.coordinates = [];

    this.transformedElementsContainer = transformedElementsContainer;

    this.callbacks = [];
    this.clientRect = el.getClientRects()[0]

    el.addEventListener("click", this.onClick.bind(this));
  }

  // Doesn't handle the case when the body has scroll! #todo
  onClick(e) {
    const { x, y } = this.clientRect;
    const opts = {
      x: e.clientX - x,
      y: e.clientY - y,
    };
    this.coordinates.push([opts.x, opts.y]);

    if (this.coordinates.length === 4) {
      this.callbacks.forEach(cb => cb(this.coordinates));
      this.coordinates = [];
    }
  };

  clear() {
    this.transformedElementsContainer.innerHTML = '';
  }

  buildCSSTransformationMatrix(coordinates, { width, height }) {
    const [
      [u0, v0],
      [u1, v1],
      [u2, v2],
      [u3, v3],
    ] = coordinates; //this.coordinates.length should be equal to 4
    const [
      [x0, y0],
      [x1, y1],
      [x2, y2],
      [x3, y3],
    ] = [
      [0, 0],
      [0, height],
      [width, height],
      [width, 0],
    ];

    const matrix = math.matrix([
      [x0, y0, 1,  0,  0, 0, -u0 * x0, -u0 * y0],
      [0,   0, 0, x0, y0, 1, -v0 * x0, -v0 * y0],
      [x1, y1, 1,  0,  0, 0, -u1 * x1, -u1 * y1],
      [0,   0, 0, x1, y1, 1, -v1 * x1, -v1 * y1],
      [x2, y2, 1,  0,  0, 0, -u2 * x2, -u2 * y2],
      [0,   0, 0, x2, y2, 1, -v2 * x2, -v2 * y2],
      [x3, y3, 1,  0,  0, 0, -u3 * x3, -u3 * y3],
      [0,   0, 0, x3, y3, 1, -v3 * x3, -v3 * y3],
    ]);
    const inv = math.inv(matrix);
    const result = math.multiply(inv, [
      [u0],
      [v0],
      [u1],
      [v1],
      [u2],
      [v2],
      [u3],
      [v3],
    ]).toArray();
    const h8 = 1; //You can put any value here technically
    const [h0, h1, h2, h3, h4, h5, h6, h7] = result.map(r => h8 * r[0]);

    return `matrix3d(${h0}, ${h3}, 0, ${h6}, ${h1}, ${h4}, 0, ${h7}, 0, 0, 1 ,0, ${h2}, ${h5}, 0, ${h8})`;
  }

  setOnTransform(fn) {
    this.callbacks.push(fn);
  }

  renderTransformedElementAt(bounds, sourceElem) {
    const transform = this.buildCSSTransformationMatrix(bounds, sourceElem);
    const img = document.createElement('img');
    img.src = sourceElem.url;
    img.classList.add('compositor__element');
    img.setAttribute('style', `transform: ${transform};`);

    this.transformedElementsContainer.appendChild(img);
  }
}
