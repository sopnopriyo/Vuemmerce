<template>
  <div class="hero is-medium is-bold is-primary">
    <div class="hero-body">
      <div class="container has-text-centered">
        <h1 class="title is-size-4-mobile">
          ঘরে বসে অনলাইন থেকে প্রোডাক্টস কিনুন সহজেই
        </h1>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "bulma/sass/utilities/mixins.sass";

.hero {
  @include desktop {
    background-repeat: round;
  }
}
.title {
  color: $black;
  text-align: center;

  @include mobile {
    padding-top: 20px;
  }
}
</style>
