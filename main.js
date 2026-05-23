import { CSS3DObject } from "CSS3DObject";

import { GLTFLoader } from "GLTFLoader";

const THREE = window.MINDAR.IMAGE.THREE;

document.getElementById("start").onclick = async () => {
  document.getElementById("start");
  remove();

  const mindarThree = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,

    imageTargetSrc: "./targets.mind",

    maxTrack: 2,
  });

  const { renderer, cssRenderer, scene, cssScene, camera } = mindarThree;

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);

  scene.add(light);

  const player = new YT.Player(
    "player",

    {
      videoId: "ywVRLuN6KWA",

      playerVars: {
        playsinline: 1,
      },
    },
  );

  const youtubeObject = new CSS3DObject(document.getElementById("youtube"));

  youtubeObject.scale.set(0.0015, 0.0015, 0.0015);

  const youtubeAnchor = mindarThree.addCSSAnchor(0);

  youtubeAnchor.group.add(youtubeObject);

  youtubeAnchor.onTargetFound = () => {
    player.playVideo();
  };

  youtubeAnchor.onTargetLost = () => {
    player.pauseVideo();
  };

  const loader = new GLTFLoader();

  const gltf = await loader.loadAsync(
    "https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@master/examples/image-tracking/assets/band-example/raccoon/scene.gltf",
  );

  gltf.scene.scale.set(0.1, 0.1, 0.1);

  gltf.scene.position.set(0, -0.4, 0);

  const modelAnchor = mindarThree.addAnchor(1);

  modelAnchor.group.add(gltf.scene);

  await mindarThree.start();

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);

    cssRenderer.render(cssScene, camera);
  });
};
