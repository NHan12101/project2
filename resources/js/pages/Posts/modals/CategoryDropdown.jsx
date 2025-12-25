export default function CategoryDropdown({
    form,
    categories,
    onSelect,
    refCategory,
}) {
    const { data, setData } = form;

    return (
        <div
            ref={refCategory}
            className="address-panel__control--popup category-panel__control--popup"
        >
            {categories.map((cate) => {
                return (
                    <div
                        key={cate.id}
                        className="chose-type__box--section"
                        onClick={(e) => {
                            e.stopPropagation();
                            setData('category_id', cate.id);
                            onSelect(cate);
                        }}
                    >
                        <div className="box-section">
                            <div className="box-section__title">
                                {cate.name}
                            </div>

                            <div className="box-section__checkbox">
                                <label className="box-section__lable">
                                    <input
                                        hidden
                                        readOnly
                                        type="radio"
                                        name="category"
                                        checked={data.category_id === cate.id}
                                    />

                                    <span className="radio__span">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="1em"
                                            height="1em"
                                            className="radio__span--svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M18.395 6.57598C18.9539 7.23778 18.8406 8.20346 18.142 8.7329C16.9767 9.61594 15.7539 11.1412 14.6582 12.8103C13.5825 14.4492 12.7128 16.0964 12.2249 17.1048C11.9744 17.6224 11.442 17.9662 10.8418 17.9976C10.2416 18.0291 9.67235 17.7432 9.36308 17.255C9.03962 16.7443 8.42067 16.0312 7.70905 15.3255C7.00122 14.6236 6.31449 14.0401 5.91727 13.7664C5.1937 13.2679 5.03373 12.3082 5.55996 11.6228C6.08619 10.9374 7.09935 10.7858 7.82292 11.2843C8.44244 11.7111 9.28082 12.4409 10.0519 13.2056C10.1818 13.3345 10.3131 13.4675 10.444 13.6035C10.8692 12.8459 11.3626 12.0187 11.9068 11.1897C13.0526 9.44411 14.5103 7.55465 16.118 6.33633C16.8166 5.80689 17.836 5.91419 18.395 6.57598Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
