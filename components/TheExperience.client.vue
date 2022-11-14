<script setup lang="ts">
import { Ref } from 'vue';
import {
  AmbientLight,
  Color,
  Fog,
  Object3D,
  PerspectiveCamera,
  Scene,
  sRGBEncoding,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useWindowSize } from '@vueuse/core';

const experience: Ref<WebGLRenderer | null> = ref(null);
let renderer: WebGLRenderer;
let controls: OrbitControls;

const { width, height } = useWindowSize();
const aspectRatio = computed(() => width.value / height.value);

watch(aspectRatio, updateRenderer);
watch(aspectRatio, updateCamera);

const scene = new Scene();
const bgColor = new Color('#E1F0C2');
// Fog
scene.fog = new Fog(bgColor, 0.1, 75);
scene.background = bgColor;

const camera = new PerspectiveCamera(45, aspectRatio.value, 0.1, 1000);

camera.position.set(6, 6, 6);
scene.add(camera);

// Lights
const light = new AmbientLight(0xffaaff);
light.position.set(10, 10, 10);
light.intensity = 1;
scene.add(light);

// Model
const { loadModel } = useModel();

const cat = await loadModel('/models/nuxt-mascot/nuxt-mascot.gltf');

if (cat) {
  scene.add(cat as Object3D<Event>);
}
const loop = () => {
  // Update renderer

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
};

function updateRenderer() {
  if (renderer) {
    renderer.setSize(width.value, height.value);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}

function updateCamera() {
  camera.aspect = aspectRatio.value;
  camera.updateProjectionMatrix();
}

watch(experience, (canvasRef) => {
  renderer = new WebGLRenderer({
    canvas: canvasRef as unknown as HTMLCanvasElement,
    antialias: true,
    alpha: true,
  });

  renderer.outputEncoding = sRGBEncoding;
  renderer.toneMappingExposure = 1;
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  loop();
  updateRenderer();
});
</script>
<template>
  <canvas ref="experience" />
</template>
