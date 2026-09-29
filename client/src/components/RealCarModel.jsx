import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function RealCarModel({ url, bodyColor, isAccelerating, isBraking, rotateWheels, steeringAngle }) {
  const groupRef = useRef();
  
  // A beautiful, highly-optimized free Porsche 911 model hosted by PMNDRS
  const defaultUrl = 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/porsche-1975/model.gltf';
  const targetUrl = url || defaultUrl;
  
  const { scene } = useGLTF(targetUrl);

  // Apply custom paint colors and shadows when the model loads
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          if (child.material) {
            // Enhance environment reflections on all materials
            child.material.envMapIntensity = 2.0;
            
            // Try to find the main car body paint material to apply the user's color
            const matName = child.material.name.toLowerCase();
            if (matName.includes('paint') || matName.includes('body') || matName.includes('exterior') || matName.includes('car')) {
              // We clone the material so we don't accidentally modify other shared instances
              child.material = child.material.clone();
              child.material.color = new THREE.Color(bodyColor);
              child.material.metalness = 0.8;
              child.material.roughness = 0.15;
              if (child.material.clearcoat !== undefined) {
                 child.material.clearcoat = 1.0;
              }
            }
          }
        }
      });
    }
  }, [scene, bodyColor]);

  // Apply basic physics (pitch/acceleration tilt) to the real model
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Smooth pitch (acceleration/braking)
    let targetPitch = 0;
    if (isAccelerating) targetPitch = 0.05; // nose up
    if (isBraking) targetPitch = -0.06; // nose down
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetPitch, 0.1);
    
    // Idle vibration
    const vibration = (!isAccelerating && !rotateWheels) ? Math.sin(state.clock.getElapsedTime() * 40) * 0.0005 : 0;
    groupRef.current.position.y = -0.4 + vibration; // Offset height based on the specific model's origin
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the demo model
useGLTF.preload('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/porsche-1975/model.gltf');
