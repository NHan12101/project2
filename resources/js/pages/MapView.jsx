import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';

mapboxgl.accessToken =
    'pk.eyJ1Ijoibmhhbm5lIiwiYSI6ImNtaXk1Yms2bjBibGwzY3E1OWRpMG4xaHgifQ.8Ta030RINviImIseGflo3A';

export default function MapView({ lng, lat, zoom = 17 }) {
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/nhanne/cmiy82pr7000o01r451t776tu',

            center: [lng, lat],
            zoom: zoom,
        });

        // Add marker
        const marker = new mapboxgl.Marker({ color: '#ff4d4f'})
            .setLngLat([lng, lat])
            .setPopup(
                new mapboxgl.Popup().setHTML(
                    `<strong>Vị trí bài đăng</strong><br/>(${lat}, ${lng})`,
                ),
            )
            .addTo(map.current);

        return () => map.current.remove();
    }, []);

    return (
        <div
            ref={mapContainer}
            style={{
                width: '100%',
                height: '452px',
                overflow: 'hidden',
            }}
        ></div>
    );
}
