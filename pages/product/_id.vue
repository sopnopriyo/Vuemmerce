<template>
  <div class="section">
    <div class="card is-clearfix columns">
      <figure class="card-image is-480x480 column is-one-thirds">
        <img :src="product.pictureUrl" />
      </figure>
      <div class="card-content column is-two-thirds">
        <div class="card-content__title">
          <h2 class="title is-4">
            {{ product.name }}
          </h2>
        </div>
        <div class="card-content__text">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud
          </p>
        </div>

        <div class="select is-rounded is-small is-pulled-right">
          <select @change="onSelectQuantity(product.id)" v-model="selected">
            <option v-for="quantity in quantityArray" :value="quantity">{{
              quantity
            }}</option>
          </select>
        </div>
      </div>
      <div class="card-content__price is-pulled-left">
        <span class="title is-3">
          <strong>{{ product.price }}&euro;</strong>
        </span>
      </div>
      <div class="card-content__btn is-pulled-right">
        <button
          class="button is-primary"
          v-if="!isAddedBtn"
          @click="addToCart(product.id)"
        >
          {{ addToCartLabel }}
        </button>
        <button
          class="button is-text"
          v-if="isAddedBtn"
          @click="removeFromCart(product.id)"
        >
          {{ removeFromCartLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "product_detail-id",

  validate({ params }) {
    return /^\d+$/.test(params.id);
  },

  data() {
    return {
      addToCartLabel: "Add to cart",
      removeFromCartLabel: "Remove from cart",
      selected: 1,
      quantityArray: []
    };
  },

  async fetch({ store, params }) {
    await store.dispatch("fetchProductById", params.id);
  },
  mounted() {
    this.selected = 1;

    for (let i = 1; i <= 5; i++) {
      this.quantityArray.push(i);
    }
  },

  computed: {
    isAddedBtn() {
      return this.product.isAddedBtn;
    },
    product() {
      return this.$store.getters.getProductById;
    }
  },

  methods: {
    addToCart(id) {
      let data = {
        id: id,
        status: true
      };
      this.$store.commit("addToCart", id);
    },
    removeFromCart(id) {
      let data = {
        id: id,
        status: false
      };
      this.$store.commit("removeFromCart", id);
    },
    onSelectQuantity(id) {
      let data = {
        id: id,
        quantity: this.selected
      };
      this.$store.commit("quantity", data);
    }
  }
};
</script>

<style lang="scss" scoped>
.card-content {
  padding: 15px 10px 15px 0;

  &__text {
    margin: 15px 0;
  }
  &__reviews {
    display: inline-block;
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
