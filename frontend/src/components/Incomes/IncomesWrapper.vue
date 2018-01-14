<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <h2>Incomes for {{ currentDate }}</h2>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: "IncomesWrapper",
    props: ["month", "year", "currentDate"]
  };
</script>

<style scoped>

</style>