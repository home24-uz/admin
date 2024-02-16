<template>
  <div>
    <div v-for="(product, index) in products" :key="product.id">
      <a-select v-for="(option, optionIndex) in optionsList" :key="optionIndex" v-model="product.artibuts[optionIndex]" @change="checkCombinations">
        <a-select-option v-for="d in option" :key="d.id" :value="d?.id" :disabled="isOptionDisabled(product, optionIndex, d.id)">
          {{ d?.name }}
        </a-select-option>
      </a-select>
    </div>
    <button @click="addProduct">Create</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [
        {
          artibuts: [],
          id: 1,
        },
      ],
      options: [
        [
          { name: "name1", id: 1 },
          { name: "name2", id: 2 },
        ],
        [
          { name: "name11", id: 11 },
          { name: "name12", id: 12 },
        ],
      ],
      allCombinations: [],
    };
  },
  computed: {
    optionsList() {
      return this.options.slice(0, this.products[0].artibuts.length + 1);
    },
  },
  methods: {
    generateAllCombinations(index = 0, currentCombination = []) {
      if (index === this.options.length) {
        this.allCombinations.push([...currentCombination]);
        return;
      }

      for (const option of this.options[index]) {
        currentCombination[index] = option.id;
        this.generateAllCombinations(index + 1, [...currentCombination]);
      }
    },
    isOptionDisabled(product, optionIndex, optionId) {
  if (optionIndex > 0) {
    const currentCombination = [...product.artibuts];
    currentCombination[optionIndex] = optionId;

    // Check if the current combination is already chosen
    return (
      !this.allCombinations.some(
        (combination) =>
          combination.length === currentCombination.length &&
          combination.every((value, index) => value === currentCombination[index])
      ) ||
      product.artibuts.some((value, index) => index !== optionIndex && value === optionId)
    );
  }
  return false;
},

    checkCombinations() {
      this.allCombinations = [];
      this.generateAllCombinations();
      console.log('All Combinations:', this.allCombinations);
    },
    addProduct() {
      this.products.push({
        artibuts: [],
        id: this.products.length + 2,
      });
    },
  },
  created() {
    this.generateAllCombinations();
  },
};
</script>



<style lang="css">
.ant-select-selection--single {
  width: 200px;
}
</style>
