<template>
  <div>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs6>
          <v-btn @click="goToPreviousMonth"><<< {{ getMonthYear(-1) }} </v-btn>
        </v-flex>
        <v-flex xs6>
          <v-btn v-if="!isFuture(getMonthYear(1))" @click="goToNextMonth">{{ getMonthYear(1) }} >>></v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <v-tabs fixed centered v-model="tabActive">
      <v-tabs-bar class="blue" dark>
        <v-tabs-item
            ripple
            key="expenses"
            href="#expenses"
        >
          Expenses
        </v-tabs-item>
        <v-tabs-item
            ripple
            key="incomes"
            href="#incomes"
        >
          Incomes
        </v-tabs-item>
        <v-tabs-slider color="yellow"></v-tabs-slider>
      </v-tabs-bar>
      <v-tabs-items>
        <v-tabs-content id="expenses" key="expenses">
          <expenses-wrapper
              :month="currentMonth"
              :year="currentYear"
              :currentDate="currentDateVerbose"
          ></expenses-wrapper>
        </v-tabs-content>
        <v-tabs-content id="incomes" key="incomes">
          <incomes-wrapper
              :month="currentMonth"
              :year="currentYear"
              :currentDate="currentDateVerbose"
          ></incomes-wrapper>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>

<script>
  import moment from "moment";
  import ExpensesWrapper from "./Expenses/ExpensesWrapper";
  import IncomesWrapper from "./Incomes/IncomesWrapper";

  const dateFormat = "MM-YYYY";

  export default {
    name: "Dashboard",
    components: {
      ExpensesWrapper,
      IncomesWrapper
    },
    data () {
      return {
        tabActive: "expenses"
      };
    },
    mounted () {
      const self = this;
      if (!self.$route.query.date) {
        self.$router.push({
          name: "Dashboard",
          query: {
            date: self.getMonthYear()
          }
        });
      }
    },
    computed: {
      currentDate () {
        const self = this;
        if (self.$route.query.date) {
          return moment(self.$route.query.date, dateFormat);
        } else {
          return moment();
        }
      },
      currentDateVerbose () {
        return this.currentDate.format(dateFormat);
      },
      currentMonth () {
        const self = this;
        return parseInt(self.currentDate.format("MM"));
      },
      currentYear () {
        const self = this;
        return parseInt(self.currentDate.format("YYYY"));
      }
    },
    methods: {
      getMonthYear (offsetMonths = 0) {
        return moment(this.currentDate).add(offsetMonths, "months").format(dateFormat);
      },
      goToPreviousMonth () {
        const self = this;
        self.$router.push({
          name: "Dashboard",
          query: {
            date: self.getMonthYear(-1)
          }
        });
      },
      goToNextMonth () {
        const self = this;
        self.$router.push({
          name: "Dashboard",
          query: {
            date: self.getMonthYear(1)
          }
        });
      },
      isFuture (monthDate) {
        const date = moment(monthDate, dateFormat);
        return date > moment();
      }
    }
  };
</script>

<style scoped>

</style>