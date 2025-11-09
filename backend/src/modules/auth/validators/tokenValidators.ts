export const isTokenExpired = (expiration?: Date | null) => {
  if (!expiration) {
    return false;
  }

  return new Date() > expiration;
};
