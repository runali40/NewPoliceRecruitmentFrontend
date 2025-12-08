class TokenStorage {
    constructor() {
      this.tokens = {
        accessToken: null,
        refreshToken: null,
      };
    }
  
    setTokens(accessToken, refreshToken) {
      this.tokens.accessToken = accessToken;
      this.tokens.refreshToken = refreshToken;
    }
  
    getAccessToken() {
      return this.tokens.accessToken;
    }
  
    getRefreshToken() {
      return this.tokens.refreshToken;
    }
  
    clearTokens() {
      this.tokens.accessToken = null;
      this.tokens.refreshToken = null;
    }
  }
  
  export const tokenStorage = new TokenStorage();
  