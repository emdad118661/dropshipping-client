import React from 'react'

const HeadSubhead = ({title, subtitle}) => {
    return (
        <div>
            <h1 className='text-6xl font-bold text-center'>{title}</h1>
            <p className='text-center'>{subtitle}</p>
        </div>
    )
}

export default HeadSubhead