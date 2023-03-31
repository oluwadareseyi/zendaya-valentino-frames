import SectionBackgrounds from "./components/sectionBackgrounds";

const backgrounds = new SectionBackgrounds();

const update = () => {
  backgrounds.update();
  requestAnimationFrame(update);
};
update();
