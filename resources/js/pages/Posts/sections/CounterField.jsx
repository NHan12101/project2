export default function CounterField({
    label,
    value = 0,
    onChange,
    min = 0,
    max = 99,
}) {
    const decrease = () => {
        onChange(Math.max(min, value - 1));
    };

    const increase = () => {
        onChange(Math.min(max, value + 1));
    };

    return (
        <div className="bedroom-control" style={{marginTop: 18}}>
            <span className="address-panel__label">{label}</span>

            <div className="bedroom-control">
                <button
                    type="button"
                    className="bedroom-control__btn"
                    disabled={value <= min}
                    onClick={decrease}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        data-automation-id="svg-icon"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        da-id="svg-icon"
                    >
                        <path
                            fill="#0D1011"
                            fillRule="evenodd"
                            d="M3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </button>

                <span className="bedroom-control__value">{value}</span>

                <button
                    type="button"
                    className="bedroom-control__btn"
                    disabled={value >= max}
                    onClick={increase}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        data-automation-id="svg-icon"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        da-id="svg-icon"
                    >
                        <path
                            fill="#0D1011"
                            fillRule="evenodd"
                            d="M12 3a.75.75 0 0 1 .75.75v7.5h7.5a.75.75 0 0 1 0 1.5h-7.5v7.5a.75.75 0 0 1-1.5 0v-7.5h-7.5a.75.75 0 0 1 0-1.5h7.5v-7.5A.75.75 0 0 1 12 3"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}
