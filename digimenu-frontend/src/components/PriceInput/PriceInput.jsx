import CurrencyInput from 'react-currency-input-field';

function PriceInput({ value, onChange, className }) {
    const handleChange = (val) => {
        if (val === undefined || val === null || val === '') {
            onChange(0);
        } else {
            onChange(Number(val));
        }
    };

    return (
        <CurrencyInput
            value={value}
            decimalsLimit={0}
            onValueChange={handleChange}
            intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
            className={className}
            placeholder="Nhập giá"
            inputMode='numeric'
            pattern='[0-9]*'
            autoComplete='off'
        />
    );
}

export default PriceInput;