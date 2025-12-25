import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from 'react';

mapboxgl.accessToken =
    'pk.eyJ1Ijoibmhhbm5lIiwiYSI6ImNtaXk1Yms2bjBibGwzY3E1OWRpMG4xaHgifQ.8Ta030RINviImIseGflo3A';

export default function MapView({
    lat,
    lng,
    zoom = 17,
    draggable = false,
    onChange, // callback trả lat/lng
}) {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    // Init map
    useEffect(() => {
        if (mapRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom,
        });

        markerRef.current = new mapboxgl.Marker({
            color: '#ff4d4f',
            draggable,
        })
            .setLngLat([lng, lat])
            .addTo(mapRef.current);

        if (draggable && onChange) {
            markerRef.current.on('dragend', () => {
                const { lng, lat } = markerRef.current.getLngLat();
                onChange({ lat, lng });
            });
        }

        return () => mapRef.current?.remove();
    }, []);

    // Update center when lat/lng change (flyTo)
    useEffect(() => {
        if (!mapRef.current || !markerRef.current) return;

        mapRef.current.flyTo({
            center: [lng, lat],
            zoom,
            speed: 1.2,
        });

        markerRef.current.setLngLat([lng, lat]);
    }, [lat, lng]);

    return (
        <div
            ref={mapContainer}
            style={{
                width: '100%',
                height: '450px',
                borderRadius: '8px',
                overflow: 'hidden',
            }}
        />
    );
}
