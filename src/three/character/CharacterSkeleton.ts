import * as THREE from "three";

/**
 * Reconstructs the true Mixamo parent-child forward kinematics hierarchy
 * from the flat unparented list in Char.glb.
 * Uses parent.attach(child) so world matrices and SkinnedMesh vertex bindings
 * are 100% preserved while restoring full multi-bone kinematic chains.
 */
export function reconstructMixamoHierarchy(scene: THREE.Object3D): void {
  if ((scene as any).__mixamoHierarchyReconstructed) return;
  (scene as any).__mixamoHierarchyReconstructed = true;

  const bones: Record<string, THREE.Bone> = {};

  // First pass: sanitize all bone names (strip mixamorig: or mixamorig prefix)
  scene.traverse((child) => {
    if ((child as THREE.Bone).isBone) {
      child.name = child.name.replace(/^mixamorig:?/, "");
      bones[child.name] = child as THREE.Bone;
    }
  });

  // Ordered topological parent-child pairs from root (Hips) outward to extremities
  const hierarchyPairs: [string, string][] = [
    // Spine column
    ["Spine", "Hips"],
    ["Spine1", "Spine"],
    ["Spine2", "Spine1"],
    ["Neck", "Spine2"],
    ["Head", "Neck"],
    ["HeadTop_End", "Head"],

    // Shoulders
    ["LeftShoulder", "Spine2"],
    ["RightShoulder", "Spine2"],

    // Left Arm Chain
    ["LeftArm", "LeftShoulder"],
    ["LeftForeArm", "LeftArm"],
    ["LeftHand", "LeftForeArm"],

    // Right Arm Chain
    ["RightArm", "RightShoulder"],
    ["RightForeArm", "RightArm"],
    ["RightHand", "RightForeArm"],

    // Left Leg Chain
    ["LeftUpLeg", "Hips"],
    ["LeftLeg", "LeftUpLeg"],
    ["LeftFoot", "LeftLeg"],
    ["LeftToeBase", "LeftFoot"],
    ["LeftToe_End", "LeftToeBase"],

    // Right Leg Chain
    ["RightUpLeg", "Hips"],
    ["RightLeg", "RightUpLeg"],
    ["RightFoot", "RightLeg"],
    ["RightToeBase", "RightFoot"],
    ["RightToe_End", "RightToeBase"],
  ];

  // Coordinated 15-joint Finger chains for both hands
  ["Left", "Right"].forEach((side) => {
    ["Thumb", "Index", "Middle", "Ring", "Pinky"].forEach((finger) => {
      hierarchyPairs.push([`${side}Hand${finger}1`, `${side}Hand`]);
      hierarchyPairs.push([`${side}Hand${finger}2`, `${side}Hand${finger}1`]);
      hierarchyPairs.push([`${side}Hand${finger}3`, `${side}Hand${finger}2`]);
      hierarchyPairs.push([`${side}Hand${finger}4`, `${side}Hand${finger}3`]);
    });
  });

  // Update world matrices before attaching so current world transforms are accurate
  scene.updateMatrixWorld(true);

  // Attach children to parents in topological order
  hierarchyPairs.forEach(([childName, parentName]) => {
    const child = bones[childName];
    const parent = bones[parentName];
    if (child && parent && child.parent !== parent) {
      parent.attach(child);
    }
  });

  // Finalize world matrices
  scene.updateMatrixWorld(true);
}
