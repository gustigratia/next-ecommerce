/**
 * HeroAnimation Component displays a Lottie animation using the Lottie React library.
 * If there is an error loading the animation data, an error message is displayed.
 * @returns {JSX.Element} - Rendered component for displaying the Lottie animation.
 */
'use client';

import React from 'react';

import Lottie from 'lottie-react';

import heroAnim from '../../style/heroAnimation.json';

/**
 * HeroAnimation Component displays a Lottie animation using the Lottie React library.
 * If there is an error loading the animation data, an error message is displayed.
 * @returns {JSX.Element} - Rendered component for displaying the Lottie animation.
 */

/**
 * HeroAnimation Component displays a Lottie animation using the Lottie React library.
 * If there is an error loading the animation data, an error message is displayed.
 * @returns {JSX.Element} - Rendered component for displaying the Lottie animation.
 */

/**
 * HeroAnimation Component displays a Lottie animation using the Lottie React library.
 * If there is an error loading the animation data, an error message is displayed.
 * @returns {JSX.Element} - Rendered component for displaying the Lottie animation.
 */

/**
 * HeroAnimation Component displays a Lottie animation using the Lottie React library.
 * If there is an error loading the animation data, an error message is displayed.
 * @returns {JSX.Element} - Rendered component for displaying the Lottie animation.
 */

const HeroAnimation = () => {
  // Check if animation data is available
  if (!heroAnim) {
    return <p>Error loading animation.</p>;
  }

  // Render Lottie animation
  return <Lottie animationData={heroAnim} />;
};

export default HeroAnimation;
