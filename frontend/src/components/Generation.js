import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchGeneration } from '../actions/generation';
import fetchStates from '../reducers/fetchStates';

const DEFAULT_GENERATION = { generationId: '', expiration: ''};

const MINIMUM_DELAY = 3000;

class Generation extends Component {
    // custom attribute. Not in the state since it will not be rendered in the webpage
    timer = null;

    // react method
    componentDidMount() {
        this.fetchNextGeneration();
    };

    // react method
    componentWillUnmount() {
        clearTimeout(this.timer);  // clears the timeout when you leave the page
    };

    // custom method
    fetchNextGeneration = () => {
        this.props.fetchGeneration();

        let delay = new Date(this.props.generation.expiration).getTime() -
            new Date().getTime();

            if (delay < MINIMUM_DELAY) {
                delay = MINIMUM_DELAY;
            }

        this.timer = setTimeout(() => this.fetchNextGeneration(), delay)
    };

    // react method
    render() {
        console.log("this.props", this.props);
        
        const { generation } = this.props;

        if (generation.status === fetchStates.error) {
            return <div>{generation.message}</div>
        }

        return (
            <div>
                <h3>Generation {generation.generationId}. Expires on:</h3>
                <h4>{new Date(generation.expiration).toString()}</h4>
            </div>
        )
    }
}

// using redux with a global "state" contained in this.props, map the state values to props
const mapStateToProps = state => {  // name is convention
    const generation = state.generation;

    return { generation };
};

// const mapDispatchToProps = dispatch => {
//     return {
//         fetchGeneration: () => fetchGeneration(dispatch)
//     }
// };


// Wrap component to pass redux values into Generation
const componentConnector = connect(
    mapStateToProps, 
    // mapDispatchToProps,
    { fetchGeneration }  // map dispatch to Props
);

export default componentConnector(Generation);