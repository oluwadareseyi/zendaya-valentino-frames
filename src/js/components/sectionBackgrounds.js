import Component from "../classes/Component";
import frames from "../../../static/frames.json";

export default class SectionBackgrounds extends Component {
  constructor() {
    super({
      element: "body",
      elements: {
        canvas: "canvas",
      },
    });

    this.renderCanvas = this.elements.canvas;
    this.ctx = this.renderCanvas.getContext("2d", { willReadFrequently: true });
    this.lastIndex = 0;
    this.currentIndex = 0;
    this.FPS = 50;
    this.renderCanvas.width = window.innerWidth;
    this.renderCanvas.height = window.innerHeight;
    this.frames = frames;
    this.length = this.frames.length;
    this.image = new Image();
    this.snapFrames = ["65", "269", "329"];

    this.addEventListeners();
    this.preloadFrames();
    this.drawFirstFrame();
  }

  drawFrame(frame) {
    this.ctx.drawImage(frame, 0, 0);
  }

  onResize() {
    this.renderCanvas.width = window.innerWidth;
    this.renderCanvas.height = window.innerHeight;
  }

  preloadFrames() {
    this.frames.forEach((frame) => {
      const image = new Image();
      image.src = frame;
    });
  }

  updateFrame(index) {
    this.image.src = this.frames[index];
    this.drawFrame(this.image);
  }

  drawFirstFrame() {
    this.image.src = this.frames[0];

    this.image.onload = () => {
      this.drawFrame(this.image);
    };
  }

  update() {
    if (this.lastIndex !== this.currentIndex) {
      console.log(this.currentIndex);
      this.updateFrame(this.currentIndex);
      this.lastIndex = this.currentIndex;
    }
  }

  onScroll(e) {
    const delta = e.deltaY;

    if (delta > 0) {
      this.currentIndex =
        this.currentIndex + 1 >= this.length ? 0 : this.currentIndex + 1;
    } else {
      this.currentIndex =
        this.currentIndex - 1 < 0 ? this.length - 1 : this.currentIndex - 1;
    }
  }

  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));

    window.addEventListener("wheel", this.onScroll.bind(this));
  }
}
