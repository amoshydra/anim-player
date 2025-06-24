import TestAnimationJson from "../assets/test-animation.json?url";

const params = new URLSearchParams(location.search);
const options = {
  file: params.get("file") ?? TestAnimationJson,
};
export const useQuery = () => {
  return options;
};
