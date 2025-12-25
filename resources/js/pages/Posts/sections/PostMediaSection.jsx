import { createImagePreview } from '@/utils/createImagePreview';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { useEffect, useRef, useState } from 'react';

import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import ImagePreviewItem from './ImagePreviewItem';

export default function PostMediaSection({ form }) {
    const { data, setData } = form;

    const [openEdit, setOpenEdit] = useState(false);
    const inputRef = useRef(null);

    const [videoUrl, setVideoUrl] = useState(null);

    useEffect(() => {
        if (!data.video) {
            setVideoUrl(null);
            return;
        }

        const url = URL.createObjectURL(data.video);
        setVideoUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [data.video]);

    // Hàm xử lý file
    async function handleSelectFiles(e) {
        const files = Array.from(e.target.files);
        let images = [...data.images];

        for (const file of files) {
            if (file.type.startsWith('image/')) {
                if (file.size > 20 * 1024 * 1024) {
                    alert(`Ảnh ${file.name} vượt quá 20MB`);
                    continue;
                }

                const preview = await createImagePreview(file, {
                    maxWidth: 1280, // ảnh thường
                    quality: 0.7,
                });

                images.push({
                    id: crypto.randomUUID(),
                    file, // FILE GỐC (upload)
                    preview, // PREVIEW NHẸ (render)
                    is360: false,
                });
            }

            if (file.type.startsWith('video/')) {
                if (data.video) {
                    alert('Chỉ được tải lên 1 video');
                    continue;
                }
                handleVideoChange(file);
            }
        }

        setData('images', images.slice(0, 24));
        e.target.value = null;
    }

    // Hàm xóa ảnh
    function removeImage(id) {
        setData(
            'images',
            data.images.filter((img) => img.id !== id),
        );
    }

    // Hàm chặn upload video nếu chưa đủ tối thiểu 3 ảnh
    function handleVideoChange(file) {
        if (form.data.images.length < 3) {
            alert('Vui lòng upload ít nhất 3 ảnh trước khi thêm video');
            return;
        }

        if (file.size > 200 * 1024 * 1024) {
            alert('Video tối đa 200MB');
            return;
        }

        validateVideoDuration(file);
    }

    // hàm check thời lượng video
    function validateVideoDuration(file) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;

        video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src);

            if (data.youtube_url) {
                alert('Bạn đã gắn link YouTube, không thể upload video');
                return;
            }

            if (video.duration < 5) {
                alert('Video phải tối thiểu 5 giây');
                return;
            }

            if (video.duration > 120) {
                alert('Video tối đa 2 phút');
                return;
            }

            form.setData('video', file);
        };

        video.src = URL.createObjectURL(file);
    }

    const youtubeId = getYoutubeId(data.youtube_url);

    // Hàm phân tích url
    function getYoutubeId(url) {
        if (!url) return null;
        
        const match = url.match(
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
        );
        return match ? match[1] : null;
    }

    return (
        <div className="post-media">
            {/* Header */}
            <div className="post-media__header">
                <span className="post-form__label post-media__title">
                    Hình ảnh & video
                </span>

                {data.images.length > 0 && (
                    <button
                        className="post-media__edit"
                        type="button"
                        onClick={() => setOpenEdit(true)}
                    >
                        <img src="/icons/edit-pen.svg" alt="edit" />
                        <span>Chỉnh sửa ({data.images.length})</span>
                    </button>
                )}
            </div>
            {/* Hint */}
            <div className="post-media__hint">
                <span>Đăng tối thiểu 3 ảnh</span>
            </div>

            {data.images.length > 0 && (
                <div className="post-media__preview">
                    {data.images[0] && (
                        <ImagePreviewItem
                            key={data.images[0].id}
                            {...data.images[0]}
                            index={0}
                            sortable={false}
                            removable={false}
                        />
                    )}

                    {data.video && (
                        <div className="post-media__preview-item">
                            {videoUrl && (
                                <video
                                    src={videoUrl}
                                    className="post-media__preview-image"
                                />
                            )}
                        </div>
                    )}

                    {data.images.slice(1).map((item, index) => (
                        <ImagePreviewItem
                            key={item.id}
                            id={item.id}
                            file={item.file}
                            preview={item.preview}
                            index={index + 1}
                            sortable={false}
                            removable={false}
                        />
                    ))}
                </div>
            )}

            {/* Upload */}
            <div className="post-media__upload">
                {/* Dropzone */}
                <div className="post-media__dropzone">
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        hidden
                        disabled={data.images.length >= 24}
                        onChange={handleSelectFiles}
                    />

                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        data-automation-id="svg-icon"
                        da-id="svg-icon"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.99999 2C8.1326 2 8.25978 2.05268 8.35355 2.14645L11.3536 5.14645C11.5488 5.34171 11.5488 5.65829 11.3536 5.85355C11.1583 6.04882 10.8417 6.04882 10.6464 5.85355L8.49999 3.7071V10C8.49999 10.2761 8.27613 10.5 7.99999 10.5C7.72385 10.5 7.49999 10.2761 7.49999 10V3.70711L5.35355 5.85355C5.15829 6.04882 4.84171 6.04882 4.64645 5.85355C4.45118 5.65829 4.45118 5.34171 4.64645 5.14645L7.64644 2.14645C7.74021 2.05268 7.86738 2 7.99999 2ZM2.5 8C2.77614 8 3 8.22386 3 8.5V12.1667C3 12.6269 3.3731 13 3.83333 13H12.1667C12.6269 13 13 12.6269 13 12.1667V8.5C13 8.22386 13.2239 8 13.5 8C13.7761 8 14 8.22386 14 8.5V12.1667C14 13.1792 13.1792 14 12.1667 14H3.83333C2.82081 14 2 13.1792 2 12.1667V8.5C2 8.22386 2.22386 8 2.5 8Z"
                            fill="#0D1011"
                        ></path>
                    </svg>
                    <span className="post-media__dropzone-text">
                        Kéo vào tối đa 24 ảnh và 1 video
                    </span>
                </div>

                {/* Button */}
                <div className="post-media__upload-action">
                    <button
                        className="post-media__edit post-media__upload-btn"
                        type="button"
                        onClick={() => inputRef.current.click()}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            data-automation-id="svg-icon"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            da-id="svg-icon"
                        >
                            <path d="M19 11h-6V5c0-.6-.4-1-1-1s-1 .4-1 1v6H5c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1v-6h6c.6 0 1-.4 1-1s-.4-1-1-1z"></path>
                        </svg>
                        <span>Tải ảnh / video từ thiết bị</span>
                    </button>
                </div>
            </div>

            {/* Guides */}
            <div className="post-media__guide">
                <div className="post-media__guide-item">
                    <img src="/icons/media-guide.svg" alt="media-guide" />
                    <span>Hướng dẫn đăng ảnh / video</span>
                </div>

                <div className="post-media__guide-item">
                    <img src="/icons/icon-360.svg" alt="icon-360" />
                    <span>Hướng dẫn đăng ảnh 360</span>
                </div>
            </div>
            {/* Video link */}
            <div className="post-media__video">
                <span className="post-form__label--other">Liên kết video</span>
                <div className="post-media__video-link">
                    <textarea
                        className="post-form__input--title"
                        placeholder="Dán đường dẫn Youtube"
                        value={data.youtube_url || ''}
                        onChange={(e) => {
                            const value = e.target.value;

                            // nếu user dán link yt thì xóa video upload
                            if (value && data.video) {
                                setData('video', null);
                            }

                            setData('youtube_url', value);
                        }}
                    />
                </div>
            </div>

            {youtubeId && (
                <div className="post-media__preview" style={{ marginTop: 16 }}>
                    <div className="post-media__youtube">
                        <iframe
                            src={`https://www.youtube.com/embed/${getYoutubeId(
                                data.youtube_url,
                            )}`}
                            className="post-media__youtube--import"
                            frameBorder="0"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}

            {openEdit && (
                <div className="auth-form">
                    <div
                        className="address-panel"
                        style={{ padding: '20px 10px' }}
                    >
                        {/* Header */}
                        <div className="address-panel__header">
                            <h1 className="address-panel__title">
                                Chỉnh sửa hình ảnh & video ({data.images.length}
                                )
                            </h1>
                            <button
                                type="button"
                                className="address-panel__close"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenEdit(false);
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div
                            className="address-panel__body"
                            style={{
                                overflow: 'auto',
                                height: '95%',
                            }}
                        >
                            <DndContext
                                collisionDetection={closestCenter}
                                onDragEnd={({ active, over }) => {
                                    if (!over || active.id === over.id) return;

                                    const oldIndex = data.images.findIndex(
                                        (img) => img.id === active.id,
                                    );
                                    const newIndex = data.images.findIndex(
                                        (img) => img.id === over.id,
                                    );

                                    setData(
                                        'images',
                                        arrayMove(
                                            data.images,
                                            oldIndex,
                                            newIndex,
                                        ),
                                    );
                                }}
                            >
                                <SortableContext
                                    items={data.images.map((img) => img.id)}
                                    strategy={rectSortingStrategy}
                                >
                                    {/* Phần chỉnh sửa video */}
                                    {data.video && (
                                        <div>
                                            <h2
                                                style={{
                                                    fontSize: '1.56rem',
                                                    marginTop: 12,
                                                    fontWeight: 600,
                                                    padding: '8px 0px 0px 16px',
                                                    lineHeight: '1.2',
                                                }}
                                            >
                                                Video luôn hiển thị đầu tiên
                                                trên trang chi tiết tin đăng.
                                                Không thể thay đổi thứ tự.
                                            </h2>

                                            <div
                                                className="post-media__preview"
                                                style={{ marginTop: 6 }}
                                            >
                                                <div className="post-media__preview--box">
                                                    <div
                                                        className="post-media__preview-item"
                                                        style={{ height: 210 }}
                                                    >
                                                        <video
                                                            src={videoUrl}
                                                            controls
                                                            muted
                                                            playsInline
                                                            className="post-media__preview-image"
                                                        />

                                                        <button
                                                            type="button"
                                                            className="post-media__preview-remove"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setData(
                                                                    'video',
                                                                    null,
                                                                );
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
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <h2
                                        style={{
                                            fontSize: '1.56rem',
                                            fontWeight: 600,
                                            marginTop: 12,
                                            padding: '8px 0px 0px 16px',
                                        }}
                                    >
                                        Kéo và thả ảnh để sắp xếp lại thứ tự
                                    </h2>

                                    <div
                                        className="post-media__preview"
                                        style={{ marginTop: 12 }}
                                    >
                                        {data.images.map((item, index) => (
                                            <ImagePreviewItem
                                                key={item.id}
                                                id={item.id}
                                                file={item.file}
                                                preview={item.preview}
                                                index={index}
                                                sortable
                                                removable
                                                is360={item.is360 || false} // gắn flag
                                                onRemove={() =>
                                                    removeImage(item.id)
                                                }
                                                onToggle360={() => {
                                                    const total360 =
                                                        data.images.filter(
                                                            (i) => i.is360,
                                                        ).length;

                                                    if (
                                                        !item.is360 &&
                                                        total360 >= 5
                                                    ) {
                                                        alert(
                                                            'Tối đa 5 ảnh 360',
                                                        );
                                                        return;
                                                    }

                                                    setData(
                                                        'images',
                                                        data.images.map(
                                                            (img) =>
                                                                img.id ===
                                                                item.id
                                                                    ? {
                                                                          ...img,
                                                                          is360: !img.is360,
                                                                      }
                                                                    : img,
                                                        ),
                                                    );
                                                }}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
