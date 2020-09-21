<template>
  <div :class="[openModal ? 'is-active' : '', 'modal']">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ modalTitle }}</p>
        <button class="delete" aria-label="close" @click="closeModal(false)"></button>
      </header>
      <section class="modal-card-body">
        <div v-if="!isOrderCompleted">
          <div class="field">
            <p class="control has-icons-left has-icons-right">
              <input
                class="input"
                type="tel"
                placeholder="01722273000"
                v-model="form.phoneNumber"
                :class="[
                    highlightPhoneNumberWithError ? 'input is-danger' : 'input'
                  ]"
                @keyup="checkPhoneNumberOnKeyUp(form.phoneNumber)"
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
          <div class="field">
            <div class="control has-icons-left">
              <div class="select is-fullwidth">
                <select v-model="form.location">
                  <option disabled value>Select your location</option>
                  <option v-for="location in locationList" :key="location">{{location}}</option>
                </select>
              </div>
              <div class="icon is-small is-left">
                <i class="fa fa-globe"></i>
              </div>
            </div>
            <p class="help is-danger" v-if="!isLocationValid">{{ locationRequiredLabel }}</p>
          </div>
        </div>

        <div v-else>
          <img src="/order-completed.png" alt srcset />
          <p>{{finalOrderMessage}}</p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button
          class="button is-success"
          :disabled="!isSubmitDisabled()"
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
      buyLabel: "Order Now",
      form: {
        phoneNumber: "",
        location: "",
      },
      locationList: ["Bamundi", "Kallanpur", "Karamdi"],
      phoneNumberRequiredLabel: "Phone Number required",
      locationRequiredLabel: "Location is required",
      emailNotValidLabel: "Valid phone number required",
      highlightPhoneNumberWithError: null,
      finalOrderMessage: "",
      isOrderCompleted: false,
    };
  },

  computed: {
    isUserLoggedIn() {
      return this.$store.getters.isUserLoggedIn;
    },
    isLocationValid() {
      return this.form.location != "";
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
    isSubmitDisabled() {
      return isValidPhoneNumber(this.form.phoneNumber) && this.isLocationValid;
    },
    orderNow() {
      if (!this.form.location) {
        this.isLocationValid = false;
        return;
      }
      this.$store
        .dispatch("placeOrder", this.phoneNumber)
        .then((data) => {
          this.finalOrderMessage =
            "Your order has been created successfully. Our customer service will call you at :" +
            this.form.phoneNumber;
          this.isOrderCompleted = true;
        })
        .catch((errors) => {
          this.finalOrderMessage =
            "Sorry, our server is down now. Please contact : 01722273000";
          this.isOrderCompleted = true;

          console.log("error happend");
        });
    },
    closeModal(reloadPage) {
      this.$store.commit("showPhoneNumberModal", false);
      this.finalOrderMessage = "";
      if (reloadPage) {
        window.location.reload();
      }
    },
  },
};
</script>
