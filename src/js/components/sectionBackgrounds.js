import Component from "../classes/Component";
import frames from "../../../static/frames.json";

export default class SectionBackgrounds extends Component {
  constructor() {
    super({
      element: "body",
      elements: {
        canvas: "canvas",
        looks: "[data-look]",
        lookIndex: "[data-look-index]",
      },
    });

    this.renderCanvas = this.elements.canvas;
    this.ctx = this.renderCanvas.getContext("2d", { willReadFrequently: true });

    this.frameStates = {
      previous: 0,
      current: 0,
      isTransitioning: false,
      isScrolling: false,
    };
    this.renderCanvas.width = window.innerWidth;
    this.renderCanvas.height = window.innerHeight;
    this.frames = frames;
    this.length = this.frames.length;
    this.FPS = 60;
    this.image = new Image();
    this.snapFrames = [65, 269, 329];
    this.snapThreshold = 20;

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

    console.log(this.image);

    this.image.onload = () => {
      this.drawFrame(this.image);
    };
  }

  update() {
    if (this.frameStates.previous !== this.frameStates.current) {
      this.frameStates.previous = this.frameStates.current;
      this.updateFrame(this.frameStates.previous);
    }
  }

  onScroll(e) {
    const delta = e.deltaY;

    if (delta > 0) {
      this.frameStates.current =
        this.frameStates.current + 1 >= this.length
          ? 0
          : this.frameStates.current + 1;
    } else {
      this.frameStates.current =
        this.frameStates.current - 1 < 0
          ? this.length - 1
          : this.frameStates.current - 1;
    }

    window.clearTimeout(this.frameStates.isScrolling);

    this.frameStates.isScrolling = setTimeout(() => {
      this.jumpToFrame();
    }, 100);
  }

  jumpToFrame() {
    // check if we're close to a snap frame using the snapThreshold

    const isCloseToSnapFrame = this.snapFrames.some((frame) => {
      return Math.abs(frame - this.frameStates.current) < this.snapThreshold;
    });

    if (isCloseToSnapFrame) {
      // find the closest snap frame
      const closestSnapFrame = this.snapFrames.reduce((prev, curr) => {
        return Math.abs(curr - this.frameStates.current) <
          Math.abs(prev - this.frameStates.current)
          ? curr
          : prev;
      });

      const snapFrameIndex = this.snapFrames.indexOf(closestSnapFrame);

      this.setActiveLook(snapFrameIndex);

      // slowly transition to the closest snap frame one frame at a time

      const transition = setInterval(() => {
        if (this.frameStates.current !== closestSnapFrame) {
          this.frameStates.isTransitioning = true;

          if (this.frameStates.current < closestSnapFrame) {
            this.frameStates.current++;
          } else {
            // this.frameStates.current--;
          }
        } else {
          this.frameStates.isTransitioning = false;
          clearInterval(transition);
        }
      }, 1000 / this.FPS);
    } else {
      this.elements.looks.forEach((look) => {
        look.classList.remove("active");
      });
    }
  }

  setActiveLook(index) {
    const { lookIndex, looks } = this.elements;
    looks.forEach((look) => {
      look.classList.remove("active");
    });

    looks[index].classList.add("active");

    lookIndex.innerHTML = index + 1;
  }

  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));

    window.addEventListener("wheel", this.onScroll.bind(this));
  }
}
