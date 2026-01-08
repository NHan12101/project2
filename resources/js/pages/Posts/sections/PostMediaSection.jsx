import useDropdown from '@/hooks/useDropdown.js';
import { createImagePreview } from '@/utils/createImagePreview';
import { DndContext, closestCenter } from '@dnd-kit/core';
import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';
import ImagePreviewItem from './ImagePreviewItem';

export default function PostMediaSection({ form }) {
    const { data, setData, errors: errorForm } = form;
    const { errors } = usePage().props;

    const { menuRef, open: openEdit, setOpen: setOpenEdit } = useDropdown();
    const inputRef = useRef(null);

    const [openImages, setOpenImages] = useState(false);
    const [openVideo, setOpenVideo] = useState(false);

    const [videoUrl, setVideoUrl] = useState(null);

    const [isDragging, setIsDragging] = useState(false);

    const [totalImagesToUpload, setTotalImagesToUpload] = useState(0); // tổng số ảnh đang upload lần này
    const [uploadingImages, setUploadingImages] = useState(false); // đang upload ảnh không
    const [uploadProgress, setUploadProgress] = useState(0); // số ảnh đã xong / tổng

    const [previewMap, setPreviewMap] = useState({});

    const R2_PUBLIC_BASE_URL = import.meta.env.VITE_R2_PUBLIC_BASE_URL;

    useEffect(() => {
        if (!data.video) {
            setVideoUrl(null);
            return;
        }

        // nếu là path từ R2
        if (typeof data.video === 'string') {
            setVideoUrl(R2_PUBLIC_BASE_URL + '/' + data.video);
        }
    }, [data.video]);

    // Thêm
    useEffect(() => {
        let cancelled = false;

        async function processImagesFromR2() {
            try {
                if (!data.images.length) return;

                // CHỈ xử lý ảnh CHƯA có preview trong previewMap
                const imagesNeedPreview = data.images.filter(
                    (img) => img.path && !previewMap[img.id],
                );

                if (!imagesNeedPreview.length) return;

                const previewedImages = await Promise.all(
                    imagesNeedPreview.map(async (img) => {
                        try {
                            const r2Url = `${R2_PUBLIC_BASE_URL}/${img.path}`;
                            const response = await fetch(r2Url);
                            const blob = await response.blob();

                            const compressedPreview = await createImagePreview(
                                blob,
                                {
                                    maxWidth: 800,
                                    quality: 0.7,
                                },
                            );

                            return {
                                id: img.id,
                                preview: compressedPreview,
                            };
                        } catch {
                            return {
                                id: img.id,
                                preview: `${R2_PUBLIC_BASE_URL}/${img.path}`,
                            };
                        }
                    }),
                );

                if (!cancelled)
                    setPreviewMap((prev) => {
                        const next = { ...prev };

                        previewedImages.forEach((img) => {
                            if (img.preview) {
                                next[img.id] = img.preview;
                            }
                        });

                        return next;
                    });
            } catch (e) {
                console.error('processImagesFromR2 error', e);
            }
        }

        processImagesFromR2();

        return () => {
            cancelled = true;
        };
    }, [data.images, R2_PUBLIC_BASE_URL]);

    const displayImages = useMemo(() => {
        return data.images.map((img) => ({
            ...img,
            preview: img.preview || previewMap[img.id] || null,
        }));
    }, [data.images, previewMap]);

    const imagesRef = useRef([]);
    const videoUrlRef = useRef(null);

    // Update ref mỗi khi data thay đổi
    useEffect(() => {
        imagesRef.current = displayImages;
        videoUrlRef.current = videoUrl;
    }, [displayImages, videoUrl]);

    // Cleanup chỉ chạy khi unmount
    useEffect(() => {
        return () => {
            imagesRef.current.forEach((img) => {
                const preview = img.preview;
                if (preview?.startsWith('blob:')) {
                    URL.revokeObjectURL(preview);
                }
            });

            if (videoUrlRef.current?.startsWith('blob:')) {
                URL.revokeObjectURL(videoUrlRef.current);
            }
        };
    }, []); // Dependencies rỗng vì dùng ref

    useEffect(() => {
        setPreviewMap((prev) => {
            const validIds = new Set(data.images.map((i) => i.id));
            return Object.fromEntries(
                Object.entries(prev).filter(([id]) => validIds.has(id)),
            );
        });
    }, [data.images]);

    async function handleSelectFiles(e) {
        const files = Array.from(e.target.files);
        let images = [...data.images];
        let videoFile = null;

        // Lọc file ảnh và video
        const imageFiles = files.filter((f) => f.type.startsWith('image/'));
        const videoFiles = files.filter((f) => f.type.startsWith('video/'));

        // Kiểm tra tổng số ảnh
        if (images.length + imageFiles.length > 24) {
            form.setError('images', 'Bạn chỉ có thể tải tối đa 24 ảnh');
            return;
        } else {
            form.clearErrors('images');
        }

        // === THÊM: Bắt đầu loading ===
        if (imageFiles.length > 0) {
            setUploadingImages(true);
            setUploadProgress(0);
            setTotalImagesToUpload(imageFiles.length);
        }

        // Xử lý ảnh song song

        try {
            const processedImages = await uploadWithLimit(
                imageFiles,
                async (file) => {
                    try {
                        if (file.size > 20 * 1024 * 1024) {
                            form.setError(
                                'images',
                                'Ảnh không thể tải lên do quá dung lượng, tối đa 20MB',
                            );
                            return null;
                        }

                        const preview = await createImagePreview(file, {
                            maxWidth: 1280,
                            quality: 0.7,
                        });

                        const res = await axios.post('/r2/presign', {
                            filename: file.name,
                            post_id: data.post_id,
                        });

                        const { upload_url, path } = res.data;

                        const uploadRes = await fetch(upload_url, {
                            method: 'PUT',
                            body: file,
                            headers: { 'Content-Type': file.type },
                        });

                        if (!uploadRes.ok) throw new Error();

                        setUploadProgress((prev) => prev + 1);

                        return {
                            id: crypto.randomUUID(),
                            path,
                            preview,
                            is360: false,
                        };
                    } catch {
                        toast.error(`Upload thất bại: ${file.name}`);
                        return null;
                    }
                },
                3,
            );

            images = [...images, ...processedImages.filter(Boolean)].slice(
                0,
                24,
            );
            setData('images', images);
        } finally {
            if (imageFiles.length > 0) {
                setUploadingImages(false);
                setUploadProgress(0);
                setTotalImagesToUpload(0);
            }
        }

        // Xử lý video (chỉ khi có ít nhất 3 ảnh)
        if (videoFiles.length > 0) {
            if (data.video) {
                toast.error('Mỗi tin chỉ được đăng 1 video');
                return;
            }

            videoFile = videoFiles[0]; // chỉ lấy 1 video đầu tiên
            handleVideoChange(videoFile);
        }

        e.target.value = null;
    }

    // Hàm chặn upload video nếu chưa đủ tối thiểu 3 ảnh
    async function handleVideoChange(file) {
        if (data.images.length < 3) {
            form.setError(
                'video',
                'Vui lòng upload ít nhất 3 ảnh trước khi thêm video',
            );
            return;
        }

        if (file.size > 200 * 1024 * 1024) {
            form.setError(
                'video',
                'Video không thể tải lên do quá dung lượng, tối đa 200MB',
            );
            return;
        }

        validateAndUploadVideo(file);
    }

    // hàm check thời lượng video
    async function validateAndUploadVideo(file) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;

        video.onloadedmetadata = async () => {
            URL.revokeObjectURL(video.src);

            if (data.youtube_url) {
                form.setError(
                    'video',
                    'Bạn đã gắn link YouTube, không thể upload video',
                );
                return;
            }

            if (video.duration < 5) {
                form.setError('video', 'Video phải có độ dài tối thiểu 5 giây');
                return;
            }

            if (video.duration > 120) {
                form.setError('video', 'Không thể tải lên video quá 2 phút');
                return;
            }

            try {
                form.clearErrors('video');

                // xin presigned url
                const res = await axios.post('/r2/presign', {
                    filename: file.name,
                    post_id: data.post_id,
                });

                const { upload_url, path } = res.data;

                // upload video lên R2
                const uploadRes = await fetch(upload_url, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type,
                    },
                });

                if (!uploadRes.ok) {
                    throw new Error('Upload video failed');
                }

                // LƯU PATH vào form
                form.setData('video', path);

                toast.success('Upload video thành công');
            } catch (e) {
                console.error(e);
                toast.error('Không thể upload video');
            }
        };

        video.src = URL.createObjectURL(file);
    }

    const youtubeId = useMemo(
        () => getYoutubeId(data.youtube_url),
        [data.youtube_url],
    );

    // Hàm phân tích url
    function getYoutubeId(url) {
        if (!url) return null;

        const match = url.match(
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
        );
        return match ? match[1] : null;
    }

    // Hàm xóa ảnh
    async function removeImage(id) {
        const image = data.images.find((img) => img.id === id);
        if (!image) return;

        try {
            // Revoke blob URL trước khi xóa
            const preview = image.preview || previewMap[id];
            if (preview?.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }

            await axios.delete('/r2/delete', {
                data: { path: image.path },
            });

            toast.success('Xóa ảnh thành công');

            setData(
                'images',
                data.images.filter((img) => img.id !== id),
            );
        } catch (e) {
            toast.error('Không thể xóa ảnh, vui lòng thử lại');
        }
    }

    // Hàm xóa video
    async function removeVideo() {
        if (!data.video) return;

        try {
            await axios.delete('/r2/delete', {
                data: { path: data.video },
            });

            toast.success('Xóa video thành công');

            setData('video', null);
            form.clearErrors(['video', 'youtube_url']);
        } catch (e) {
            toast.error('Không thể xóa video');
        }
    }

    async function uploadWithLimit(files, handler, limit = 3) {
        const results = [];
        let index = 0;

        async function worker() {
            while (index < files.length) {
                const current = files[index++];
                const result = await handler(current);
                if (result) results.push(result);
            }
        }

        await Promise.all(Array.from({ length: limit }, worker));
        return results;
    }

    return (
        <div className="post-media">
            {/* Header */}
            <div className="post-media__header">
                <span className="post-form__label post-media__title">
                    Hình ảnh & video
                </span>

                {displayImages.length > 0 && (
                    <button
                        className="post-media__edit"
                        type="button"
                        onClick={() => setOpenEdit(true)}
                    >
                        <img src="/icons/edit-pen.svg" alt="edit" />
                        <span>Chỉnh sửa ({displayImages.length})</span>
                    </button>
                )}
            </div>

            {/* Hint */}
            <div
                className={`post-media__hint ${errors?.images ? 'post-form__field--error' : ''}`}
            >
                {errors.images ? (
                    <span
                        className="post-form__field--error-text"
                        style={{
                            marginTop: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            color: '#f01313',
                        }}
                    >
                        <img src="/icons/icon-error.svg" alt="error" />

                        {errors.images}
                    </span>
                ) : (
                    <span
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
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
                                d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12m8-1a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0v-4.5h-.5A.75.75 0 0 1 10 11"
                                clipRule="evenodd"
                            ></path>
                            <rect
                                width="1.25"
                                height="1.25"
                                x="11.375"
                                y="7.375"
                                fill="#0D1011"
                                stroke="#0D1011"
                                strokeWidth=".25"
                                rx=".625"
                            ></rect>
                        </svg>
                        Đăng tối thiểu 3 ảnh
                    </span>
                )}
            </div>

            {displayImages.length > 0 && (
                <div className="post-media__preview">
                    {displayImages[0] && (
                        <ImagePreviewItem
                            key={displayImages[0].id}
                            {...displayImages[0]}
                            index={0}
                            sortable={false}
                            removable={false}
                            show360Badge
                        />
                    )}

                    {data.video && (
                        <div className="post-media__preview-item">
                            {videoUrl && (
                                <>
                                    <span
                                        className="image-cover-badge"
                                        style={{
                                            background: '#e8e8e8',
                                            color: '#000',
                                        }}
                                    >
                                        Video
                                    </span>
                                    <video
                                        src={videoUrl}
                                        preload="metadata"
                                        className="post-media__preview-image"
                                    />
                                </>
                            )}
                        </div>
                    )}

                    {displayImages.slice(1).map((item, index) => (
                        <ImagePreviewItem
                            key={item.id}
                            id={item.id}
                            path={item.path}
                            preview={item.preview}
                            index={index + 1}
                            sortable={false}
                            removable={false}
                            is360={item.is360}
                            show360Badge
                        />
                    ))}
                </div>
            )}

            {uploadingImages && (
                <div
                    style={{
                        marginTop: '12px',
                        textAlign: 'center',
                        color: '#fa3719',
                        fontSize: '1.4rem',
                        padding: '12px 0',
                    }}
                >
                    Đang tải ảnh lên... {uploadProgress} / {totalImagesToUpload}
                    <div
                        style={{
                            marginTop: '8px',
                            width: '100%',
                            height: '6px',
                            background: '#eee',
                            borderRadius: '3px',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                width:
                                    totalImagesToUpload > 0
                                        ? `${(uploadProgress / totalImagesToUpload) * 100}%`
                                        : '0%',
                                height: '100%',
                                background: '#fa3719',
                                transition: 'width 0.3s ease',
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Upload */}
            <div
                className={`post-media__upload ${isDragging ? 'dragging' : ''}`}
                onDragOver={(e) => {
                    e.preventDefault(); // bắt browser không mở file
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDragEnd={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);

                    const files = Array.from(e.dataTransfer.files);
                    handleSelectFiles({ target: { files } }); // tái sử dụng hàm upload hiện có
                }}
            >
                {/* Dropzone */}
                <div className="post-media__dropzone">
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        hidden
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

                {(errorForm?.images || errorForm?.video) && (
                    <span
                        className="post-form__field--error-text"
                        style={{
                            marginTop: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            color: '#f01313',
                            fontSize: '1.4rem',
                        }}
                    >
                        {errorForm.images || errorForm.video}
                    </span>
                )}
            </div>

            {/* Guides */}
            <div className="post-media__guide">
                <div className="post-media__guide-item">
                    <div
                        className="post-media__guide-item01"
                        onClick={() => setOpenImages((pre) => !pre)}
                    >
                        <div className="post-media__guide-item02">
                            <img
                                src="/icons/media-guide.svg"
                                alt="media-guide"
                            />
                            <span>Hướng dẫn đăng ảnh / video</span>
                        </div>

                        <FontAwesomeIcon
                            icon={faChevronDown}
                            className={`dropdown-icon arrow ${openImages ? 'rotate' : ''}`}
                        />
                    </div>

                    {openImages && (
                        <div className="post-media__guide--instruct">
                            <p>
                                Để đảm bảo tải lên hình ảnh hợp lệ cho tin đăng,
                                cần tuân thủ các quy định sau:
                            </p>
                            <p style={{ marginTop: '12px' }}>Hình ảnh:</p>
                            <ul
                                style={{
                                    marginTop: '4px',
                                    lineHeight: '26px',
                                    listStyle: 'disc',
                                    padding: '0 0 0 18px',
                                }}
                            >
                                <li>
                                    Định dạng được hỗ trợ:{' '}
                                    <span style={{ fontWeight: 600 }}>
                                        PNG, JPG, JPEG, GIF, HEIC.
                                    </span>
                                </li>
                                <li>
                                    Đăng{' '}
                                    <span style={{ fontWeight: 600 }}>
                                        tối đa 24 ảnh
                                    </span>{' '}
                                    với tất cả các loại tin.
                                </li>
                                <li>
                                    Mỗi ảnh kích thước{' '}
                                    <span style={{ fontWeight: 600 }}>
                                        tối thiểu 100x100 px
                                    </span>
                                    , dung lượng{' '}
                                    <span style={{ fontWeight: 600 }}>
                                        tối đa 20 MB
                                    </span>
                                    .
                                </li>
                                <li>
                                    Hãy dùng ảnh thật, không trùng, không chèn
                                    SĐT.
                                </li>
                            </ul>

                            <p style={{ marginTop: '12px' }}>Video:</p>
                            <ul
                                style={{
                                    marginTop: '4px',
                                    lineHeight: '26px',
                                    listStyle: 'disc',
                                    padding: '0 0 0 18px',
                                }}
                            >
                                <li>
                                    Định dạng được hỗ trợ:{' '}
                                    <span style={{ fontWeight: 600 }}>
                                        MP4, MOV (H.264 hoặc HEVC).
                                    </span>
                                </li>
                                <li>
                                    Đăng{' '}
                                    <span style={{ fontWeight: 600 }}>
                                        tối đa 1 video
                                    </span>{' '}
                                    cho mỗi tin
                                </li>
                                <li>
                                    Video dung lương{' '}
                                    <span style={{ fontWeight: 600 }}>
                                        tối đa 200 MB
                                    </span>
                                    , thời lượng{' '}
                                    <span style={{ fontWeight: 600 }}>
                                        tối thiểu 5 giây, tối đa 2 phút
                                    </span>
                                    .
                                </li>
                            </ul>

                            <p style={{ marginTop: '12px' }}>
                                Lưu ý: Hãy dùng hình ảnh/video thật về bất động
                                sản, không chèn SĐT.
                            </p>
                        </div>
                    )}
                </div>

                <div className="post-media__guide-item">
                    <div
                        className="post-media__guide-item01"
                        onClick={() => setOpenVideo((pre) => !pre)}
                    >
                        <div className="post-media__guide-item02">
                            <img src="/icons/icon-360.svg" alt="icon-360" />
                            <span>Hướng dẫn đăng ảnh 360°</span>
                        </div>

                        <FontAwesomeIcon
                            icon={faChevronDown}
                            className={`dropdown-icon arrow ${openVideo ? 'rotate' : ''}`}
                        />
                    </div>

                    {openVideo && (
                        <div className="post-media__guide--instruct">
                            <p style={{ lineHeight: '1.42' }}>
                                Ảnh 360° được hỗ trợ bao gồm{' '}
                                <span style={{ fontWeight: 600 }}>
                                    ảnh dạng hình cầu{' '}
                                </span>
                                (Photo Sphere) và{' '}
                                <span style={{ fontWeight: 600 }}>
                                    ảnh toàn cảnh
                                </span>{' '}
                                (Panorama). <br /> Tin đăng có ảnh 360° sẽ được
                                <span style={{ fontWeight: 600 }}>
                                    {' '}
                                    gắn nhãn 360°
                                </span>
                                .
                            </p>
                            <p style={{ marginTop: '12px' }}>
                                Các bước thực hiện:
                            </p>
                            <ul
                                style={{
                                    marginTop: '4px',
                                    lineHeight: '26px',
                                    listStyle: 'decimal ',
                                    padding: '0 0 0 18px',
                                }}
                            >
                                <li>
                                    Chụp ảnh 360° bất động sản của bạn theo một
                                    trong các cách sau:
                                </li>
                                <ul
                                    style={{
                                        marginTop: '4px',
                                        lineHeight: '26px',
                                        listStyle: 'lower-alpha ',
                                        padding: '0 0 0 18px',
                                    }}
                                >
                                    <li>
                                        Sử dụng thiết bị chụp ảnh 360° chuyên
                                        dụng.
                                    </li>
                                    <li>
                                        Sử dụng điện thoại thông minh có chế độ
                                        chụp ảnh toàn cảnh Panorama.
                                    </li>
                                    <li>
                                        Sử dụng điện thoại thông minh có cài đặt
                                        ứng dụng bên thứ 3. (VD: Google Street
                                        View hoặc Cardboard Camera)
                                    </li>
                                </ul>
                                <li>
                                    Tải ảnh lên bằng nút đăng ảnh hoặc kéo thả
                                    ảnh như thông thường.
                                </li>
                                <li>
                                    Đánh dấu vào ô 360° để chọn những ảnh bạn
                                    muốn hiển thị theo chế độ 360°.
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            {/* Video link */}
            <div className="post-media__video">
                <span className="post-form__label--other">Liên kết video</span>
                <div className="post-media__video-link">
                    <textarea
                        className="post-form__input--title"
                        style={{ minHeight: 68 }}
                        placeholder="Dán đường dẫn Youtube"
                        value={data.youtube_url || ''}
                        onChange={(e) => {
                            const value = e.target.value;

                            if (value && data.video) {
                                form.setError(
                                    'youtube_url',
                                    'Bạn đã upload video. Vui lòng xoá video trước khi gắn link YouTube',
                                );
                                return;
                            }

                            form.clearErrors('youtube_url');
                            setData('youtube_url', value);
                        }}
                    />
                </div>
                {errorForm.youtube_url && (
                    <span
                        className="post-form__field--error-text"
                        style={{
                            marginTop: '-8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            color: '#f01313',
                            fontSize: '1.4rem',
                        }}
                    >
                        {errorForm.youtube_url}
                    </span>
                )}
            </div>

            {youtubeId && (
                <div className="post-media__preview" style={{ marginTop: 16 }}>
                    <div className="post-media__youtube">
                        <iframe
                            src={`https://www.youtube.com/embed/${youtubeId}`}
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
                        ref={menuRef}
                    >
                        {/* Header */}
                        <div
                            className="address-panel__header"
                            style={{ paddingTop: 0 }}
                        >
                            <h1 className="address-panel__title">
                                Chỉnh sửa hình ảnh & video (
                                {displayImages.length})
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
                                                        <span
                                                            className="image-cover-badge"
                                                            style={{
                                                                background:
                                                                    '#e8e8e8',
                                                                color: '#000',
                                                            }}
                                                        >
                                                            Video
                                                        </span>

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
                                                                removeVideo();
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
                                        {displayImages.map((item, index) => (
                                            <ImagePreviewItem
                                                key={item.id}
                                                id={item.id}
                                                path={item.path}
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
                                                        toast.error(
                                                            'Tối đa 5 ảnh 360°',
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
