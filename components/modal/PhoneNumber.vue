<template>
  <div :class="[openModal ? 'is-active' : '', 'modal']">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ modalTitle }}</p>
        <button class="delete" aria-label="close" @click="closeModal(false)"></button>
      </header>
      <section class="modal-card-body">
        <div class="field" v-if="!isOrderCompleted">
          <p class="control has-icons-left has-icons-right">
            <input
              class="input"
              type="tel"
              placeholder="01722273000"
              v-model="phoneNumber"
              :class="[
                    highlightPhoneNumberWithError ? 'input is-danger' : 'input'
                  ]"
              @keyup="checkPhoneNumberOnKeyUp(phoneNumber)"
            />
            <span class="icon is-small is-left">
              <i class="fa fa-phone"></i>
            </span>
            <span v-if="highlightPhoneNumberWithError !== null" class="icon is-small is-right">
              <i
                :class="[
                      highlightPhoneNumberWithError
                        ? 'fa fa-exclamation-circle'
                        : 'fa fa-check'
                    ]"
              ></i>
            </span>
          </p>
          <p
            v-if="highlightPhoneNumberWithError"
            class="help is-danger"
          >{{ phoneNumberRequiredLabel }}</p>
        </div>
        <div v-else>
          <p>You bought it :-)</p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button
          class="button is-success"
          v-if="!isOrderCompleted"
          @click="orderNow()"
        >{{ buyLabel }}</button>
        <button class="button is-success" v-else @click="closeModal(true)">{{ closeLabel }}</button>
      </footer>
    </div>
  </div>
</template>

<script>
import { isValidPhoneNumber } from "@/assets/validators";
export default {
  name: "PhoneNumber",

  data() {
    return {
      modalTitle: "Your Phone Number",
      closeLabel: "Close",
      buyLabel: "Buy Now",
      phoneNumber: "",
      phoneNumberRequiredLabel: "Phone Number required",
      emailNotValidLabel: "Valid phone number required",
      highlightPhoneNumberWithError: null,

      isOrderCompleted: false,
    };
  },

  computed: {
    isUserLoggedIn() {
      return this.$store.getters.isUserLoggedIn;
    },
    openModal() {
      if (this.$store.getters.isPhoneNumberModalOpen) {
        return true;
      } else {
        return false;
      }
    },
  },

  methods: {
    checkPhoneNumberOnKeyUp(phoneNumber) {
      if (phoneNumber && isValidPhoneNumber(phoneNumber)) {
        this.highlightPhoneNumberWithError = false;
      } else {
        this.highlightPhoneNumberWithError = true;

        if (!isValidPhoneNumber(phoneNumber)) {
          this.phoneNumberRequiredLabel = this.emailNotValidLabel;
        }
      }
    },
    orderNow() {
      this.isOrderCompleted = true;
    },
    closeModal(reloadPage) {
      this.$store.commit("showPhoneNumberModal", false);

      if (reloadPage) {
        window.location.reload();
      }
    },
  },
};
</script>
