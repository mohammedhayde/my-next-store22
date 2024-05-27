export async function fetchCategoryName(url: string | URL | Request) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    return await response.json();
}
