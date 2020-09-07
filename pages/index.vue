<template>
  <div class="root">
    <VmHero></VmHero>
    <div class="container">
      <VmProductsList></VmProductsList>
    </div>
  </div>
</template>

<script>
import VmProductsList from "@/components/products_list/ProductsListContainer";
import VmHero from "@/components/hero/Hero";

export default {
  name: "index",
  components: {
    VmProductsList,
    VmHero
  },
  async fetch({ store, params }) {
    await store.dispatch("fetchProducts");
  }
};
</script>

<style lang="scss" scoped>
.root {
  background: #f5f5f5;
}
</style>
