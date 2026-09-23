import * as THREE from "three";

export interface LookAtConfig {
  maxYaw?: number;       // Max horizontal turn (radians)
  maxPitch?: number;     // Max vertical tilt (radians)
  smoothness?: number;   // Lerp damping factor
  spineWeight?: number;  // Contribution of spine (0 to 1)
  neckWeight?: number;   // Contribution of neck (0 to 1)
  headWeight?: number;   // Contribution of head (0 to 1)
}

/**
 * CharacterLookAt:
 * Anatomical Look-At controller that distributes gaze across
 * Spine (20%), Neck (35%), and Head (45%) with soft damping and angle clamping.
 */
export class CharacterLookAt {
  private headBone: THREE.Bone | null = null;
  private neckBone: THREE.Bone | null = null;
  private spineBone: THREE.Bone | null = null;

  private target = new THREE.Vector3(0, 1.4, 3);
  private currentYaw = 0;
  private currentPitch = 0;
  private targetYaw = 0;
  private targetPitch = 0;

  private maxYaw: number;
  private maxPitch: number;
  private smoothness: number;
  private spineWeight: number;
  private neckWeight: number;
  private headWeight: number;

  constructor(scene: THREE.Object3D, config: LookAtConfig = {}) {
    this.headBone = (scene.getObjectByName("Head") as THREE.Bone) || null;
    this.neckBone = (scene.getObjectByName("Neck") as THREE.Bone) || null;
    this.spineBone = (scene.getObjectByName("Spine2") as THREE.Bone) ||
                     (scene.getObjectByName("Spine1") as THREE.Bone) || null;

    this.maxYaw = config.maxYaw ?? 0.65;         // ~37 degrees max yaw
    this.maxPitch = config.maxPitch ?? 0.35;     // ~20 degrees max pitch
    this.smoothness = config.smoothness ?? 4.5;
    this.spineWeight = config.spineWeight ?? 0.20;
    this.neckWeight = config.neckWeight ?? 0.35;
    this.headWeight = config.headWeight ?? 0.45;
  }

  /**
   * Set dynamic 3D world target to gaze toward
   */
  public setTarget(targetPosition: THREE.Vector3): void {
    this.target.copy(targetPosition);

    if (!this.headBone) return;

    const headWorldPos = new THREE.Vector3();
    this.headBone.getWorldPosition(headWorldPos);

    const dir = this.target.clone().sub(headWorldPos).normalize();

    // Compute desired yaw (horizontal) and pitch (vertical)
    const rawYaw = Math.atan2(-dir.x, dir.z);
    const rawPitch = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1));

    // Clamp within anatomical human limits
    this.targetYaw = THREE.MathUtils.clamp(rawYaw, -this.maxYaw, this.maxYaw);
    this.targetPitch = THREE.MathUtils.clamp(rawPitch, -this.maxPitch, this.maxPitch);
  }

  /**
   * Set target from normalized pointer (-1 to +1)
   */
  public setPointer(pointerX: number, pointerY: number): void {
    this.targetYaw = THREE.MathUtils.clamp(pointerX * 0.55, -this.maxYaw, this.maxYaw);
    this.targetPitch = THREE.MathUtils.clamp(-pointerY * 0.32, -this.maxPitch, this.maxPitch);
  }

  /**
   * Reset look target to neutral forward
   */
  public reset(): void {
    this.targetYaw = 0;
    this.targetPitch = 0;
  }

  /**
   * Update bone rotations on every frame
   */
  public update(delta: number): void {
    const dt = Math.min(delta, 0.08);
    const step = dt * this.smoothness;

    // Smoothly interpolate current yaw and pitch
    this.currentYaw = THREE.MathUtils.lerp(this.currentYaw, this.targetYaw, step);
    this.currentPitch = THREE.MathUtils.lerp(this.currentPitch, this.targetPitch, step);

    // Distribute among Spine, Neck, Head
    if (this.spineBone) {
      this.spineBone.rotation.y += this.currentYaw * this.spineWeight * dt;
    }
    if (this.neckBone) {
      this.neckBone.rotation.y += this.currentYaw * this.neckWeight * dt;
      this.neckBone.rotation.x += this.currentPitch * this.neckWeight * dt;
    }
    if (this.headBone) {
      this.headBone.rotation.y += this.currentYaw * this.headWeight * dt;
      this.headBone.rotation.x += this.currentPitch * this.headWeight * dt;
    }
  }
}
