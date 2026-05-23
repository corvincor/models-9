// Імпортуємо інструменти Three.js відповідної версії
import { CSS3DObject } from "https://unpkg.com/three@0.147.0/examples/jsm/renderers/CSS3DRenderer.js";
import { GLTFLoader } from "https://unpkg.com/three@0.147.0/examples/jsm/loaders/GLTFLoader.js";

// Функція для отримання ID відео з різних типів посилань YouTube
function getVideoId(url) {
  const urltypes = [
    "https://www.youtube.com/shorts/",
    "https://youtu.be/",
    "https://www.youtube.com/watch?v="
  ];
  if (url.startsWith(urltypes[0])) return url.substring(urltypes[0].length);
  if (url.startsWith(urltypes[1])) return url.substring(urltypes[1].length);
  if (url.startsWith(urltypes[2])) {
    let s = url.substring(urltypes[2].length);
    let index = s.indexOf("&");
    return (index === -1) ? s : s.substring(0, index);
  }
  return url;
}

// Асинхронне створення YouTube-плеєра за допомогою IFrame API
const createYoutube = (url) => {
  return new Promise((resolve) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      const player = new YT.Player("player", {
        videoId: getVideoId(url),
        events: {
          onReady: () => resolve(player)
        }
      });
    }
  });
}

// Запуск програми після завантаження DOM
document.addEventListener("DOMContentLoaded", () => {
  const start = async () => {
    // Ініціалізація глобального об'єкта THREE безпосередньо з ядра MindAR
    const THREE = window.MINDAR.IMAGE.THREE;

    // Створюємо відео (можете підставити своє посилання)
    const player = await createYoutube("https://www.youtube.com/watch?v=ywVRLuN6KWA");

    // Ініціалізація MindARThree
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "targets.mind" // Файл маркера має лежати в корені репозиторію
    });

    const { renderer, cssRenderer, scene, cssScene, camera } = mindarThree;

    // Додаємо базове освітлення для 3D-моделі
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // ==========================================
    // МАРКЕР 1 (Індекс 0): Відео YouTube
    // ==========================================
    const obj = new CSS3DObject(document.querySelector("#ar-div"));
    const cssAnchor = mindarThree.addCSSAnchor(0);
    cssAnchor.group.add(obj);

    cssAnchor.onTargetFound = () => {
      player.playVideo();
    };
    cssAnchor.onTargetLost = () => {
      player.pauseVideo();
    };

    // ==========================================
    // МАРКЕР 2 (Індекс 1): 3D-модель
    // ==========================================
    const gltfLoader = new GLTFLoader();
    const anchor1 = mindarThree.addAnchor(1);
    
    // Завантажуємо 3D-модель Лисиці
    gltfLoader.load("https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models/2.0/Fox/glTF-Binary/Fox.glb", (gltf) => {
      gltf.scene.scale.set(0.01, 0.01, 0.01);
      gltf.scene.position.set(0, -0.2, 0);
      anchor1.group.add(gltf.scene);
    });

    // ==========================================
    // Запуск рушія та циклу рендерингу
    // ==========================================
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      cssRenderer.render(cssScene, camera);
      renderer.render(scene, camera);
    });
  }
  
  start();
});