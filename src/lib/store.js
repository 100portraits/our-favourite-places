// src/lib/store.js
import { writable } from 'svelte/store';
import Cookies from 'js-cookie';

// Read initial value from cookie
const initialValue = Cookies.get('welcomed') === 'true';

// Create a writable store for welcomed
export const welcomed = writable(initialValue);

// Subscribe to changes in welcomed
welcomed.subscribe(value => {
    Cookies.set('welcomed', value, { expires: 365 }); // Cookie will expire after 365 days
});

//markers
export const markers = writable([]);