const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const extractFrames = require("ffmpeg-extract-frames");
const fs = require("fs");
const EXTRACTED_IMAGE_DIRECTORY = "static/frames";
const VIDEO_URL =
  "https://res.cloudinary.com/dmwfd0zhh/video/upload/v1680173095/2023-personal-projects/Zendaya_x_Valentino_yrwdcs.mp4";

// Create the directory if it doesn't exist
const createFramesDirectory = () => {
  if (!fs.existsSync(EXTRACTED_IMAGE_DIRECTORY)) {
    fs.mkdirSync(EXTRACTED_IMAGE_DIRECTORY);
  }
};

// const getVideoLength = async (videoUrl) => {
//   return new Promise((resolve) => {
//     ffmpeg.ffprobe(videoUrl, (err, data) => {
//       const videoStream = data.streams.find(
//         (stream) => stream.codec_type === "video"
//       );

//       const FPS =
//         (videoStream ? videoStream.nb_frames : 0) / data.format.duration;
//       resolve(Math.ceil(FPS));
//     });
//   });
// };

const extractFramesFromVideo = async (videoUrl) => {
  const options = {
    input: videoUrl,
    output: `${EXTRACTED_IMAGE_DIRECTORY}/frame-%d.png`,
  };

  await extractFrames(options);

  // create JSON file with the frame urls relative to the static folder

  const frameUrls = fs
    .readdirSync(EXTRACTED_IMAGE_DIRECTORY)
    .sort((a, b) => {
      const aNumber = parseInt(a.split("-")[1].split(".")[0]);
      const bNumber = parseInt(b.split("-")[1].split(".")[0]);

      return aNumber - bNumber;
    })
    .map((frame) => `/frames/${frame}`);

  fs.writeFileSync("static/frames.json", JSON.stringify(frameUrls, null, 2));
};

const main = async () => {
  createFramesDirectory();
  await extractFramesFromVideo(VIDEO_URL);
};

main();

// Extract frames from the video
