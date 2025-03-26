import classNames from 'classnames';
import { useState, forwardRef, useEffect } from 'react';
import images from '~/assets/images';
import styles from './Image.module.scss';

// fallback: customFallback = images.noImage => gán fallback bằng 1 tên khác là customFallback để không bị trùng tên fallback trong useState
// Nếu fallback được truyền từ ngoài vào thì lấy src của bên ngoài, còn không thì lấy mặc định là images.noImage
const Image = forwardRef(
    (
        {
            src,
            alt,
            className,
            fallback: customFallback = images.noImage,
            ...props
        },
        ref,
    ) => {
        const [fallback, setFallback] = useState('');

        useEffect(() => {
            setFallback('');
        }, [src]);

        const handleError = () => {
            setFallback(customFallback);
        };

        return (
            <img
                className={classNames(styles.wrapper, className)}
                ref={ref}
                src={fallback || src}
                alt={alt}
                {...props}
                onError={handleError}
            />
        );
    },
);

// Image.propTypes = {
//     src: PropTypes.string,
//     alt: PropTypes.string,
//     className: PropTypes.string,
//     fallback: PropTypes.string,
// };

export default Image;

// function Image({ ...props }, ref) {
//     return (
//         // eslint-disable-next-line jsx-a11y/alt-text
//         <img ref={ref} {...props} />
//     );
// }

// export default forwardRef(Image);
