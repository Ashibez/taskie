import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../assets/template-animation.json';

function TemplateAnimation() {
    return (
        <Lottie 
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%' }}
            rendererSettings={{
                preserveAspectRatio: 'xMidYMid slice'
            }}
        />
    );
}

export default TemplateAnimation; 