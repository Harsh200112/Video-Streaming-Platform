import React from 'react'
import CardSuggestions from './CardSuggestions2'

export default function History(params) {
    return (
        <div className='h-full w-full bg-slate-700 flex flex-col justify-center items-center overflow-scroll'>
            {
                Object.keys(params.data).length>0?(
                    params.data.map((item, index) => {
                        return (
                            <CardSuggestions key={index} data={item} />
                    )
                    })
                ):(
                    <div></div>
                )
            }
        </div>
    )
}
