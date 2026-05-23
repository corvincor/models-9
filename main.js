import * as THREE from "https://unpkg.com/three@0.136.0/build/three.module.js";

import { GLTFLoader } from "https://unpkg.com/three@0.136.0/examples/jsm/loaders/GLTFLoader.js";

import {
  CSS3DRenderer,
  CSS3DObject,
} from "https://unpkg.com/three@0.136.0/examples/jsm/renderers/CSS3DRenderer.js";

let player;

window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player(
    "player",

    {
      videoId: "ywVRLuN6KWA",

      playerVars: {
        playsinline: 1,
      },
    },
  );
};

window.addEventListener(
  "DOMContentLoaded",

  async () => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "./targets.mind",
      maxTrack: 2,
    });

    const { renderer, scene, camera } = mindarThree;

    const cssRenderer = new CSS3DRenderer();

    cssRenderer.setSize(window.innerWidth, window.innerHeight);

    cssRenderer.domElement.style.position = "absolute";

    cssRenderer.domElement.style.top = "0";

    document.body.appendChild(cssRenderer.domElement);

    const cssScene = new THREE.Scene();

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);

    scene.add(light);

    const youtube = new CSS3DObject(document.getElementById("youtube"));

    youtube.scale.set(0.0015, 0.0015, 0.0015);

    const videoAnchor = mindarThree.addCSSAnchor(0);

    videoAnchor.group.add(youtube);

    videoAnchor.onTargetFound = () => {
      document.getElementById("youtube").style.display = "block";

      if (player) {
        player.playVideo();
      }
    };

    videoAnchor.onTargetLost = () => {
      if (player) {
        player.pauseVideo();
      }
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
  },
);
