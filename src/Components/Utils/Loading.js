import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loading = ({ show }) => {
    if (show) {
        // console.log("loading");
        return (
            <>
                <div className='loading-spinner-container'>
                    {/* <h1 className='text-dark'>Loading</h1> */}
                    <Spinner className='spinner-custom' animation="border" role="status"/>
                </div>
            </>
        );
    }
    return null; // If not loading, render nothing
};

export default Loading;
