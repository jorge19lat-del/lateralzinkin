import Fosbury, { keyFrame as fKey, pivot as fPivot } from "./Fosbury";
import Cruyff, { keyFrame as cKey, pivot as cPivot } from "./Cruyff";
import Hendrix, { keyFrame as hKey, pivot as hPivot } from "./Hendrix";

// pivot: momento en que el personaje rompe la norma (se tacha el "antes")
// keyFrame: fotograma fijo para quien prefiere movimiento reducido
export const scenes = {
  fosbury: { Scene: Fosbury, pivot: fPivot, keyFrame: fKey },
  cruyff: { Scene: Cruyff, pivot: cPivot, keyFrame: cKey },
  hendrix: { Scene: Hendrix, pivot: hPivot, keyFrame: hKey },
};

export type SceneName = keyof typeof scenes;
