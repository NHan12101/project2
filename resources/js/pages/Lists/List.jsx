import { usePage } from '@inertiajs/react';
import Card from '../components/Main-content/cards/Card.jsx'

export default function List() {
    const { posts } = usePage().props;
    console.log(posts)
    return <Card post={posts} />;
}
