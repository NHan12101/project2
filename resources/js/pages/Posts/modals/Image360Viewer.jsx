import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Image360Viewer({ src }) {
    const mountRef = useRef(null);

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        /* ======================================================
         * 1. LẤY KÍCH THƯỚC CONTAINER (không dùng window)
         * ====================================================== */
        const getSize = () => ({
            width: container.clientWidth,
            height: container.clientHeight,
        });

        let { width, height } = getSize();

        /* ======================================================
         * 2. SCENE
         * Scene rỗng – chỉ chứa sphere panorama
         * ====================================================== */
        const scene = new THREE.Scene();

        /* ======================================================
         * 3. CAMERA
         *
         * FOV:
         * - 50–70  : cong mạnh (mắt cá)
         * - 30–40  : chuẩn panorama
         * - <30    : rất phẳng nhưng dễ “tele”
         *
         * ====================================================== */
        const camera = new THREE.PerspectiveCamera(
            64,
            width / height,
            0.1,
            1000,
        );

        // CỰC KỲ QUAN TRỌNG:
        // Camera LUÔN ở tâm hình cầu
        camera.position.set(0, 0, 0);

        /* ======================================================
         * 4. RENDERER
         * ====================================================== */
        const renderer = new THREE.WebGLRenderer({
            antialias: true, // mượt cạnh
            powerPreference: 'high-performance',
        });

        renderer.setSize(width, height);

        // Giữ pixel ratio <= 2 để:
        // - Ảnh nét
        // - Không giết GPU (nhất là ảnh 8K)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.NoToneMapping;

        container.appendChild(renderer.domElement);

        /* ======================================================
         * 5. SPHERE GEOMETRY (PANORAMA)
         *
         * Radius:
         * - LỚN  → cảm giác cong rõ
         * - NHỎ  → cảm giác phẳng hơn
         *
         * 250–350 là sweet spot
         * ====================================================== */
        const RADIUS = 300;

        const geometry = new THREE.SphereGeometry(
            RADIUS,
            60, // widthSegments (chi tiết ngang)
            40, // heightSegments (chi tiết dọc)
        );

        // Đảo mặt trong để nhìn từ bên trong
        geometry.scale(-1, 1, 1);

        /* ======================================================
         * 6. TEXTURE (ẢNH 360 – 8K)
         * ====================================================== */
        const texture = new THREE.TextureLoader().load(src, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;

            // Anisotropy giúp ảnh sắc khi nhìn chéo
            tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

            // Mipmap giúp chuyển mức zoom mượt
            tex.generateMipmaps = true;
            tex.minFilter = THREE.LinearMipMapLinearFilter;
            tex.magFilter = THREE.LinearFilter;
        });

        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        /* ======================================================
         * 7. BIẾN ĐIỀU KHIỂN (ROTATION STATE)
         * ====================================================== */
        let isDragging = false;

        // Góc hiện tại
        let lon = 0;
        let lat = 0;

        // Góc mục tiêu (để tạo inertia)
        let targetLon = 0;
        let targetLat = 0;

        /* ======================================================
         * 8. THAM SỐ CẢM GIÁC KÉO (CỰC KỲ QUAN TRỌNG)
         *
         * rotateSpeed:
         * - nhỏ → kéo nặng
         * - lớn → xoay nhanh
         *
         * damping:
         * - nhỏ → trôi lâu
         * - lớn → dừng nhanh
         * ====================================================== */
        const rotateSpeed = 0.09;
        const damping = 0.1;

        let prev = { x: 0, y: 0 };

        /* ================= MOUSE EVENTS ================= */

        const onMouseDown = (e) => {
            isDragging = true;
            prev = { x: e.clientX, y: e.clientY };
            container.style.cursor = 'grabbing';
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const dx = e.clientX - prev.x;
            const dy = e.clientY - prev.y;

            // Trái – phải: tự nhiên
            targetLon -= dx * rotateSpeed;

            // Trên – dưới:
            // dấu "-" để kéo xuống thì nhìn lên
            targetLat += dy * rotateSpeed;

            /*
             * Clamp LAT:
             * - Quá rộng → méo cực
             * - Quá chặt → cảm giác bí
             *
             * ±75 là an toàn
             */
            targetLat = THREE.MathUtils.clamp(targetLat, -75, 75);

            prev = { x: e.clientX, y: e.clientY };
        };

        const onMouseUp = () => {
            isDragging = false;
            container.style.cursor = 'grab';
        };

        container.addEventListener('mousedown', onMouseDown);
        container.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        /* ======================================================
         * 9. ANIMATION LOOP
         *
         * KHÔNG di chuyển camera
         * Chỉ xoay hướng nhìn (lookAt)
         * ====================================================== */
        let rafId;

        const autoRotateSpeed = 0.02; // tốc độ tự động xoay khi không kéo

        const animate = () => {
            // Nếu không kéo → tự xoay
            if (!isDragging) {
                targetLon += autoRotateSpeed; // tự xoay qua phải
            }

            // Inertia
            lon += (targetLon - lon) * damping;
            lat += (targetLat - lat) * damping;

            const phi = THREE.MathUtils.degToRad(90 - lat);
            const theta = THREE.MathUtils.degToRad(lon);

            const x = Math.sin(phi) * Math.cos(theta);
            const y = Math.cos(phi);
            const z = Math.sin(phi) * Math.sin(theta);

            camera.lookAt(x, y, z);
            renderer.render(scene, camera);

            rafId = requestAnimationFrame(animate);
        };

        animate();

        /* ======================================================
         * 10. RESIZE
         * ====================================================== */
        const onResize = () => {
            const size = getSize();
            width = size.width;
            height = size.height;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', onResize);

        /* ======================================================
         * 11. CLEANUP
         * ====================================================== */
        return () => {
            cancelAnimationFrame(rafId);

            window.removeEventListener('resize', onResize);
            window.removeEventListener('mouseup', onMouseUp);

            container.removeEventListener('mousedown', onMouseDown);
            container.removeEventListener('mousemove', onMouseMove);

            geometry.dispose();
            material.dispose();
            texture.dispose();
            renderer.dispose();

            if (renderer.domElement.parentNode) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [src]);

    return (
        <div
            ref={mountRef}
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                cursor: 'grab',
            }}
        />
    );
}
