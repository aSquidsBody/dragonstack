import React, { Component } from 'react';
import { skinny, slender, sporty, stocky, patchy, plain, spotted, striped } from '../assets';
import { connect } from 'react-redux';

const propertyMap = {
    backgroundColor: { 
        black: '#263238', 
        white: '#cfd8dc', 
        green: '#a5d6a7', 
        blue: '#0277bd'
    },
    build: { slender, stocky, sporty, skinny },
    pattern: { plain, striped, spotted, patchy },
    size: {small: 100, medium: 140, large: 180, enormous: 220}
};

class DragonAvatar extends Component {
    // custom method
    get DragonImage() {
        const dragonPropertyMap = {};

        this.props.dragon.traits.forEach(trait => {  // this.props passed from Dragon
            const { traitType, traitValue } = trait;

            dragonPropertyMap[traitType] = propertyMap[traitType][traitValue];
        });

        const { backgroundColor, build, pattern, size } = dragonPropertyMap;

        const sizing = { width: size, height: size };
        
        return (
            <div className='dragon-avatar-image-wrapper'>
                <div className='dragon-avatar-image-background' style={{ backgroundColor, ...sizing }}></div>
                <img src={pattern} className='dragon-avatar-image-pattern' style={{ ...sizing }}/>
                <img src={build} className='dragon-avatar-image' style={{ ...sizing }}/>
            </div>
        )

    }

    render() {
        const { generationId, dragonId, traits } = this.props.dragon;  // this.props passed from Dragon

        if (!dragonId) return <div></div>;

        return (
            <div>
                <span>G{generationId}. </span>
                <span>I{dragonId}. </span>
                { Object.keys(traits).map(key => traits[key].traitValue).join(', ') }
                { this.DragonImage }
            </div>    
        )
    }
};

export default DragonAvatar;