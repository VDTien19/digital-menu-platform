import { useEffect, useRef } from 'react';
import Odometer from 'odometer';

function SlideUpNumber({ number }) {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            new Odometer({
                el: ref.current,
                value: 0,
                theme: 'default',
                duration: 2000,
            }).update(number);
        }
    }, [number]);

    return <div ref={ref} className="text-4xl font-bold"></div>;
}

export default SlideUpNumber;
