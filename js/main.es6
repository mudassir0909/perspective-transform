const sourceImages = [
  { url: './images/darknightportrait.jpg', width: 420, height: 630 },
  { url: './images/darkknightlandscape.jpg', width: 1920, height: 1080 },
];

const targetImages = [
  { url: './images/timesquare.png', },
];

const compositor = new Compositor(
    document.getElementById('compositor__baseImage'),
    document.getElementById('compositor__transformedElementsContainer'));
const photoSelector = new PhotoSelector(
    document.getElementById('photoSelector'), sourceImages);
photoSelector.render();

const targetPhotoSelector = new PhotoSelector(
    document.getElementById('targetPhotoSelector'), targetImages);
targetPhotoSelector.render();
document.getElementById('compositor__baseImage').src = targetPhotoSelector.getSelection().url;
targetPhotoSelector.setOnClick(image => {
  document.getElementById('compositor__baseImage').src = image.url;
  compositor.clear();
});

let prevBounds;
compositor.setOnTransform(bounds => {
  prevBounds = bounds;
  compositor.renderTransformedElementAt(bounds, photoSelector.getSelection());
});

photoSelector.setOnClick(image => {
  if (prevBounds) {
    compositor.renderTransformedElementAt(prevBounds, image);
  }
});
