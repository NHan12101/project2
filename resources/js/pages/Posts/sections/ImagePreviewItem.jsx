import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function ImagePreviewItem({
    id,
    preview,
    index,
    sortable = false,
    removable = false,
    onRemove,
    is360 = false,
    onToggle360,
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id,
        disabled: !sortable,
    });

    const style = sortable
        ? {
              transform: CSS.Transform.toString(transform),
              transition,
              zIndex: isDragging ? 999 : undefined,
              position: isDragging ? 'relative' : undefined,
          }
        : undefined;

    return (
        <div
            className={` ${sortable ? 'post-media__preview--box' : ''}`}
            style={style}
            ref={sortable ? setNodeRef : null}
            {...(sortable ? attributes : {})}
            {...(sortable ? listeners : {})}
        >
            <div
                className={`post-media__preview-item ${
                    sortable ? 'post-media__item--sortable' : ''
                }`}
            >
                {index === 0 && (
                    <span className="image-cover-badge">Ảnh đại diện</span>
                )}

                {/* {is360 && <span className="image-cover-badge">Ảnh 360</span>} */}

                <img
                    src={preview}
                    className="post-media__preview-image"
                    draggable={false}
                />

                {removable && (
                    <button
                        type="button"
                        className="post-media__preview-remove"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
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
                                d="M7.583 5H2.75a.75.75 0 0 0 0 1.5h1.297l.834 12.927A2.75 2.75 0 0 0 7.625 22h8.75a2.75 2.75 0 0 0 2.744-2.573L19.953 6.5h1.297a.75.75 0 0 0 0-1.5h-4.833a4.75 4.75 0 0 0-8.834 0m1.678 0h5.478A3.25 3.25 0 0 0 12 3.5c-1.15 0-2.162.598-2.74 1.5m6.596 1.5H5.55l.828 12.83a1.25 1.25 0 0 0 1.247 1.17h8.75a1.25 1.25 0 0 0 1.247-1.17L18.45 6.5h-2.593M9.75 10a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0v-5.5a.75.75 0 0 1 .75-.75m4.5 0a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0v-5.5a.75.75 0 0 1 .75-.75"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </button>
                )}

                {onToggle360 && (
                    <button
                        type="button"
                        className="post-media__preview-360"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle360();
                        }}
                    >
                        <img
                            src={
                                is360
                                    ? '/icons/icon-360-active.svg'
                                    : '/icons/icon-360.svg'
                            }
                            alt="icon-360"
                        />
                    </button>
                )}
            </div>
        </div>
    );
}
