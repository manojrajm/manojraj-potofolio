import * as THREE from "three";

/**
 * Helper to generate relative QuaternionKeyframeTrack by combining
 * the bone's actual rest bind quaternion with an anatomical delta rotation.
 */
function createRelativeQuatTrack(
  boneName: string,
  restQuats: Record<string, THREE.Quaternion>,
  times: number[],
  eulerOffsets: [number, number, number][]
): THREE.QuaternionKeyframeTrack {
  const base = restQuats[boneName] ? restQuats[boneName].clone() : new THREE.Quaternion();
  const values: number[] = [];

  eulerOffsets.forEach(([ox, oy, oz]) => {
    const delta = new THREE.Quaternion().setFromEuler(new THREE.Euler(ox, oy, oz, "XYZ"));
    // Pre-multiply or multiply with base bind quaternion
    const q = base.clone().multiply(delta);
    values.push(q.x, q.y, q.z, q.w);
  });

  return new THREE.QuaternionKeyframeTrack(`${boneName}.quaternion`, times, values);
}

/**
 * Helper to generate VectorKeyframeTrack for bone position (e.g. Hips weight shifts)
 */
function createPosTrack(
  boneName: string,
  restPositions: Record<string, THREE.Vector3>,
  times: number[],
  offsetKeyframes: [number, number, number][]
): THREE.VectorKeyframeTrack {
  const base = restPositions[boneName] ? restPositions[boneName].clone() : new THREE.Vector3();
  const values: number[] = [];

  offsetKeyframes.forEach(([dx, dy, dz]) => {
    values.push(base.x + dx, base.y + dy, base.z + dz);
  });

  return new THREE.VectorKeyframeTrack(`${boneName}.position`, times, values);
}

/**
 * Helper to generate coordinated finger tracks for a hand
 */
function createFingerTracks(
  side: "Left" | "Right",
  restQuats: Record<string, THREE.Quaternion>,
  times: number[],
  curls: {
    thumb: [number, number, number][];
    index: [number, number, number][];
    middle: [number, number, number][];
    ring: [number, number, number][];
    pinky: [number, number, number][];
  }
): THREE.KeyframeTrack[] {
  const tracks: THREE.KeyframeTrack[] = [];
  const prefix = `${side}Hand`;

  [1, 2, 3].forEach((idx) => {
    tracks.push(createRelativeQuatTrack(`${prefix}Thumb${idx}`, restQuats, times, curls.thumb));
    tracks.push(createRelativeQuatTrack(`${prefix}Index${idx}`, restQuats, times, curls.index));
    tracks.push(createRelativeQuatTrack(`${prefix}Middle${idx}`, restQuats, times, curls.middle));
    tracks.push(createRelativeQuatTrack(`${prefix}Ring${idx}`, restQuats, times, curls.ring));
    tracks.push(createRelativeQuatTrack(`${prefix}Pinky${idx}`, restQuats, times, curls.pinky));
  });

  return tracks;
}

/**
 * Extract rest quaternions and positions from all bones in the scene
 */
export function extractRestTransforms(scene: THREE.Object3D): {
  restQuats: Record<string, THREE.Quaternion>;
  restPositions: Record<string, THREE.Vector3>;
} {
  const restQuats: Record<string, THREE.Quaternion> = {};
  const restPositions: Record<string, THREE.Vector3> = {};

  scene.traverse((child) => {
    if ((child as THREE.Bone).isBone) {
      const clean = child.name.replace(/^mixamorig:/, "");
      restQuats[clean] = child.quaternion.clone();
      restPositions[clean] = child.position.clone();
      restQuats[child.name] = child.quaternion.clone();
      restPositions[child.name] = child.position.clone();
    }
  });

  return { restQuats, restPositions };
}

/**
 * 1. IDLE Animation:
 * Organic breathing, relaxed arms lowered from T-pose to natural posture, subtle head tracking
 */
export function createIdleClip(
  restQuats: Record<string, THREE.Quaternion>,
  restPositions: Record<string, THREE.Vector3>
): THREE.AnimationClip {
  const duration = 3.6;
  const times = [0, 1.8, 3.6];

  const relaxedFingers: [number, number, number][] = [
    [0.18, 0.05, 0.0],
    [0.22, 0.06, 0.0],
    [0.18, 0.05, 0.0],
  ];

  const tracks: THREE.KeyframeTrack[] = [
    // Hips vertical breath
    createPosTrack("Hips", restPositions, times, [
      [0, 0, 0],
      [0, 0.012, 0],
      [0, 0, 0],
    ]),
    // Spine breathing expansion
    createRelativeQuatTrack("Spine", restQuats, times, [
      [0.02, 0, 0],
      [0.05, 0, 0],
      [0.02, 0, 0],
    ]),
    createRelativeQuatTrack("Spine1", restQuats, times, [
      [0.01, 0, 0],
      [0.03, 0, 0],
      [0.01, 0, 0],
    ]),
    // Head subtle sway
    createRelativeQuatTrack("Head", restQuats, times, [
      [0.0, 0.0, 0.0],
      [-0.03, 0.02, 0.01],
      [0.0, 0.0, 0.0],
    ]),
    // Left Arm Chain: lowered naturally along body
    createRelativeQuatTrack("LeftArm", restQuats, times, [
      [0.82, 0.0, 0.0],
      [0.80, 0.01, 0.0],
      [0.82, 0.0, 0.0],
    ]),
    createRelativeQuatTrack("LeftForeArm", restQuats, times, [
      [0.0, 0.0, 0.22],
      [0.0, 0.0, 0.26],
      [0.0, 0.0, 0.22],
    ]),
    createRelativeQuatTrack("LeftHand", restQuats, times, [
      [0.05, 0.0, 0.0],
      [0.06, 0.0, 0.0],
      [0.05, 0.0, 0.0],
    ]),
    // Right Arm Chain: lowered naturally along body
    createRelativeQuatTrack("RightArm", restQuats, times, [
      [0.82, 0.0, 0.0],
      [0.80, -0.01, 0.0],
      [0.82, 0.0, 0.0],
    ]),
    createRelativeQuatTrack("RightForeArm", restQuats, times, [
      [0.0, 0.0, -0.22],
      [0.0, 0.0, -0.26],
      [0.0, 0.0, -0.22],
    ]),
    createRelativeQuatTrack("RightHand", restQuats, times, [
      [0.05, 0.0, 0.0],
      [0.06, 0.0, 0.0],
      [0.05, 0.0, 0.0],
    ]),
    // Coordinated Fingers
    ...createFingerTracks("Left", restQuats, times, {
      thumb: relaxedFingers,
      index: relaxedFingers,
      middle: relaxedFingers,
      ring: relaxedFingers,
      pinky: relaxedFingers,
    }),
    ...createFingerTracks("Right", restQuats, times, {
      thumb: relaxedFingers,
      index: relaxedFingers,
      middle: relaxedFingers,
      ring: relaxedFingers,
      pinky: relaxedFingers,
    }),
  ];

  return new THREE.AnimationClip("IDLE", duration, tracks);
}

/**
 * 2. ABOUT_POINT Animation:
 * User Request:
 * "Character should naturally raise the appropriate hand and point/present toward the About content.
 * Sequence: Idle -> slight weight shift -> shoulder movement -> upper arm raises ->
 * forearm follows -> wrist/hand adjusts -> fingers form pointing/presentation pose ->
 * head turns toward target -> hold briefly -> smoothly return to Idle"
 */
export function createAboutPointClip(
  restQuats: Record<string, THREE.Quaternion>,
  restPositions: Record<string, THREE.Vector3>
): THREE.AnimationClip {
  const duration = 4.2;
  const times = [0.0, 0.6, 1.4, 2.4, 3.4, 4.2];

  // Pointing finger tracks on Right Hand:
  const indexPointKeyframes: [number, number, number][] = [
    [0.18, 0.05, 0],
    [0.10, 0.02, 0],
    [0.0, 0.0, 0],  // Full straight point
    [0.0, 0.0, 0],  // Hold point
    [0.0, 0.0, 0],  // Hold point
    [0.18, 0.05, 0], // Return to idle
  ];
  const thumbOpenKeyframes: [number, number, number][] = [
    [0.18, 0.05, 0],
    [0.22, 0.08, 0],
    [0.28, 0.14, 0],
    [0.28, 0.14, 0],
    [0.28, 0.14, 0],
    [0.18, 0.05, 0],
  ];
  const fingerCurledKeyframes: [number, number, number][] = [
    [0.18, 0.05, 0],
    [0.45, 0.12, 0],
    [0.72, 0.18, 0], // Curled
    [0.72, 0.18, 0], // Hold
    [0.72, 0.18, 0], // Hold
    [0.18, 0.05, 0], // Return
  ];

  const relaxedFingers: [number, number, number][] = [
    [0.18, 0.05, 0],
    [0.18, 0.05, 0],
    [0.18, 0.05, 0],
    [0.18, 0.05, 0],
    [0.18, 0.05, 0],
    [0.18, 0.05, 0],
  ];

  const tracks: THREE.KeyframeTrack[] = [
    // 1. Weight shift on Hips toward left foot
    createPosTrack("Hips", restPositions, times, [
      [0, 0, 0],
      [-0.015, -0.005, 0],
      [-0.024, -0.008, 0],
      [-0.024, -0.008, 0],
      [-0.015, -0.005, 0],
      [0, 0, 0],
    ]),
    // 2. Spine rotation toward right
    createRelativeQuatTrack("Spine", restQuats, times, [
      [0.02, 0.0, 0],
      [0.04, 0.14, 0],
      [0.06, 0.28, 0],
      [0.06, 0.28, 0],
      [0.04, 0.14, 0],
      [0.02, 0.0, 0],
    ]),
    createRelativeQuatTrack("Spine1", restQuats, times, [
      [0.01, 0.0, 0],
      [0.02, 0.10, 0],
      [0.03, 0.22, 0],
      [0.03, 0.22, 0],
      [0.02, 0.10, 0],
      [0.01, 0.0, 0],
    ]),
    // 3. Head & Neck turning toward About Me content
    createRelativeQuatTrack("Neck", restQuats, times, [
      [0.0, 0.0, 0],
      [0.0, 0.16, 0],
      [0.02, 0.35, 0],
      [0.02, 0.35, 0],
      [0.0, 0.16, 0],
      [0.0, 0.0, 0],
    ]),
    createRelativeQuatTrack("Head", restQuats, times, [
      [0.0, 0.0, 0],
      [-0.03, 0.22, 0.02],
      [-0.06, 0.45, 0.04],
      [-0.06, 0.45, 0.04],
      [-0.03, 0.22, 0.02],
      [0.0, 0.0, 0],
    ]),
    // 4. Right Shoulder elevates
    createRelativeQuatTrack("RightShoulder", restQuats, times, [
      [0.0, 0.0, 0],
      [0.06, 0.04, 0.08],
      [0.12, 0.06, 0.14],
      [0.12, 0.06, 0.14],
      [0.06, 0.04, 0.08],
      [0.0, 0.0, 0],
    ]),
    // 5. Right Upper Arm raises forward and right pointing
    createRelativeQuatTrack("RightArm", restQuats, times, [
      [0.82, 0.0, 0.0],
      [0.25, 0.0, -0.45],
      [-0.20, 0.0, -0.85],
      [-0.20, 0.0, -0.85],
      [0.25, 0.0, -0.45],
      [0.82, 0.0, 0.0],
    ]),
    // 6. Right ForeArm extends pointing toward content
    createRelativeQuatTrack("RightForeArm", restQuats, times, [
      [0.0, 0.0, -0.22],
      [0.0, 0.0, -0.35],
      [0.0, 0.0, -0.45],
      [0.0, 0.0, -0.45],
      [0.0, 0.0, -0.35],
      [0.0, 0.0, -0.22],
    ]),
    // 7. Right Hand wrist alignment
    createRelativeQuatTrack("RightHand", restQuats, times, [
      [0.05, 0.0, 0.0],
      [0.10, 0.05, 0.0],
      [0.15, 0.10, 0.0],
      [0.15, 0.10, 0.0],
      [0.10, 0.05, 0.0],
      [0.05, 0.0, 0.0],
    ]),
    // Left Arm relaxed at side
    createRelativeQuatTrack("LeftArm", restQuats, times, [
      [0.82, 0.0, 0.0],
      [0.82, 0.0, 0.0],
      [0.82, 0.0, 0.0],
      [0.82, 0.0, 0.0],
      [0.82, 0.0, 0.0],
      [0.82, 0.0, 0.0],
    ]),
    createRelativeQuatTrack("LeftForeArm", restQuats, times, [
      [0.0, 0.0, 0.22],
      [0.0, 0.0, 0.22],
      [0.0, 0.0, 0.22],
      [0.0, 0.0, 0.22],
      [0.0, 0.0, 0.22],
      [0.0, 0.0, 0.22],
    ]),
    // Finger pointing formations
    ...createFingerTracks("Right", restQuats, times, {
      thumb: thumbOpenKeyframes,
      index: indexPointKeyframes,
      middle: fingerCurledKeyframes,
      ring: fingerCurledKeyframes,
      pinky: fingerCurledKeyframes,
    }),
    ...createFingerTracks("Left", restQuats, times, {
      thumb: relaxedFingers,
      index: relaxedFingers,
      middle: relaxedFingers,
      ring: relaxedFingers,
      pinky: relaxedFingers,
    }),
  ];

  return new THREE.AnimationClip("ABOUT_POINT", duration, tracks);
}

/**
 * 3. TECH_GESTURE Animation (Experience Section):
 * Subtle professional corporate developer presentation pose typing on holographic terminal
 */
export function createTechGestureClip(
  restQuats: Record<string, THREE.Quaternion>,
  _restPositions: Record<string, THREE.Vector3>
): THREE.AnimationClip {
  const duration = 2.4;
  const times = [0, 0.6, 1.2, 1.8, 2.4];

  const techFingers: [number, number, number][] = [
    [0.25, 0.05, 0],
    [0.32, 0.08, 0],
    [0.28, 0.06, 0],
    [0.34, 0.08, 0],
    [0.25, 0.05, 0],
  ];

  const tracks: THREE.KeyframeTrack[] = [
    // Torso leaned slightly forward with engagement
    createRelativeQuatTrack("Spine", restQuats, times, [
      [0.08, 0, 0],
      [0.10, 0.02, 0],
      [0.08, 0, 0],
      [0.10, -0.02, 0],
      [0.08, 0, 0],
    ]),
    // Head looking slightly down toward coding architecture
    createRelativeQuatTrack("Head", restQuats, times, [
      [0.15, 0, 0],
      [0.18, 0.02, 0],
      [0.16, 0, 0],
      [0.18, -0.02, 0],
      [0.15, 0, 0],
    ]),
    // Left Arm Chain
    createRelativeQuatTrack("LeftArm", restQuats, times, [
      [0.45, 0, 0.35],
      [0.48, 0, 0.38],
      [0.45, 0, 0.35],
      [0.48, 0, 0.38],
      [0.45, 0, 0.35],
    ]),
    createRelativeQuatTrack("LeftForeArm", restQuats, times, [
      [0.0, 0, 0.65],
      [0.0, 0, 0.70],
      [0.0, 0, 0.62],
      [0.0, 0, 0.68],
      [0.0, 0, 0.65],
    ]),
    // Right Arm Chain
    createRelativeQuatTrack("RightArm", restQuats, times, [
      [0.45, 0, -0.35],
      [0.48, 0, -0.38],
      [0.45, 0, -0.35],
      [0.48, 0, -0.38],
      [0.45, 0, -0.35],
    ]),
    createRelativeQuatTrack("RightForeArm", restQuats, times, [
      [0.0, 0, -0.65],
      [0.0, 0, -0.62],
      [0.0, 0, -0.70],
      [0.0, 0, -0.64],
      [0.0, 0, -0.65],
    ]),
    // Finger keyframes
    ...createFingerTracks("Left", restQuats, times, {
      thumb: techFingers,
      index: techFingers,
      middle: techFingers,
      ring: techFingers,
      pinky: techFingers,
    }),
    ...createFingerTracks("Right", restQuats, times, {
      thumb: techFingers,
      index: techFingers,
      middle: techFingers,
      ring: techFingers,
      pinky: techFingers,
    }),
  ];

  return new THREE.AnimationClip("TECH_GESTURE", duration, tracks);
}

/**
 * 4. SKILLS_PRESENT Animation (Skills Section):
 * Upright proud spine, both arms open outward presenting the skill constellation
 */
export function createSkillsPresentClip(
  restQuats: Record<string, THREE.Quaternion>,
  _restPositions: Record<string, THREE.Vector3>
): THREE.AnimationClip {
  const duration = 3.6;
  const times = [0, 1.8, 3.6];

  const openPalmFingers: [number, number, number][] = [
    [0.08, 0.02, 0],
    [0.05, 0.01, 0],
    [0.08, 0.02, 0],
  ];

  const tracks: THREE.KeyframeTrack[] = [
    // Upright proud posture
    createRelativeQuatTrack("Spine", restQuats, times, [
      [-0.04, 0, 0],
      [-0.02, 0, 0],
      [-0.04, 0, 0],
    ]),
    createRelativeQuatTrack("Head", restQuats, times, [
      [-0.06, 0, 0],
      [-0.03, 0, 0],
      [-0.06, 0, 0],
    ]),
    // Left Arm Chain
    createRelativeQuatTrack("LeftArm", restQuats, times, [
      [0.35, 0.0, 0.65],
      [0.38, 0.0, 0.70],
      [0.35, 0.0, 0.65],
    ]),
    createRelativeQuatTrack("LeftForeArm", restQuats, times, [
      [0.0, 0.0, 0.35],
      [0.0, 0.0, 0.40],
      [0.0, 0.0, 0.35],
    ]),
    // Right Arm Chain
    createRelativeQuatTrack("RightArm", restQuats, times, [
      [0.35, 0.0, -0.65],
      [0.38, 0.0, -0.70],
      [0.35, 0.0, -0.65],
    ]),
    createRelativeQuatTrack("RightForeArm", restQuats, times, [
      [0.0, 0.0, -0.35],
      [0.0, 0.0, -0.40],
      [0.0, 0.0, -0.35],
    ]),
    // Open palm fingers
    ...createFingerTracks("Left", restQuats, times, {
      thumb: openPalmFingers,
      index: openPalmFingers,
      middle: openPalmFingers,
      ring: openPalmFingers,
      pinky: openPalmFingers,
    }),
    ...createFingerTracks("Right", restQuats, times, {
      thumb: openPalmFingers,
      index: openPalmFingers,
      middle: openPalmFingers,
      ring: openPalmFingers,
      pinky: openPalmFingers,
    }),
  ];

  return new THREE.AnimationClip("SKILLS_PRESENT", duration, tracks);
}

/**
 * 5. PROJECTS_INSPECT Animation (Projects Section):
 * Presenter-style gesture observing selected work
 */
export function createProjectsInspectClip(
  restQuats: Record<string, THREE.Quaternion>,
  _restPositions: Record<string, THREE.Vector3>
): THREE.AnimationClip {
  const duration = 3.2;
  const times = [0, 1.6, 3.2];

  const inspectFingers: [number, number, number][] = [
    [0.22, 0.06, 0],
    [0.18, 0.04, 0],
    [0.22, 0.06, 0],
  ];

  const tracks: THREE.KeyframeTrack[] = [
    createRelativeQuatTrack("Spine", restQuats, times, [
      [0.05, -0.16, 0],
      [0.07, -0.20, 0],
      [0.05, -0.16, 0],
    ]),
    createRelativeQuatTrack("Head", restQuats, times, [
      [0.12, -0.26, 0],
      [0.15, -0.30, 0],
      [0.12, -0.26, 0],
    ]),
    createRelativeQuatTrack("LeftArm", restQuats, times, [
      [0.82, 0, 0],
      [0.80, 0, 0],
      [0.82, 0, 0],
    ]),
    createRelativeQuatTrack("LeftForeArm", restQuats, times, [
      [0, 0, 0.22],
      [0, 0, 0.22],
      [0, 0, 0.22],
    ]),
    createRelativeQuatTrack("RightArm", restQuats, times, [
      [0.25, 0.0, -0.55],
      [0.28, 0.0, -0.60],
      [0.25, 0.0, -0.55],
    ]),
    createRelativeQuatTrack("RightForeArm", restQuats, times, [
      [0, 0, -0.50],
      [0, 0, -0.55],
      [0, 0, -0.50],
    ]),
    ...createFingerTracks("Right", restQuats, times, {
      thumb: inspectFingers,
      index: inspectFingers,
      middle: inspectFingers,
      ring: inspectFingers,
      pinky: inspectFingers,
    }),
    ...createFingerTracks("Left", restQuats, times, {
      thumb: inspectFingers,
      index: inspectFingers,
      middle: inspectFingers,
      ring: inspectFingers,
      pinky: inspectFingers,
    }),
  ];

  return new THREE.AnimationClip("PROJECTS_INSPECT", duration, tracks);
}

/**
 * 6. WAVE Animation (Contact Section):
 * User Request:
 * "Genuine goodbye wave:
 * Idle -> turn toward camera -> shoulder raises -> forearm raises ->
 * wrist rotates -> fingers open -> 2-3 small wave cycles -> hand lowers -> final idle"
 */
export function createWaveClip(
  restQuats: Record<string, THREE.Quaternion>,
  _restPositions: Record<string, THREE.Vector3>
): THREE.AnimationClip {
  const duration = 3.8;
  const times = [0.0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2, 3.8];

  const openWavingFingers: [number, number, number][] = [
    [0.18, 0, 0],
    [0.10, 0, 0],
    [0.0, 0, 0],  // Wide open fingers
    [0.0, 0, 0],  // Wave
    [0.0, 0, 0],  // Wave
    [0.0, 0, 0],  // Wave
    [0.0, 0, 0],  // Wave
    [0.0, 0, 0],  // Wave
    [0.05, 0, 0], // Center
    [0.18, 0, 0], // Lower to idle
  ];

  const tracks: THREE.KeyframeTrack[] = [
    // Eye contact with visitor
    createRelativeQuatTrack("Head", restQuats, times, [
      [0.0, 0, 0],
      [-0.04, 0, 0],
      [-0.05, 0, 0],
      [-0.04, 0.02, 0],
      [-0.04, -0.02, 0],
      [-0.04, 0.02, 0],
      [-0.04, -0.02, 0],
      [-0.04, 0.02, 0],
      [-0.03, 0, 0],
      [0.0, 0, 0],
    ]),
    // Right Shoulder raises
    createRelativeQuatTrack("RightShoulder", restQuats, times, [
      [0.0, 0, 0],
      [0.10, 0.04, 0.12],
      [0.16, 0.06, 0.18],
      [0.16, 0.06, 0.18],
      [0.16, 0.06, 0.18],
      [0.16, 0.06, 0.18],
      [0.16, 0.06, 0.18],
      [0.16, 0.06, 0.18],
      [0.10, 0.03, 0.10],
      [0.0, 0, 0],
    ]),
    // Right Arm raises up high
    createRelativeQuatTrack("RightArm", restQuats, times, [
      [0.82, 0, 0],
      [0.0, 0, -0.5],
      [-1.15, 0, 0],
      [-1.15, 0, 0],
      [-1.15, 0, 0],
      [-1.15, 0, 0],
      [-1.15, 0, 0],
      [-1.15, 0, 0],
      [0.0, 0, -0.5],
      [0.82, 0, 0],
    ]),
    // Right ForeArm vertical
    createRelativeQuatTrack("RightForeArm", restQuats, times, [
      [0, 0, -0.22],
      [0, 0, -0.65],
      [0, 0, -1.05],
      [0, 0, -1.05],
      [0, 0, -1.05],
      [0, 0, -1.05],
      [0, 0, -1.05],
      [0, 0, -1.05],
      [0, 0, -0.65],
      [0, 0, -0.22],
    ]),
    // Right Hand 3-cycle wave oscillation:
    createRelativeQuatTrack("RightHand", restQuats, times, [
      [0.05, 0, 0],
      [0.0, 0, 0],
      [0.0, 0, -0.42], // Wave cycle 1: Right
      [0.0, 0, 0.42],  // Wave cycle 1: Left
      [0.0, 0, -0.42], // Wave cycle 2: Right
      [0.0, 0, 0.42],  // Wave cycle 2: Left
      [0.0, 0, -0.42], // Wave cycle 3: Right
      [0.0, 0, 0.42],  // Wave cycle 3: Left
      [0.0, 0, 0.0],   // Center
      [0.05, 0, 0],    // Lower to idle
    ]),
    // Left Arm relaxed at side
    createRelativeQuatTrack("LeftArm", restQuats, times, [
      [0.82, 0, 0],
      [0.82, 0, 0],
      [0.82, 0, 0],
      [0.82, 0, 0],
      [0.82, 0, 0],
      [0.82, 0, 0],
      [0.82, 0, 0],
      [0.82, 0, 0],
      [0.82, 0, 0],
      [0.82, 0, 0],
    ]),
    createRelativeQuatTrack("LeftForeArm", restQuats, times, [
      [0, 0, 0.22],
      [0, 0, 0.22],
      [0, 0, 0.22],
      [0, 0, 0.22],
      [0, 0, 0.22],
      [0, 0, 0.22],
      [0, 0, 0.22],
      [0, 0, 0.22],
      [0, 0, 0.22],
      [0, 0, 0.22],
    ]),
    // Fingers open during waving
    ...createFingerTracks("Right", restQuats, times, {
      thumb: openWavingFingers,
      index: openWavingFingers,
      middle: openWavingFingers,
      ring: openWavingFingers,
      pinky: openWavingFingers,
    }),
  ];

  return new THREE.AnimationClip("WAVE", duration, tracks);
}

/**
 * 7. FINAL_POSE Animation:
 * Confident developer posture: upright spine, hands settled, calm breathing
 */
export function createFinalPoseClip(
  restQuats: Record<string, THREE.Quaternion>,
  _restPositions: Record<string, THREE.Vector3>
): THREE.AnimationClip {
  const duration = 3.6;
  const times = [0, 1.8, 3.6];

  const tracks: THREE.KeyframeTrack[] = [
    createRelativeQuatTrack("Spine", restQuats, times, [
      [-0.03, 0, 0],
      [-0.01, 0, 0],
      [-0.03, 0, 0],
    ]),
    createRelativeQuatTrack("Head", restQuats, times, [
      [-0.05, 0, 0],
      [-0.02, 0, 0],
      [-0.05, 0, 0],
    ]),
    createRelativeQuatTrack("LeftArm", restQuats, times, [
      [0.80, 0, 0],
      [0.78, 0, 0],
      [0.80, 0, 0],
    ]),
    createRelativeQuatTrack("LeftForeArm", restQuats, times, [
      [0, 0, 0.20],
      [0, 0, 0.22],
      [0, 0, 0.20],
    ]),
    createRelativeQuatTrack("RightArm", restQuats, times, [
      [0.80, 0, 0],
      [0.78, 0, 0],
      [0.80, 0, 0],
    ]),
    createRelativeQuatTrack("RightForeArm", restQuats, times, [
      [0, 0, -0.20],
      [0, 0, -0.22],
      [0, 0, -0.20],
    ]),
  ];

  return new THREE.AnimationClip("FINAL_POSE", duration, tracks);
}

/**
 * Returns all built-in skeletal animation clips computed relative to the scene's actual rest bind pose
 */
export function getStandardCharacterClips(scene: THREE.Object3D): Record<string, THREE.AnimationClip> {
  const { restQuats, restPositions } = extractRestTransforms(scene);

  return {
    IDLE: createIdleClip(restQuats, restPositions),
    ABOUT_POINT: createAboutPointClip(restQuats, restPositions),
    TECH_GESTURE: createTechGestureClip(restQuats, restPositions),
    SKILLS_PRESENT: createSkillsPresentClip(restQuats, restPositions),
    PROJECTS_INSPECT: createProjectsInspectClip(restQuats, restPositions),
    WAVE: createWaveClip(restQuats, restPositions),
    FINAL_POSE: createFinalPoseClip(restQuats, restPositions),
  };
}
