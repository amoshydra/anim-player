import TestAnimationJson from "../assets/test-animation.json?url";

const params = new URLSearchParams(location.search);
const options = {
  autoPlay: (params.get("autoplay") ?? "true") === "true",
  file: params.get("file") ?? TestAnimationJson,
  loop: (params.get("loop") ?? "true") === "true",
  renderer: (params.get("renderer") ?? "svg") as "svg" | "canvas",
};
export const useQuery = () => {
  return options;
};
