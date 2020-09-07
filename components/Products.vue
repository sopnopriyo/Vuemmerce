<template>
  <div>
    <div class="card-image">
      <figure class="image is-4by3">
        <img :src="product.pictureUrl" alt="Placeholder image" />
      </figure>
    </div>
    <div class="card-content">
      <div class="content">
        <h5 class="product-name">
          {{ product.name }}
        </h5>

        <div class="content is-clearfix">
          <p>
            <span class=" product-price ">
              <strong class="has-text-primary">Tk {{ product.price }}</strong>
            </span>
          </p>
        </div>
      </div>
      <div class="card-footer btn-actions">
        <div class="card-footer-item field is-grouped">
          <div class="select is-rounded">
            <select v-model="selected">
              <option v-for="quantity in quantityArray" :value="quantity">{{
                quantity
              }}</option>
            </select>
          </div>
          <div class="buttons">
            <button
              class="button is-primary"
              v-if="
                cartItems.filter(item => item.product.id === product.id)
                  .length === 0
              "
              @click="addToCart(product.id)"
            >
              {{ addToCartLabel }}
            </button>
            <button
              class="button is-text"
              v-if="
                cartItems.filter(item => item.product.id === product.id)
                  .length !== 0
              "
              @click="removeFromCart(product.id, false)"
            >
              {{ removeFromCartLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- <nuxt-link
      class="details"
      :to="{
        name: 'product_detail-id',
        params: {
          id: product.id,
          title: product.title,
          price: product.price,
          rating: product.ratings,
          reviews: product.reviews,
          isAddedBtn: product.isAddedBtn
        }
      }"
    ></nuxt-link> -->
  </div>
</template>

<script>
export default {
  name: "products",
  props: ["product"],

  data() {
    return {
      addToCartLabel: "Add to cart",
      viewDetailsLabel: "Details",
      removeFromCartLabel: "Remove from cart",
      selected: 1,
      quantityArray: []
    };
  },

  mounted() {
    for (let i = 1; i <= 5; i++) {
      this.quantityArray.push(i);
    }

    if (this.$props.product.quantity > 1) {
      this.selected = this.$props.product.quantity;
    }
  },

  computed: {
    isUserLogged() {
      return this.$store.getters.isUserLoggedIn;
    },
    cartItems() {
      return this.$store.getters.getCartItems;
    }
  },

  methods: {
    addToCart(id) {
      let data = {
        id: id,
        quantity: this.selected
      };
      this.$store.commit("addToCart", data);
    },
    removeFromCart(id) {
      let data = {
        id: id,
        status: false
      };
      this.$store.commit("removeFromCart", id);
    },
    saveToFavorite(id) {
      let isUserLogged = this.$store.state.userInfo.isLoggedIn;

      if (isUserLogged) {
        this.$store.commit("addToFavourite", id);
      } else {
        this.$store.commit("showLoginModal", true);
      }
    },
    removeFromFavourite(id) {
      this.$store.commit("removeFromFavourite", id);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "bulma/sass/utilities/mixins.sass";

.details {
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;

  &:hover {
    border: 1px solid #51bafc;
  }
}
.button,
.select {
  @include mobile {
    font-size: 12px;
  }
}

.card-content {
  padding: 0;
}
.buttons {
  margin: 0;
}

.card-footer-item {
  align-items: end;
  justify-content: space-between;
}

.product-name,
.product-price {
  padding-left: 5px;
}
.product-name {
  font-size: 14px;
}

.product-price {
  font-size: 18px;
}
</style>
