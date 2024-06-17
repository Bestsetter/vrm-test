import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let renderer, scene, camera;
let cameraControl, stats, gui;
let ambientLight;
let model;

let datGUIControls = new (function () {
  this.AmbientLight = true;
  this.scaneAxes = true;
  this.modelAxes = true;
  // this.AmbientLightColor = 0xffffff
  this.AutoRotate = false;
  this.bornhelper = false;
  this.AutoRotateSpeed = 0;
  this.positionX = 0;
  this.positionY = 0;
  this.positionZ = 0;
  this.rotationX = 0;
  this.rotationY = 0;
  this.rotationZ = 0;
  this.headrotationX = 0;
  this.headrotationY = 0;
  this.headrotationZ = 0;
  this.leftEyerotationX = 0;
  this.leftEyerotationY = 0;
  this.leftEyerotationZ = 0;
  this.neckrotationX = 0;
  this.neckrotationY = 0;
  this.neckrotationZ = 0;
  this.Surprised = 0;
  this.aa = 0;
  this.angry = 0;
  this.blink = 0;
  this.blinkLeft = 0;
  this.blinkRight = 0;
  this.ee = 0;
  this.happy = 0;
  this.ih = 0;
  this.neutral = 0;
  this.oh = 0;
  this.ou = 0;
  this.relaxed = 0;
  this.sad = 0;
})();

// function initStats() {
//   stats = new Stats();
//   stats.setMode(0);
//   document.getElementById("stats").appendChild(stats.domElement);
//   return stats;
// }

// 畫面初始化
function init() {
  // 渲染器設定
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = 2; // THREE.PCFSoftShadowMap

  scene = new THREE.Scene();

  const loader = new GLTFLoader();
  loader.register((parser) => {
    return new VRMLoaderPlugin(parser);
  });
  loader.load("test.vrm", function (gltf) {
    model = gltf.userData.vrm;
    console.log("gltf:", gltf);
    console.log(
      "gltf.userData.vrm.humanoid._normalizedHumanBones.humanBones",
      gltf.userData.vrm.humanoid._normalizedHumanBones.humanBones
    );
    // model.scale.set(2, 2, 5);
    // model.position.set(0, 0, 0);
    // model.children[1].material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    scene.add(model.scene);
  });

  scene.background = new THREE.Color(0xffffff);

  // 相機設定
  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, -10);
  camera.lookAt(scene.position);

  // stats = new initStats();

  // 建立 OrbitControls
  cameraControl = new OrbitControls(camera, renderer.domElement);
  cameraControl.enableDamping = true; // 啟用阻尼效果
  cameraControl.dampingFactor = 0.25; // 阻尼系數
  cameraControl.enabled = true;
  cameraControl.autoRotate = false; // 啟用自動旋轉
  cameraControl.autoRotateSpeed = 10;

  // 設置環境光 AmbientLight
  ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  document.body.appendChild(renderer.domElement);

  gui = new dat.GUI();
  gui.add(datGUIControls, "AmbientLight").onChange(function (e) {
    ambientLight.visible = e;
  });
  gui.add(datGUIControls, "AutoRotate").onChange(function (e) {
    cameraControl.autoRotate = e;
  });
  gui.add(datGUIControls, "bornhelper").onChange(function (e) {
    if (e) {
      const bornhelper = new THREE.SkeletonHelper(model.scene);
      scene.add(bornhelper);
    } else {
      scene.remove(scene.children[scene.children.length - 1]);
    }
  });
  gui
    .add(datGUIControls, "AutoRotateSpeed", -100, 100)
    .onChange(function (val) {
      cameraControl.autoRotateSpeed = val;
    });
  gui.add(datGUIControls, "positionX", -100, 100).onChange(function (val) {
    model.scene.position.x = val;
  });
  gui.add(datGUIControls, "positionY", -100, 100).onChange(function (val) {
    model.scene.position.y = val;
  });
  gui.add(datGUIControls, "positionZ", -100, 100).onChange(function (val) {
    model.scene.position.z = val;
  });
  gui
    .add(datGUIControls, "rotationX", -Math.PI, Math.PI)
    .onChange(function (val) {
      model.scene.rotation.x = val;
    });
  gui
    .add(datGUIControls, "rotationY", -Math.PI, Math.PI)
    .onChange(function (val) {
      model.scene.rotation.y = val;
    });
  gui
    .add(datGUIControls, "rotationZ", -Math.PI, Math.PI)
    .onChange(function (val) {
      model.scene.rotation.z = val;
    });
  gui
    .add(datGUIControls, "headrotationX", -Math.PI, Math.PI)
    .onChange(function (val) {
      model.humanoid.getNormalizedBoneNode("head").rotation.x = val;
    });
  gui
    .add(datGUIControls, "headrotationY", -Math.PI, Math.PI)
    .onChange(function (val) {
      model.humanoid.getNormalizedBoneNode("head").rotation.y = val;
    });
  gui
    .add(datGUIControls, "headrotationZ", -Math.PI, Math.PI)
    .onChange(function (val) {
      model.humanoid.getNormalizedBoneNode("head").rotation.z = val;
    });
  gui
    .add(datGUIControls, "leftEyerotationX", -Math.PI, Math.PI)
    .onChange(function (val) {
      model.humanoid.getNormalizedBoneNode("leftEye").rotation.x = val;
    });
  gui
    .add(datGUIControls, "leftEyerotationY", -Math.PI, Math.PI)
    .onChange(function (val) {
      model.humanoid.getNormalizedBoneNode("leftEye").rotation.y = val;
    });
  gui
    .add(datGUIControls, "leftEyerotationZ", -Math.PI, Math.PI)
    .onChange(function (val) {
      model.humanoid.getNormalizedBoneNode("leftEye").rotation.z = val;
    });
  gui
    .add(datGUIControls, "neckrotationX", -Math.PI, Math.PI)
    .onChange(function (val) {
      model.humanoid.getNormalizedBoneNode("neck").rotation.x = val;
    });
  gui
    .add(datGUIControls, "neckrotationY", -Math.PI, Math.PI)
    .onChange(function (val) {
      model.humanoid.getNormalizedBoneNode("neck").rotation.y = val;
    });
  gui
    .add(datGUIControls, "neckrotationZ", -Math.PI, Math.PI)
    .onChange(function (val) {
      model.humanoid.getNormalizedBoneNode("neck").rotation.z = val;
    });
  gui.add(datGUIControls, "Surprised", 0, 1).onChange(function (val) {
    model.expressionManager.setValue("Surprised", val);
  });
  gui.add(datGUIControls, "aa", 0, 1).onChange(function (val) {
    model.expressionManager.setValue("aa", val);
  });
  gui.add(datGUIControls, "angry", 0, 1).onChange(function (val) {
    model.expressionManager.setValue("angry", val);
  });
  gui.add(datGUIControls, "blink", 0, 1).onChange(function (val) {
    model.expressionManager.setValue("blink", val);
  });
  gui.add(datGUIControls, "blinkLeft", 0, 1).onChange(function (val) {
    model.expressionManager.setValue("blinkLeft", val);
  });
  gui.add(datGUIControls, "blinkRight", 0, 1).onChange(function (val) {
    model.expressionManager.setValue("blinkRight", val);
  });
  gui.add(datGUIControls, "ee", 0, 1).onChange(function (val) {
    model.expressionManager.setValue("ee", val);
  });
  gui.add(datGUIControls, "happy", 0, 1).onChange(function (val) {
    model.expressionManager.setValue("happy", val);
  });
  gui.add(datGUIControls, "ih", 0, 1).onChange(function (val) {
    model.expressionManager.setValue("ih", val);
  });
  gui.add(datGUIControls, "neutral", 0, 1).onChange(function (val) {
    model.expressionManager.setValue("neutral", val);
  });
  gui.add(datGUIControls, "oh", 0, 1).onChange(function (val) {
    model.expressionManager.setValue("oh", val);
  });
  gui.add(datGUIControls, "ou", 0, 1).onChange(function (val) {
    model.expressionManager.setValue("ou", val);
  });
  gui.add(datGUIControls, "relaxed", 0, 1).onChange(function (val) {
    model.expressionManager.setValue("relaxed", val);
  });
  gui.add(datGUIControls, "sad", 0, 1).onChange(function (val) {
    model.expressionManager.setValue("sad", val);
  });

  const clock = new THREE.Clock();
  clock.start();
  function render() {
    // stats.update();
    cameraControl.update();
    requestAnimationFrame(render);
    if (model) {
      model.update(clock.getDelta());
    }
    renderer.render(scene, camera);
    // console.log(render)
  }
  render();
}

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
