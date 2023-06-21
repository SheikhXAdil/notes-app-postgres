import React from 'react'
import Image from 'next/image'

const Spinner = () => {
    return (
        <div className="flex items-center justify-center">
            <Image src={"/loading.gif"} alt='loading' width={50} height={50} />
        </div>
    )
}

export default Spinner
