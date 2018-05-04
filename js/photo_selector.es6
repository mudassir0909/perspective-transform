class PhotoSelector {
  constructor(el, images) {
    this.images = images;
    this.el = el;
    this.selection = 0;
    this.callbacks = [];
    el.addEventListener('click', this.onClick.bind(this));
  }

  onClick(e) {
    if (e.target.classList.contains('photoSelector__selectable')) {
      this.selection  = Number(e.target.dataset.idx);

      Array.from(e.target.parentElement.children)
          .forEach(child => child.classList.remove('photoSelector__selectable--selected'));
      e.target.classList.add('photoSelector__selectable--selected');

      this.callbacks.forEach(cb => cb(this.images[this.selection]));
    }
  }

  setOnClick(cb) {
    this.callbacks.push(cb);
  }

  getSelection() {
    return this.images[this.selection];
  }

  render() {
    this.images.forEach((img, idx) => {
      const imgThumbnail = document.createElement('div');
      imgThumbnail.classList.add('photoSelector__selectable');

      if (idx === this.selection) {
        imgThumbnail.classList.add('photoSelector__selectable--selected');
      }

      imgThumbnail.setAttribute('style', `background-image: url(${img.url});`)
      imgThumbnail.dataset.idx = idx;
      this.el.appendChild(imgThumbnail);
    });
  }
}
