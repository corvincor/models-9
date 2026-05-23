
import { CSS3DObject } from "https://unpkg.com/three/examples/jsm/renderers/CSS3DRenderer.js";
import { GLTFLoader } from "https://unpkg.com/three/examples/jsm/loaders/GLTFLoader.js";

function getVideoId(url) {
  const urltypes = [
    "https://www.youtube.com/shorts/",
    "https://youtu.be/",
    "https://www.youtube.com/watch?v=",
  ];
  if (url.startsWith(urltypes[0])) return url.substr(urltypes[0].length);
  if (url.startsWith(urltypes[1])) return url.substr(urltypes[1].length);
  if (url.startsWith(urltypes[2])) {
    let s = url.substr(urltypes[2].length);
    let index = s.indexOf("&");
    return index === -1 ? s : s.substr(0, index);
  }
  return url;
}

const createYoutube = (url) => {
  return new Promise((resolve) => {
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      const player = new YT.Player("player", {
        videoId: getVideoId(url),
        events: {
          onReady: () => resolve(player),
        },
      });
    };
  });
};

window.addEventListener("load", () => {
  const start = async () => {
    const player = await createYoutube(
      "https://www.youtube.com/watch?v=ZvMHF3zBuis",
    );

    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "targets.mind",
    });

    const { renderer, cssRenderer, scene, cssScene, camera } = mindarThree;

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const obj = new CSS3DObject(document.querySelector("#ar-div"));
    const cssAnchor = mindarThree.addCSSAnchor(0);
    cssAnchor.group.add(obj);

    cssAnchor.onTargetFound = () => player.playVideo();
    cssAnchor.onTargetLost = () => player.pauseVideo();

    const gltfLoader = new GLTFLoader();
    const anchor1 = mindarThree.addAnchor(1);

    gltfLoader.load(
      "https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models/2.0/Fox/glTF-Binary/Fox.glb",
      (gltf) => {
        gltf.scene.scale.set(0.01, 0.01, 0.01);
        gltf.scene.position.set(0, -0.2, 0);
        anchor1.group.add(gltf.scene);
      },
    );

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
      cssRenderer.render(cssScene, camera);
    });
  };

  start();
});
