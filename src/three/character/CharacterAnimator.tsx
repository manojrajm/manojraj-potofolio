import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getStandardCharacterClips } from "./CharacterAnimations";

export interface CharacterAnimatorHandle {
  idle: () => void;
  walk: () => void;
  point: (side?: "left" | "right") => void;
  gesture: (type: "about" | "tech" | "skills" | "projects") => void;
  wave: () => void;
  finalPose: () => void;
  transitionTo: (clipName: string, duration?: number) => void;
  crossFade: (fromAction: string, toAction: string, duration?: number) => void;
  getCurrentAnimation: () => string;
}

export interface CharacterAnimatorProps {
  rootObject: THREE.Object3D;
  activeAnimation?: string;
  playbackSpeed?: number;
  externalClips?: THREE.AnimationClip[];
  onAnimationChanged?: (animName: string) => void;
}

/**
 * CharacterAnimator:
 * Core skeletal animation controller managing THREE.AnimationMixer,
 * smooth crossfades between 65-bone skeletal clips, and imperative action API.
 */
export const CharacterAnimator = forwardRef<CharacterAnimatorHandle, CharacterAnimatorProps>(
  function CharacterAnimator(
    {
      rootObject,
      activeAnimation = "IDLE",
      playbackSpeed = 1.0,
      externalClips = [],
      onAnimationChanged,
    },
    ref
  ) {
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);
    const actionsRef = useRef<Record<string, THREE.AnimationAction>>({});
    const currentActionRef = useRef<THREE.AnimationAction | null>(null);
    const currentAnimNameRef = useRef<string>("IDLE");

    // Initialize AnimationMixer and register all kinematic clips
    useEffect(() => {
      if (!rootObject) return;

      const mixer = new THREE.AnimationMixer(rootObject);
      mixerRef.current = mixer;

      const actions: Record<string, THREE.AnimationAction> = {};

      // 1. Register internal standard clips (65 Mixamo bone chains computed against actual bind pose)
      const standardClips = getStandardCharacterClips(rootObject);
      Object.entries(standardClips).forEach(([name, clip]) => {
        const action = mixer.clipAction(clip);
        action.clampWhenFinished = false;
        action.loop = THREE.LoopRepeat;
        actions[name] = action;
      });

      // 2. Register any external clips provided (e.g. from public/models/character/animations)
      externalClips.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.clampWhenFinished = false;
        action.loop = THREE.LoopRepeat;
        actions[clip.name] = action;
      });

      actionsRef.current = actions;

      // Start with the initial animation
      const initialAction = actions[activeAnimation] || actions["IDLE"];
      if (initialAction) {
        initialAction.reset().play();
        currentActionRef.current = initialAction;
        currentAnimNameRef.current = activeAnimation;
        onAnimationChanged?.(activeAnimation);
      }

      return () => {
        mixer.stopAllAction();
        mixer.uncacheRoot(rootObject);
      };
    }, [rootObject, externalClips]);

    // Core crossFade execution helper
    const executeCrossFade = (targetName: string, duration = 0.5) => {
      const actions = actionsRef.current;
      if (!actions) return;

      const nextAction = actions[targetName];
      const prevAction = currentActionRef.current;

      if (!nextAction || currentAnimNameRef.current === targetName) {
        return;
      }

      nextAction.reset();
      nextAction.setEffectiveTimeScale(playbackSpeed);
      nextAction.setEffectiveWeight(1.0);

      if (prevAction && prevAction !== nextAction) {
        prevAction.crossFadeTo(nextAction, duration, true);
      }

      nextAction.play();
      currentActionRef.current = nextAction;
      currentAnimNameRef.current = targetName;
      onAnimationChanged?.(targetName);
    };

    // Declarative prop watcher
    useEffect(() => {
      if (activeAnimation && activeAnimation !== currentAnimNameRef.current) {
        executeCrossFade(activeAnimation, 0.55);
      }
    }, [activeAnimation]);

    // Playback speed watcher
    useEffect(() => {
      if (currentActionRef.current) {
        currentActionRef.current.setEffectiveTimeScale(playbackSpeed);
      }
    }, [playbackSpeed]);

    // Expose required CharacterAnimator abstraction API
    useImperativeHandle(ref, () => ({
      idle: () => executeCrossFade("IDLE", 0.5),
      walk: () => executeCrossFade("WALK", 0.4),
      point: (side = "right") => executeCrossFade(side === "right" ? "ABOUT_POINT" : "ABOUT_POINT", 0.55),
      gesture: (type: "about" | "tech" | "skills" | "projects") => {
        switch (type) {
          case "about":
            executeCrossFade("ABOUT_POINT", 0.55);
            break;
          case "tech":
            executeCrossFade("TECH_GESTURE", 0.5);
            break;
          case "skills":
            executeCrossFade("SKILLS_PRESENT", 0.5);
            break;
          case "projects":
            executeCrossFade("PROJECTS_INSPECT", 0.5);
            break;
          default:
            executeCrossFade("IDLE", 0.5);
        }
      },
      wave: () => executeCrossFade("WAVE", 0.55),
      finalPose: () => executeCrossFade("FINAL_POSE", 0.6),
      transitionTo: (clipName: string, duration = 0.5) => executeCrossFade(clipName, duration),
      crossFade: (_from: string, to: string, duration = 0.5) => executeCrossFade(to, duration),
      getCurrentAnimation: () => currentAnimNameRef.current,
    }));

    // Update mixer on every render frame
    useFrame((_, delta) => {
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }
    });

    return null;
  }
);
