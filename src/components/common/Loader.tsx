import React from 'react';
import { CircularProgress } from '@mui/material';


const Loader: React.FC = () => {
    return (
        <div className="flex justify-center items-center">
            <CircularProgress size={20} />
            <span className='ml-2'>Loading...</span>
        </div>
    );
};

export default Loader;