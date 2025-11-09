import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { translations } from './translations';

const DEFAULT_LOCALE = 'es';

const I18nContext = createContext({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key) => key,
});

const interpolate = (template, params) =>
  template.replace(/{{(.*?)}}/g, (_, key) => {
    const trimmedKey = key.trim();
    return Object.prototype.hasOwnProperty.call(params, trimmedKey)
      ? params[trimmedKey]
      : `{{${trimmedKey}}}`;
  });

const getTranslation = (locale, key) => {
  const dictionary = translations[locale];
  const fallback = translations[DEFAULT_LOCALE];

  const resolve = (source) => {
    if (!source) return undefined;
    return key.split('.').reduce((acc, part) => {
      if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
        return acc[part];
      }
      return undefined;
    }, source);
  };

  return resolve(dictionary) ?? resolve(fallback);
};

export const I18nProvider = ({ children, defaultLocale = DEFAULT_LOCALE }) => {
  const [locale, setLocale] = useState(defaultLocale);

  const translate = useCallback(
    (key, params = {}) => {
      const result = getTranslation(locale, key);
      if (typeof result === 'string') {
        return interpolate(result, params);
      }
      if (result !== undefined) {
        return result;
      }
      return interpolate(key, params);
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: translate,
    }),
    [locale, translate]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);


