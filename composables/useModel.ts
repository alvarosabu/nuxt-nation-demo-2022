import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { /* AnimationMixer, */ Group, Object3D } from 'three';

export enum ModelType {
  GLTF,
  GLB,
  OBJ,
}

export type Model = Object3D<Event> | GLTF | Group | null;
export type ModelLoader = GLTFLoader | OBJLoader;
const gltfLoader = new GLTFLoader();

export interface ModelOptions {
  draco?: boolean;
  animated: boolean;
}

const MapLoaders: { [key: number]: ModelLoader } = {
  [ModelType.GLTF]: gltfLoader,
  [ModelType.GLB]: gltfLoader,
  [ModelType.OBJ]: new OBJLoader(),
};

export function useModel() {

  function loadModel(url: string /* options?: ModelOptions */): Promise<Model> {
    if (!url) {
      console.error('[useModelLoader] - No url provided');
      return Promise.resolve(null);
    }
    const extension = url.split('.').pop() as string;
    const loader =
      MapLoaders[ModelType[extension.toUpperCase() as keyof typeof ModelType]];


    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (model: GLTF | Group) => {
          if (extension === 'gltf' || extension === 'glb') {
            const gltfModel = (model as GLTF).scene;
            /* if (options?.animated) {
              mixer.value = new AnimationMixer(gltfModel)
              gltfModel.actions = generateActionsFromAnimations((model as GLTF).animations)
              gltfModel.currentAction = Object.values(gltfModel.actions)[0]
            } */
            resolve(gltfModel);
          } else if (extension === 'obj') {
            resolve(model as Group);
          }
        },
        () => {},
        (error) => {
          console.error(error);
          reject(new Error('[useModelLoader] - Failed to load model'));
        }
      );
    });
  }

  return {
    loadModel,
  };
}
