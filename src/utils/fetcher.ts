// exportconst fetcher = (...args) => fetch(...args).then(res => res.json())

// create fetcher with baseUrl https://wsitestserver.fly.dev/api/

const baseUrl = 'https://wsitestserver.fly.dev/api';

import ky from 'ky';

export const fetcher = ky.create({prefixUrl: baseUrl, timeout: 10000});
