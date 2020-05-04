import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { fetchDragon } from '../actions/dragon';
import DragonAvatar from './DragonAvatar';



class Dragon extends Component {
    // react method
    componentDidMount() {
        // this.props.fetchDragon();
    };

    // react method
    componentWillUnmount() {

    };

    // react method
    render() {
        return (
            <div>
                <Button onClick={this.props.fetchDragon}>New Dragon</Button>
                <DragonAvatar dragon={this.props.dragon} />
            </div>
        )
    }
};

// use inline version (as opposed to approach in ./generation;js)
export default connect(
    // want to pull { dragon } from the store and return it
    ({ dragon }) => ({ dragon }),  // js shorthand for => { return { dragon } }
    { fetchDragon }  // fetchDragon action creator
)(Dragon);  // connect() returns a function