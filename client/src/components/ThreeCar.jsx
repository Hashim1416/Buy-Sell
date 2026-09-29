import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SpotLight, RoundedBox, MeshReflectorMaterial, Environment } from '@react-three/drei';

// Simple string hash function for procedural generation
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
  }
  return Math.abs(hash);
};

// A simple spring dampener function for bouncier animations
const springLerp = (current, target, velocity, stiffness = 0.1, damping = 0.8) => {
  const force = (target - current) * stiffness;
  const newVelocity = (velocity + force) * damping;
  return { val: current + newVelocity, vel: newVelocity };
};

export default function ThreeCar({ 
  bodyColor = "#D4AF37", 
  openLeftDoor = false, 
  openRightDoor = false, 
  openHood = false, 
  openTrunk = false, 
  rotateWheels = false,
  steeringAngle = 0,
  isAccelerating = false,
  isBraking = false,
  headlightsOn = false,
  carCategory = 'Sports Cars',
  carBrand = 'Unknown'
}) {
  const carRef = useRef();
  const chassisRef = useRef();
  
  // Rotational parts refs
  const leftDoorRef = useRef();
  const rightDoorRef = useRef();
  const hoodRef = useRef();
  const trunkRef = useRef();
  
  // Wheel refs
  const flWheelRef = useRef();
  const frWheelRef = useRef();
  const rlWheelRef = useRef();
  const rrWheelRef = useRef();

  // Physics states for springs
  const [physics] = useState({
    pitch: 0, pitchVel: 0,
    roll: 0, rollVel: 0,
    ld: 0, ldVel: 0,
    rd: 0, rdVel: 0,
    hood: 0, hoodVel: 0,
    trunk: 0, trunkVel: 0
  });

  // --- PROCEDURAL GENERATION ---
  const config = useMemo(() => {
    const hash = hashString(carBrand);
    
    // Normalized variations
    const vLength = (hash % 20) / 20;     
    const vWidth = ((hash >> 1) % 15) / 15; 
    const vHeight = ((hash >> 2) % 10) / 10; 

    // Animation Styles
    let doorStyle = hash % 4; 
    
    // Geometry overrides based on category base to create DISTINCT SHAPES
    let baseL = 4.2;
    let baseW = 1.8;
    let baseH = 0.3; // Lower chassis height
    let rideHeight = -0.15;
    let cabinBaseH = 0.55;
    let wheelR = 0.42;
    let roofSlope = 0; // 0 = flat, 1 = fastback/supercar
    let cabinOffset = -0.2; // How far back the cabin sits
    let cabinLengthScale = 0.5;

    if (carCategory === 'Off-Road Cars' || carCategory === 'SUVs') {
      baseL = 4.5; baseW = 1.95; baseH = 0.5;
      rideHeight = 0.15; cabinBaseH = 0.75; wheelR = 0.55;
      doorStyle = (hash % 2) === 0 ? 0 : 2; 
      roofSlope = 0; // Boxy SUV rear
      cabinOffset = -0.3;
      cabinLengthScale = 0.65; // Long cabin
    } else if (carCategory === 'Supercars' || carCategory === 'Hypercars') {
      baseL = 4.3; baseW = 2.05; baseH = 0.20;
      rideHeight = -0.25; cabinBaseH = 0.35; wheelR = 0.46;
      doorStyle = (hash % 3) === 0 ? 3 : 1; // Butterfly or Gullwing
      roofSlope = 1.2; // Aggressive sloped profile
      cabinOffset = 0.1; // Cabin more forward (mid-engine)
      cabinLengthScale = 0.45;
    } else if (carCategory === 'EV Cars') {
      baseL = 4.3; baseW = 1.85; baseH = 0.35;
      rideHeight = -0.18; cabinBaseH = 0.55; wheelR = 0.45;
      roofSlope = 0.5; // Aerodynamic
      cabinOffset = 0;
      cabinLengthScale = 0.6;
    } else {
      // Sedans, Vintage, etc.
      roofSlope = 0.3;
      cabinOffset = -0.15;
      cabinLengthScale = 0.5;
    }

    // Apply variations
    const finalL = baseL + (vLength * 0.4 - 0.2); 
    const finalW = baseW + (vWidth * 0.2 - 0.1);  
    const finalH = baseH + (vHeight * 0.1 - 0.05); 
    const cHeight = cabinBaseH + (vHeight * 0.15 - 0.075);
    
    const hasSpoiler = (hash % 3) !== 0 || carCategory === 'Supercars'; 
    const spoilerWidth = finalW - 0.2 - (vWidth * 0.2);
    const spoilerType = hash % 3; // 0: None, 1: Lip spoiler, 2: Massive wing
    
    const wheelSpokes = 5 + (hash % 5); 
    const tailColors = ["#ff0000", "#ff1100", "#ff0022"];
    const tColor = tailColors[hash % 3];

    // Grill Style based on brand hash
    const grillStyle = hash % 4; // 0: Standard, 1: Split (BMW style), 2: Massive (Lexus style), 3: Minimalist

    return {
      chassisArgs: [finalW, finalH, finalL],
      cabinArgs: [finalW - 0.3, cHeight, finalL * cabinLengthScale],
      cabinPos: [0, finalH/2 + cHeight/2 - 0.05, cabinOffset],
      doorArgs: [0.06, cHeight * 0.85, finalL * 0.32], // Thicker, nicer doors
      frontZ: -finalL / 2,
      rearZ: finalL / 2,
      wheelRadius: (wheelR + (vHeight * 0.05)) * 0.8, // Make tires smaller as requested
      wheelThickness: (0.3 + (vWidth * 0.1)) * 0.8,
      suspension: rideHeight,
      doorStyle,
      hasSpoiler,
      spoilerWidth,
      spoilerType,
      wheelSpokes,
      rimStyle: hash % 5, // 0: 5-Spoke, 1: Mesh, 2: Aero, 3: Split, 4: Deep
      rimColor: (hash % 4 === 0) ? "#111111" : (hash % 3 === 0) ? "#888888" : "#d4af37", // Black, Silver, or Gold rims
      tailColor: tColor,
      headlightColor: (carCategory === 'EV Cars' || carCategory === 'Supercars') ? "#d0f0ff" : "#ffffff",
      isEV: carCategory === 'EV Cars',
      roofSlope,
      grillStyle
    };
  }, [carBrand, carCategory]);


  useFrame((state, delta) => {
    // 1. Suspension Dynamics (Pitch and Roll)
    let targetPitch = 0;
    if (isAccelerating) targetPitch = 0.06; // Nose up
    if (isBraking) targetPitch = -0.08; // Nose down
    
    let targetRoll = -steeringAngle * 0.2; // Lean into corners slightly

    // Apply spring physics to pitch and roll
    const p = springLerp(physics.pitch, targetPitch, physics.pitchVel, 0.1, 0.85);
    physics.pitch = p.val; physics.pitchVel = p.vel;
    
    const r = springLerp(physics.roll, targetRoll, physics.rollVel, 0.15, 0.8);
    physics.roll = r.val; physics.rollVel = r.vel;

    if (chassisRef.current) {
      chassisRef.current.rotation.x = physics.pitch;
      chassisRef.current.rotation.z = physics.roll;
      // Idle engine vibration if not EV and not moving
      const vibration = (!config.isEV && !rotateWheels && !isAccelerating) ? Math.sin(state.clock.getElapsedTime() * 40) * 0.0003 : 0;
      chassisRef.current.position.y = config.suspension + vibration;
    }

    // 2. Wheel Rotation & Steering
    if (rotateWheels || isAccelerating) {
      const speed = isAccelerating ? 30 : 12;
      const t = state.clock.getElapsedTime() * speed;
      if (flWheelRef.current) flWheelRef.current.rotation.x = t;
      if (frWheelRef.current) frWheelRef.current.rotation.x = t;
      if (rlWheelRef.current) rlWheelRef.current.rotation.x = t;
      if (rrWheelRef.current) rrWheelRef.current.rotation.x = t;
    }

    if (flWheelRef.current) {
      flWheelRef.current.rotation.y = THREE.MathUtils.lerp(flWheelRef.current.rotation.y, steeringAngle, 0.1);
    }
    if (frWheelRef.current) {
      frWheelRef.current.rotation.y = THREE.MathUtils.lerp(frWheelRef.current.rotation.y, steeringAngle, 0.1);
    }

    // 3. Spring Physics for Doors
    const tLd = openLeftDoor ? 1 : 0;
    const ldSpring = springLerp(physics.ld, tLd, physics.ldVel, 0.05, 0.8);
    physics.ld = ldSpring.val; physics.ldVel = ldSpring.vel;

    const tRd = openRightDoor ? 1 : 0;
    const rdSpring = springLerp(physics.rd, tRd, physics.rdVel, 0.05, 0.8);
    physics.rd = rdSpring.val; physics.rdVel = rdSpring.vel;

    if (leftDoorRef.current) {
      if (config.doorStyle === 1) { // Butterfly
         leftDoorRef.current.rotation.z = physics.ld * -1.0;
         leftDoorRef.current.rotation.y = physics.ld * -0.4;
         leftDoorRef.current.rotation.x = physics.ld * -0.2;
      } else if (config.doorStyle === 2) { // Suicide
         leftDoorRef.current.rotation.y = physics.ld * 1.2;
      } else if (config.doorStyle === 3) { // Gullwing
         leftDoorRef.current.rotation.z = physics.ld * -1.4;
      } else { // Standard
         leftDoorRef.current.rotation.y = physics.ld * -1.2;
      }
    }
    
    if (rightDoorRef.current) {
      if (config.doorStyle === 1) { // Butterfly
         rightDoorRef.current.rotation.z = physics.rd * 1.0;
         rightDoorRef.current.rotation.y = physics.rd * 0.4;
         rightDoorRef.current.rotation.x = physics.rd * -0.2;
      } else if (config.doorStyle === 2) { // Suicide
         rightDoorRef.current.rotation.y = physics.rd * -1.2;
      } else if (config.doorStyle === 3) { // Gullwing
         rightDoorRef.current.rotation.z = physics.rd * 1.4;
      } else { // Standard
         rightDoorRef.current.rotation.y = physics.rd * 1.2;
      }
    }
    
    // Hood open/close
    const tHood = openHood ? 1 : 0;
    const hoodS = springLerp(physics.hood, tHood, physics.hoodVel, 0.04, 0.8);
    physics.hood = hoodS.val; physics.hoodVel = hoodS.vel;
    if (hoodRef.current) {
      // Positive X rotation lifts the negative Z (front) edge UP
      hoodRef.current.rotation.x = physics.hood * 0.8; 
    }
    
    // Trunk open/close
    const tTrunk = openTrunk ? 1 : 0;
    const trunkS = springLerp(physics.trunk, tTrunk, physics.trunkVel, 0.04, 0.8);
    physics.trunk = trunkS.val; physics.trunkVel = trunkS.vel;
    if (trunkRef.current) {
      // Negative X rotation lifts the positive Z (rear) edge UP
      trunkRef.current.rotation.x = physics.trunk * -0.8;
    }
  });

  // Reusable photorealistic materials
  const paintMaterial = (
    <meshPhysicalMaterial 
      color={bodyColor} 
      metalness={0.7} 
      roughness={0.15} 
      clearcoat={1.0} 
      clearcoatRoughness={0.03}
      envMapIntensity={2.5}
    />
  );

  const glassMaterial = (
    <meshPhysicalMaterial 
      color="#0a0a0a" 
      transmission={1.0} // True glass refraction
      ior={1.5}          // Index of refraction for glass
      thickness={0.5} 
      roughness={0.0} 
      envMapIntensity={2.0}
    />
  );

  const trimMaterial = (
    <meshStandardMaterial color="#111" metalness={0.8} roughness={0.5} />
  );

  // Math for 3-part clean chassis
  const chassisW = config.chassisArgs[0];
  const chassisH = config.chassisArgs[1];
  const chassisL = config.chassisArgs[2];

  const frontL = chassisL * 0.3;
  const centerL = chassisL * 0.45;
  const rearL = chassisL * 0.25;

  const frontZCenter = config.frontZ + frontL / 2;
  const centerZCenter = frontZCenter + frontL / 2 + centerL / 2;
  const rearZCenter = config.rearZ - rearL / 2;

  const bayH = chassisH * 0.7; // Engine/Trunk floor height
  const lidH = chassisH * 0.3; // Hood/Trunk thickness

  return (
    <group ref={carRef} dispose={null}>


      <group ref={chassisRef} position={[0, config.suspension, 0]}>
        
        {/* Center Chassis Base */}
        <RoundedBox args={[chassisW, chassisH, centerL]} position={[0, 0, centerZCenter]} radius={Math.min(0.12, chassisH/2 - 0.01)} smoothness={4} castShadow receiveShadow>
          {paintMaterial}
        </RoundedBox>
        
        {/* Front Chassis (Engine Bay) */}
        <RoundedBox args={[chassisW, bayH, frontL]} position={[0, -chassisH/2 + bayH/2, frontZCenter]} radius={Math.min(0.12, bayH/2 - 0.01)} smoothness={4} castShadow receiveShadow>
          {paintMaterial}
        </RoundedBox>

        {/* Rear Chassis (Trunk Floor) */}
        <RoundedBox args={[chassisW, bayH, rearL]} position={[0, -chassisH/2 + bayH/2, rearZCenter]} radius={Math.min(0.12, bayH/2 - 0.01)} smoothness={4} castShadow receiveShadow>
          {paintMaterial}
        </RoundedBox>

        {/* Cockpit / Glass Cabin */}
        <group position={config.cabinPos}>
          
          {/* Main Glass block (Windshield/Windows) */}
          {/* We use a sloped shape by rotating a box or using a custom profile based on category */}
          <group rotation={[config.roofSlope * 0.1, 0, 0]}>
            <RoundedBox args={config.cabinArgs} radius={0.08} smoothness={4} castShadow receiveShadow>
              {glassMaterial}
            </RoundedBox>

            {/* Roof Panel (Painted) */}
            <mesh position={[0, config.cabinArgs[1]/2 + 0.01, 0]}>
              <boxGeometry args={[config.cabinArgs[0]-0.05, 0.02, config.cabinArgs[2]-0.15]} />
              {paintMaterial}
            </mesh>
            
            {/* A, B, C Pillars (Painted trim holding the roof) */}
            <mesh position={[-config.cabinArgs[0]/2 + 0.04, 0, -config.cabinArgs[2]/2 + 0.1]} rotation={[0.3, 0, 0]}>
               <boxGeometry args={[0.08, config.cabinArgs[1], 0.15]} />
               {paintMaterial}
            </mesh>
            <mesh position={[config.cabinArgs[0]/2 - 0.04, 0, -config.cabinArgs[2]/2 + 0.1]} rotation={[0.3, 0, 0]}>
               <boxGeometry args={[0.08, config.cabinArgs[1], 0.15]} />
               {paintMaterial}
            </mesh>
            {/* Rear Pillars */}
            <mesh position={[-config.cabinArgs[0]/2 + 0.04, 0, config.cabinArgs[2]/2 - 0.1]} rotation={[-config.roofSlope * 0.3, 0, 0]}>
               <boxGeometry args={[0.1, config.cabinArgs[1], 0.2]} />
               {paintMaterial}
            </mesh>
            <mesh position={[config.cabinArgs[0]/2 - 0.04, 0, config.cabinArgs[2]/2 - 0.1]} rotation={[-config.roofSlope * 0.3, 0, 0]}>
               <boxGeometry args={[0.1, config.cabinArgs[1], 0.2]} />
               {paintMaterial}
            </mesh>
          </group>

        </group>

        {/* Grill (Front Details) */}
        {!config.isEV && config.grillStyle === 1 && (
           <group position={[0, -0.05, config.frontZ - 0.02]}>
             <RoundedBox args={[config.chassisArgs[0] * 0.3, config.chassisArgs[1] * 0.45, 0.05]} radius={0.02} position={[-config.chassisArgs[0] * 0.17, 0, 0]}>
                <meshStandardMaterial color="#050505" metalness={0.8} roughness={0.9} wireframe />
             </RoundedBox>
             <RoundedBox args={[config.chassisArgs[0] * 0.3, config.chassisArgs[1] * 0.45, 0.05]} radius={0.02} position={[config.chassisArgs[0] * 0.17, 0, 0]}>
                <meshStandardMaterial color="#050505" metalness={0.8} roughness={0.9} wireframe />
             </RoundedBox>
           </group>
        )}
        {!config.isEV && config.grillStyle === 2 && (
           <RoundedBox args={[config.chassisArgs[0] * 0.5, config.chassisArgs[1] * 0.8, 0.05]} radius={0.02} position={[0, -0.1, config.frontZ - 0.02]}>
              <meshStandardMaterial color="#050505" metalness={0.8} roughness={0.9} wireframe />
           </RoundedBox>
        )}
        {!config.isEV && (config.grillStyle === 0 || config.grillStyle === 3) && (
           <RoundedBox args={[config.chassisArgs[0] * 0.7, config.chassisArgs[1] * (config.grillStyle === 3 ? 0.2 : 0.45), 0.05]} radius={0.02} position={[0, -0.05, config.frontZ - 0.02]}>
              <meshStandardMaterial color="#050505" metalness={0.8} roughness={0.9} wireframe />
           </RoundedBox>
        )}

        {/* Front Under-splitter */}
        <RoundedBox args={[config.chassisArgs[0] - 0.05, 0.06, 0.4]} radius={0.02} position={[0, -config.chassisArgs[1]/2 - 0.03, config.frontZ + 0.11]}>
          {trimMaterial}
        </RoundedBox>

        {/* Exhaust Pipes (Not on EVs) */}
        {!config.isEV && (
          <group position={[0, -config.chassisArgs[1]/2 + 0.05, config.rearZ]}>
            <mesh position={[-config.chassisArgs[0]/3, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.15, 16]} />
              <meshStandardMaterial color="#222" metalness={1} roughness={0.1} />
            </mesh>
            <mesh position={[config.chassisArgs[0]/3, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.15, 16]} />
              <meshStandardMaterial color="#222" metalness={1} roughness={0.1} />
            </mesh>
          </group>
        )}

        {/* Procedural Rear Spoiler */}
        {config.hasSpoiler && config.spoilerType === 2 && (
          <group position={[0, config.chassisArgs[1]/2, config.rearZ - 0.2]}>
            {/* Massive Wing */}
            <RoundedBox args={[config.spoilerWidth + 0.1, 0.02, 0.35]} radius={0.01} position={[0, 0.35, 0]}>
              <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.4} clearcoat={1.0} />
            </RoundedBox>
            <mesh position={[-config.spoilerWidth/2 + 0.15, 0.17, 0]} rotation={[0.1, 0, 0]}>
              <boxGeometry args={[0.03, 0.35, 0.1]} />
              {trimMaterial}
            </mesh>
            <mesh position={[config.spoilerWidth/2 - 0.15, 0.17, 0]} rotation={[0.1, 0, 0]}>
              <boxGeometry args={[0.03, 0.35, 0.1]} />
              {trimMaterial}
            </mesh>
            {/* Endplates */}
            <mesh position={[-config.spoilerWidth/2 - 0.05, 0.35, 0]} rotation={[0, 0, 0]}>
               <boxGeometry args={[0.01, 0.15, 0.4]} />
               {trimMaterial}
            </mesh>
            <mesh position={[config.spoilerWidth/2 + 0.05, 0.35, 0]} rotation={[0, 0, 0]}>
               <boxGeometry args={[0.01, 0.15, 0.4]} />
               {trimMaterial}
            </mesh>
          </group>
        )}
        {config.hasSpoiler && config.spoilerType === 1 && (
          <group position={[0, config.chassisArgs[1]/2, config.rearZ - 0.05]}>
            {/* Small Lip Spoiler */}
            <RoundedBox args={[config.spoilerWidth - 0.2, 0.05, 0.15]} radius={0.02} position={[0, 0.02, 0]} rotation={[-0.1, 0, 0]}>
              <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.4} clearcoat={1.0} />
            </RoundedBox>
          </group>
        )}

        {/* LEFT DOOR */}
        <group 
          ref={leftDoorRef} 
          position={[
            -config.chassisArgs[0]/2, 
            config.doorStyle === 3 ? config.cabinPos[1] + config.cabinArgs[1]/2 : config.chassisArgs[1]/2 + 0.1, 
            config.doorStyle === 2 ? 0.2 : -0.2
          ]}
        >
          <RoundedBox args={config.doorArgs} radius={0.02} castShadow position={[0, config.doorStyle === 3 ? -config.doorArgs[1]/2 : 0, config.doorStyle === 2 ? -config.doorArgs[2]/2 : config.doorArgs[2]/2]}>
            {paintMaterial}
            {/* Door handle */}
            <mesh position={[-0.035, 0, config.doorArgs[2]/3]}>
              <boxGeometry args={[0.02, 0.03, 0.12]} />
              {trimMaterial}
            </mesh>
            {/* Left Side Mirror */}
            <RoundedBox args={[0.18, 0.08, 0.1]} radius={0.02} position={[-0.1, config.doorArgs[1]/3, config.doorStyle === 2 ? config.doorArgs[2]/2 - 0.1 : -config.doorArgs[2]/2 + 0.1]}>
               {paintMaterial}
            </RoundedBox>
          </RoundedBox>
        </group>

        {/* RIGHT DOOR */}
        <group 
          ref={rightDoorRef} 
          position={[
            config.chassisArgs[0]/2, 
            config.doorStyle === 3 ? config.cabinPos[1] + config.cabinArgs[1]/2 : config.chassisArgs[1]/2 + 0.1, 
            config.doorStyle === 2 ? 0.2 : -0.2
          ]}
        >
          <RoundedBox args={config.doorArgs} radius={0.02} castShadow position={[0, config.doorStyle === 3 ? -config.doorArgs[1]/2 : 0, config.doorStyle === 2 ? -config.doorArgs[2]/2 : config.doorArgs[2]/2]}>
            {paintMaterial}
            {/* Door handle */}
            <mesh position={[0.035, 0, config.doorArgs[2]/3]}>
              <boxGeometry args={[0.02, 0.03, 0.12]} />
              {trimMaterial}
            </mesh>
            {/* Right Side Mirror */}
            <RoundedBox args={[0.18, 0.08, 0.1]} radius={0.02} position={[0.1, config.doorArgs[1]/3, config.doorStyle === 2 ? config.doorArgs[2]/2 - 0.1 : -config.doorArgs[2]/2 + 0.1]}>
               {paintMaterial}
            </RoundedBox>
          </RoundedBox>
        </group>

        {/* HOOD */}
        <group ref={hoodRef} position={[0, -chassisH/2 + bayH, frontZCenter + frontL/2]}>
          {/* Hinge at windshield, geometry projects forward to the nose */}
          <RoundedBox args={[chassisW - 0.04, lidH, frontL]} radius={Math.min(0.06, lidH/2 - 0.005)} smoothness={4} castShadow position={[0, lidH/2, -frontL/2]}>
            {paintMaterial}
          </RoundedBox>
        </group>

        {/* TRUNK */}
        <group ref={trunkRef} position={[0, -chassisH/2 + bayH, rearZCenter - rearL/2]}>
          {/* Hinge at rear window, geometry projects backward to bumper */}
          <RoundedBox args={[chassisW - 0.04, lidH, rearL]} radius={Math.min(0.06, lidH/2 - 0.005)} smoothness={4} castShadow position={[0, lidH/2, rearL/2]}>
            {paintMaterial}
          </RoundedBox>
        </group>

        {/* Headlights */}
        <group position={[-config.chassisArgs[0]/2 + 0.25, 0.05, config.frontZ]}>
          <RoundedBox args={[0.25, 0.1, 0.05]} radius={0.02}>
            <meshStandardMaterial color={config.headlightColor} emissive={config.headlightColor} emissiveIntensity={headlightsOn ? 8 : 2} />
          </RoundedBox>
          {headlightsOn && (
             <SpotLight
               position={[0, 0, -0.05]}
               target-position={[0, -0.5, -5]}
               color={config.headlightColor}
               intensity={20}
               angle={0.4}
               penumbra={0.6}
               distance={25}
               castShadow
             />
          )}
        </group>
        <group position={[config.chassisArgs[0]/2 - 0.25, 0.05, config.frontZ]}>
          <RoundedBox args={[0.25, 0.1, 0.05]} radius={0.02}>
            <meshStandardMaterial color={config.headlightColor} emissive={config.headlightColor} emissiveIntensity={headlightsOn ? 8 : 2} />
          </RoundedBox>
          {headlightsOn && (
             <SpotLight
               position={[0, 0, -0.05]}
               target-position={[0, -0.5, -5]}
               color={config.headlightColor}
               intensity={20}
               angle={0.4}
               penumbra={0.6}
               distance={25}
               castShadow
             />
          )}
        </group>

        {/* Taillights */}
        <mesh position={[-config.chassisArgs[0]/2 + 0.25, 0.08, config.rearZ]}>
          <boxGeometry args={[0.35, 0.06, 0.03]} />
          <meshStandardMaterial color={config.tailColor} emissive={config.tailColor} emissiveIntensity={isBraking ? 12 : 3} />
        </mesh>
        <mesh position={[config.chassisArgs[0]/2 - 0.25, 0.08, config.rearZ]}>
          <boxGeometry args={[0.35, 0.06, 0.03]} />
          <meshStandardMaterial color={config.tailColor} emissive={config.tailColor} emissiveIntensity={isBraking ? 12 : 3} />
        </mesh>

        {/* PROCEDURAL WHEELS - High Detail */}
        {/* Helper function for wheels to keep JSX clean */}
        {(() => {
          const Wheel = ({ pos, refInner }) => {
            const sign = Math.sign(pos[0]); // 1 for right, -1 for left
            const rimRadius = config.wheelRadius * 0.75;
            const rimThickness = config.wheelThickness * 0.9;
            const inward = -sign; 
            const outward = sign;

            return (
              <group position={pos}>
                {/* Brake Caliper */}
                <mesh position={[inward * 0.03, 0, 0.15]}>
                   <boxGeometry args={[0.06, 0.18, 0.12]} />
                   <meshStandardMaterial color="#ff1100" metalness={0.6} roughness={0.3} />
                </mesh>
                {/* Brake Disc */}
                <mesh rotation={[0, 0, Math.PI / 2]} position={[inward * 0.05, 0, 0]}>
                  <cylinderGeometry args={[config.wheelRadius * 0.55, config.wheelRadius * 0.55, 0.05, 32]} />
                  <meshPhysicalMaterial color="#999" metalness={0.9} roughness={0.4} />
                </mesh>
                
                <group ref={refInner}>
                  {/* Rubber Tire (Matte) */}
                  <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[config.wheelRadius, config.wheelRadius, config.wheelThickness, 32]} />
                    <meshPhysicalMaterial color="#111" roughness={0.9} metalness={0.1} />
                  </mesh>

                  {/* RIMS */}
                  <group position={[0, 0, 0]}>
                     {/* Rim Barrel (Inner tube behind spokes) */}
                     <mesh rotation={[0, 0, Math.PI / 2]} position={[inward * 0.02, 0, 0]}>
                       <cylinderGeometry args={[rimRadius, rimRadius, rimThickness * 0.8, 32]} />
                       <meshPhysicalMaterial color="#222" metalness={0.8} roughness={0.6} />
                     </mesh>
                     
                     {/* Rim Face (Shifted slightly outward) */}
                     <group position={[outward * (rimThickness/2 - 0.04), 0, 0]}>
                       
                       {/* 0: Classic 5-Spoke */}
                       {config.rimStyle === 0 && Array.from({length: 5}).map((_, i) => (
                         <mesh key={i} rotation={[i * (Math.PI*2/5), 0, 0]} position={[0, rimRadius/2, 0]}>
                           <boxGeometry args={[0.04, rimRadius, 0.08]} />
                           <meshPhysicalMaterial color={config.rimColor} metalness={1} roughness={0.2} clearcoat={1} />
                         </mesh>
                       ))}
                       
                       {/* 1: Multi-Spoke / Mesh */}
                       {config.rimStyle === 1 && Array.from({length: 14}).map((_, i) => (
                         <mesh key={i} rotation={[i * (Math.PI*2/14), 0, 0]} position={[0, rimRadius/2, 0]}>
                           <boxGeometry args={[0.02, rimRadius, 0.04]} />
                           <meshPhysicalMaterial color={config.rimColor} metalness={1} roughness={0.2} clearcoat={1} />
                         </mesh>
                       ))}

                       {/* 2: Aero Disc */}
                       {config.rimStyle === 2 && (
                         <mesh rotation={[0, 0, Math.PI / 2]}>
                           <cylinderGeometry args={[rimRadius * 0.95, rimRadius * 0.95, 0.02, 32]} />
                           <meshPhysicalMaterial color={config.rimColor} metalness={0.8} roughness={0.4} clearcoat={1} />
                         </mesh>
                       )}

                       {/* 3: Split-Spoke / Y-Spoke */}
                       {config.rimStyle === 3 && Array.from({length: 6}).map((_, i) => (
                         <group key={i} rotation={[i * (Math.PI*2/6), 0, 0]}>
                           <mesh position={[0, rimRadius/2, 0]}>
                             <boxGeometry args={[0.05, rimRadius, 0.05]} />
                             <meshPhysicalMaterial color={config.rimColor} metalness={1} roughness={0.2} clearcoat={1} />
                           </mesh>
                           {/* Cutout to make it look like a Y-spoke */}
                           <mesh position={[outward * 0.01, rimRadius/2, 0]}>
                             <boxGeometry args={[0.06, rimRadius*0.7, 0.02]} />
                             <meshPhysicalMaterial color="#111" metalness={0.3} roughness={0.9} />
                           </mesh>
                         </group>
                       ))}

                       {/* 4: Deep Dish */}
                       {config.rimStyle === 4 && (
                         <group>
                           {/* Outer lip */}
                           <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
                             <cylinderGeometry args={[rimRadius * 0.9, rimRadius * 0.9, 0.06, 32]} />
                             <meshPhysicalMaterial color={config.rimColor} metalness={1} roughness={0.1} clearcoat={1} />
                           </mesh>
                           {/* Deep recessed center face */}
                           <mesh rotation={[0, 0, Math.PI / 2]} position={[inward * 0.08, 0, 0]}>
                             <cylinderGeometry args={[rimRadius * 0.7, rimRadius * 0.7, 0.02, 16]} />
                             <meshPhysicalMaterial color={config.rimColor} metalness={0.9} roughness={0.3} />
                           </mesh>
                         </group>
                       )}
                       
                       {/* Center Cap */}
                       <mesh rotation={[0, 0, Math.PI / 2]} position={[outward * 0.01, 0, 0]}>
                         <cylinderGeometry args={[rimRadius * 0.15, rimRadius * 0.15, 0.04, 16]} />
                         <meshPhysicalMaterial color="#111" metalness={0.9} roughness={0.2} />
                       </mesh>
                       
                       {/* Thick Rim Edge Band */}
                       <mesh rotation={[0, 0, Math.PI / 2]} position={[inward * 0.01, 0, 0]}>
                         <cylinderGeometry args={[rimRadius * 0.98, rimRadius * 0.98, 0.04, 32]} />
                         <meshPhysicalMaterial color="#888" metalness={1} roughness={0.1} />
                       </mesh>

                     </group>
                  </group>
                </group>
              </group>
            );
          };
          
          const wheelX = config.chassisArgs[0] / 2 + config.wheelThickness / 2 - 0.02;
          const wheelY = -config.chassisArgs[1] / 2 + 0.05;

          return (
            <>
              <Wheel pos={[-wheelX, wheelY, config.frontZ + config.chassisArgs[2]*0.2]} refInner={flWheelRef} />
              <Wheel pos={[wheelX, wheelY, config.frontZ + config.chassisArgs[2]*0.2]} refInner={frWheelRef} />
              <Wheel pos={[-wheelX, wheelY, config.rearZ - config.chassisArgs[2]*0.2]} refInner={rlWheelRef} />
              <Wheel pos={[wheelX, wheelY, config.rearZ - config.chassisArgs[2]*0.2]} refInner={rrWheelRef} />
            </>
          );
        })()}

      </group>
    </group>
  );
}
