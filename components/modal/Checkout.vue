<template>
  <div :class="[openModal ? 'is-active' : '', 'modal']">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ modalTitle }}</p>
        <button
          class="delete"
          aria-label="close"
          @click="closeModal(false)"
        ></button>
      </header>
      <section class="modal-card-body">
        <div v-if="!isCheckoutSection">
          <div
            class="box"
            v-for="cartItem in cartItems"
            :key="cartItem.product.id"
          >
            <button
              class="is-pulled-right button is-info is-inverted"
              @click="removeFromCart(cartItem.product.id)"
            >
              {{ removeLabel }}
            </button>
            <p>
              {{ cartItem.product.name }}
              {{
                cartItem.quantity > 0 ? ` - Quantity: ${cartItem.quantity}` : ""
              }}
            </p>
            <p>{{ cartItem.product.price }} &euro;</p>
          </div>
          <div v-if="cartItems.length === 0">
            <p>{{ cartEmptyLabel }}</p>
          </div>
        </div>
        <div v-if="isCheckoutSection">
          <p>You bought it :-)</p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button
          v-show="cartItems.length > 0 && !isCheckoutSection"
          class="button is-success"
          @click="onNextBtn"
        >
          {{ buyLabel }}
        </button>
        <button
          v-if="isCheckoutSection"
          class="button is-success"
          @click="closeModal(true)"
        >
          {{ closeLabel }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "checkout",

  data() {
    return {
      modalTitle: "Checkout",
      removeLabel: "Remove",
      cartEmptyLabel: "Your cart is empty",
      closeLabel: "Close",
      isCheckoutSection: false
    };
  },

  computed: {
    cartItems() {
      return this.$store.getters.productsAdded;
    },
    openModal() {
      if (this.$store.getters.isCheckoutModalOpen) {
        return true;
      } else {
        return false;
      }
    },
    buyLabel() {
      let totalProducts = 0;
      this.cartItems.forEach(item => (totalProducts += item.quantity));

      let productsAdded = this.$store.getters.productsAdded,
        pricesArray = [],
        productLabel = "",
        finalPrice = "",
        quantity = 1;

      productsAdded.forEach(product => {
        if (product.quantity >= 1) {
          quantity = product.quantity;
        }

        pricesArray.push(product.product.price * quantity); // get the price of every product added and multiply quantity
      });

      finalPrice = pricesArray.reduce((a, b) => a + b, 0); // sum the prices

      if (totalProducts > 1) {
        // set plural or singular
        productLabel = "cartItems";
      } else {
        productLabel = "product";
      }
      return `Buy ${totalProducts} ${productLabel} at ${finalPrice}€`;
    },
    isUserLoggedIn() {
      return this.$store.getters.isUserLoggedIn;
    }
  },

  methods: {
    closeModal(reloadPage) {
      this.$store.commit("showCheckoutModal", false);

      if (reloadPage) {
        window.location.reload();
      }
    },
    removeFromCart(id) {
      let data = {
        id: id,
        status: false
      };
      this.$store.commit("removeFromCart", id);
    },
    onNextBtn() {
      if (this.isUserLoggedIn) {
        this.isCheckoutSection = true;
      } else {
        this.$store.commit("showCheckoutModal", false);
        this.$store.commit("showLoginModal", true);
      }
    },
    onPrevBtn() {
      this.isCheckoutSection = false;
    }
  }
};
</script>
