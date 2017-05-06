import {configure, setLocale} from "i18n";
import {resolve} from "path";

const i18n: i18nAPI = <any> {};
configure(<any>{
	locales: ['en', 'cn'],
	register: i18n,
	directory: resolve(__dirname, '../../locales'),
	syncFiles: true,
	updateFiles: true,
});

const L = process.env.LANG || 'en';
const match = /^[a-z]+/i.exec(L);
setLocale(match[0]);

export const __ = i18n.__;
export const __n = i18n.__n;
export const __l = i18n['__l'];
export const __h = i18n['__h'];
export const __mf = i18n['__mf'];
export const getLocale = i18n.getLocale;
export const getCatalog = i18n.getCatalog;
export const getLocales = i18n['getLocales'];
export const addLocale = i18n['addLocale'];
export const removeLocale = i18n['removeLocale'];
export const locale = i18n.locale;
