<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    let token = this.$route.query.token;
    this.$store
      .dispatch("loginByToken", token)
      .then(resp => {
        console.log("Login successful");
        this.$router.push("/");
      })
      .catch(error => {
        console.log("Login failed");
      });
  }
};
</script>

<style></style>
