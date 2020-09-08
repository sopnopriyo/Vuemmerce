const cookieparser = process.server ? require("cookieparser") : undefined;
const Cookie = process.client ? require("js-cookie") : undefined;

export const state = () => ({
  products: [],
  product: {},
  userInfo: {
    isLoggedIn: false,
    isSignedUp: false,
    hasSearched: false,
    name: "",
    productTitleSearched: ""
  },
  auth: null,
  authUser: {},
  systemInfo: {
    openLoginModal: false,
    openSignupModal: false,
    openCheckoutModal: false
  },
  cartItems: []
});

export const getters = {
  productsAdded: state => {
    return state.cartItems;
  },
  getCartItems: state => {
    return state.cartItems;
  },
  productsAddedToFavourite: state => {
    return state.products.filter(el => {
      return el.isFavourite;
    });
  },
  getProductById: state => {
    return state.product;
  },
  isUserLoggedIn: state => {
    return state.userInfo.isLoggedIn;
  },
  isUserSignedUp: state => {
    return state.userInfo.isSignedUp;
  },
  getUserName: state => {
    return state.authUser && state.authUser.name;
  },
  isLoginModalOpen: state => {
    return state.systemInfo.openLoginModal;
  },
  isSignupModalOpen: state => {
    return state.systemInfo.openSignupModal;
  },
  isCheckoutModalOpen: state => {
    return state.systemInfo.openCheckoutModal;
  },
  quantity: state => {
    return state.products.quantity;
  }
};

export const mutations = {
  addToCart: (state, data) => {
    state.products.forEach(product => {
      if (data.id === product.id) {
        const cartItem = {
          product,
          quantity: data.quantity
        };
        state.cartItems.push(cartItem);
      }
    });
  },
  removeFromCart: (state, id) => {
    state.cartItems.splice(
      state.cartItems.findIndex(function(i) {
        return i.product.id === id;
      }),
      1
    );
  },
  isUserLoggedIn: (state, isUserLoggedIn) => {
    state.userInfo.isLoggedIn = isUserLoggedIn;
  },
  isUserSignedUp: (state, isSignedUp) => {
    state.userInfo.isSignedUp = isSignedUp;
  },
  setHasUserSearched: (state, hasSearched) => {
    state.userInfo.hasSearched = hasSearched;
  },
  setUserName: (state, name) => {
    state.userInfo.name = name;
  },
  setAuth(state, auth) {
    state.auth = auth;
  },
  setProductTitleSearched: (state, titleSearched) => {
    state.userInfo.productTitleSearched = titleSearched;
  },
  showLoginModal: (state, show) => {
    state.systemInfo.openLoginModal = show;
  },
  showSignupModal: (state, show) => {
    state.systemInfo.openSignupModal = show;
  },
  showCheckoutModal: (state, show) => {
    state.systemInfo.openCheckoutModal = show;
  },

  quantity: (state, data) => {
    state.cartItems.forEach(el => {
      if (data.id === el.id) {
        el.quantity = data.quantity;
      }
    });
  },
  SET_USER(state, authUser) {
    state.authUser = authUser;
  },
  SET_PRODUCTS(state, products) {
    state.products = products;
  },
  SET_PRODUCT(state, product) {
    state.product = product;
  }
};

export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie);
      try {
        this.$axios.setToken(parsed.auth, "Bearer");
        const res = await this.$axios.get("/api/account");

        if (res && res.data) {
          commit("SET_USER", res.data);
          commit("setAuth", parsed.auth);
          commit("isUserLoggedIn", true);
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  async fetchProducts({ commit }, itemType) {
    const res = await this.$axios.get("/api/products");

    if (res && res.data && res.data.content) {
      commit("SET_PRODUCTS", res.data.content);
    }
  },
  async fetchProductById({ commit }, productId) {
    const res = await this.$axios.get("/api/products/" + productId);

    if (res && res.data) {
      commit("SET_PRODUCT", res.data);
    }
  },
  login({ commit }, credentials) {
    return new Promise((resolve, reject) => {
      return this.$axios
        .post("/api/login", credentials)
        .then(response => {
          const { accessToken } = response.data;
          commit("isUserLoggedIn", true);
          Cookie.set("auth", accessToken);
          commit("setAuth", accessToken);

          this.$axios.setToken(accessToken, "Bearer");
          return this.$axios.get("/api/account");
        })
        .then(res => {
          if (res && res.data) {
            commit("SET_USER", res.data);
          }
          resolve(res.data);
        })
        .catch(error => {
          commit("isUserLoggedIn", false);
          console.log(error);
          reject(error);
        });
    });
  },

  loginByToken({ commit }, token) {
    return new Promise((resolve, reject) => {
      this.$axios.setToken(token, "Bearer");
      return this.$axios
        .get("/api/account")
        .then(res => {
          if (res && res.data) {
            commit("SET_USER", res.data);
            commit("isUserLoggedIn", true);
            commit("setAuth", token);
          }
          resolve(res.data);
        })
        .catch(error => {
          commit("isUserLoggedIn", false);
          commit("setAuth", null);
          console.log(error);
          reject(error);
        });
    });
  },

  async logout({ commit }) {
    const { data } = await this.$axios.get("/api/logout");
    if (data.ok) commit("SET_USER", null);
  }
};
