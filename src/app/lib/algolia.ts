import algoliasearch from 'algoliasearch/lite';

// إعداد بيانات Algolia
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID as string;
const ALGOLIA_SEARCH_ONLY_API_KEY = process.env.ALGOLIA_SEARCH_ONLY_API_KEY as string;
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME as string;

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_ONLY_API_KEY);
const index = client.initIndex(ALGOLIA_INDEX_NAME);

export { index };
