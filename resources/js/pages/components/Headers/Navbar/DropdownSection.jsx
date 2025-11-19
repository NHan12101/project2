import { router } from '@inertiajs/react';

export default function DropdownSection({ title, items, onNavigate }) {
    const handleClick = (item) => {
        if (onNavigate) onNavigate();
        if (item.method === 'post') {
            router.post(item.href);
        } else {
            router.visit(item.href);
        }
    };

    return (
        <>
            <div className="aw__d11fol30">
                <span className="aw__s7szxgv aw__d7lkasd">{title}</span>
            </div>

            <div className="aw__g19ew3vq">
                {items.map((item, index) => (
                    <div className="aw__l18daxzw" key={index}>
                        <a onClick={() => handleClick(item)} className="aw__i168xjue" >
                            <div className="aw__l1o6v83t">
                                <img src={item.icon} alt={item.label} />
                            </div>
                            <span className="aw__rqhj46z">{item.label}</span>
                            <div className="aw__r1feg55h">
                                <svg
                                    data-type="monochrome"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
                                    fill="none"
                                >
                                    <g fill="currentColor">
                                        <path d="M8.05951 4.68353C8.37193 4.37111 8.87846 4.37111 9.19088 4.68353L15.9409 11.4335C16.2533 11.746 16.2533 12.2525 15.9409 12.5649L9.19088 19.3149C8.87846 19.6273 8.37193 19.6273 8.05951 19.3149C7.74709 19.0025 7.74709 18.496 8.05951 18.1835L14.2438 11.9992L8.05951 5.8149C7.74709 5.50248 7.74709 4.99595 8.05951 4.68353Z"></path>
                                    </g>
                                </svg>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
        </>
    );
}
