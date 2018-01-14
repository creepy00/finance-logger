<template>
  <div>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <h2>Expenses for {{ currentDate }}</h2>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-data-table
            :headers="headers"
            :items="expenses"
            class="elevation-1"
            :pagination.sync="paginationTable"
            :total-items="totalExpenses"
            :loading="loadingTable"
            :rows-per-page-items="[10, 25, 50]"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.type }}</td>
            <td class="text-xs-right">{{ utils.formatAmount(props.item.amount) }} RSD</td>
            <td class="text-xs-right">
              <v-dialog max-width="500px" v-model="props.item.deleteDialogOpened">
                <v-btn slot="activator" flat icon color="blue">
                  <v-icon>delete</v-icon>
                </v-btn>
                <v-card>
                  <v-card-title class="headline">
                    Remove expense
                  </v-card-title>
                  <v-card-text>
                    Are you sure you want to remove "{{ props.item.name }}" expense?
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="green" flat @click.native="props.item.deleteDialogOpened = false">No</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="green" flat @click.native="deleteExpense(props.item)">Yes</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </td>
          </template>
          <template slot="footer">
            <td class="text-xs-right" colspan="100%">
              <div class="bold">
                Total expenses for {{ currentDate }}:
                {{ utils.formatAmount(totalExpensesAmountMonth) }} RSD
              </div>
              <div class="bold">
                Total expenses ever:
                {{ utils.formatAmount(totalExpensesAmount) }} RSD
              </div>
            </td>
          </template>
        </v-data-table>
      </v-layout>
      <v-form @submit="insertExpense">
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
                label="Name"
                v-model="form.name"
                required
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-select
                label="Select type or create new"
                combobox
                v-model="form.type"
                :items="expenseTypes"
                required
            ></v-select>
          </v-flex>
          <v-flex xs12>
            <v-text-field
                label="Expense Amount"
                type="number"
                v-model="form.amount"
                required
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-btn @click="insertExpense">insert</v-btn>
            <v-btn @click="clear">clear</v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </v-container>
  </div>
</template>

<script>
  import utils from "../../libraries/Utils";

  export default {
    name: "ExpensesWrapper",
    props: ["month", "year", "currentDate"],
    data () {
      return {
        headers: [
          { text: "Name", "value": "name", align: "left" },
          { text: "Type", "value": "type", align: "left" },
          { text: "Amount", "value": "amount", align: "right" },
          { text: "", "value": "actions" }
        ],
        expenses: [],
        customTypes: [],
        paginationTable: {},
        loadingTable: true,
        totalExpenses: 0,
        form: {
          name: "",
          type: "",
          amount: 0.00
        },
        totalExpensesAmount: 0,
        totalExpensesAmountMonth: 0
      };
    },
    mounted () {
      const self = this;

      self.updateExpensesList();
    },
    computed: {
      utils () {
        return utils;
      },
      expenseTypes () {
        const types = ["Mortgage/Rent", "Utilities", "Repairs", "Food & Clothing", "Leisure", "Tax", "Other"];

        this.customTypes.forEach(customType => {
          if (!types.includes(customType)) {
            types.push(customType);
          }
        });

        return types.sort((t1, t2) => {
          return t1.localeCompare(t2);
        });
      }
    },
    methods: {
      updateExpensesList () {
        const self = this;
        self.loadingTable = true;

        const { sortBy, descending, page, rowsPerPage } = self.paginationTable;

        self.$store.dispatch("getExpensesForMonth", {
          month: self.month,
          year: self.year,
          limit: rowsPerPage,
          offset: page - 1,
          sortBy: sortBy,
          descending: descending
        }).then(expenses => {
          self.loadingTable = false;
          self.totalExpenses = expenses.total;
          self.customTypes = expenses.customTypes;
          self.totalExpensesAmount = expenses.totalAmountUser / 100;
          self.totalExpensesAmountMonth = expenses.totalAmountUserMonth / 100;
          self.expenses = expenses.data.map(expense => {
            return {
              id: expense._id,
              name: expense.name,
              type: expense.type,
              amount: expense.amount / 100,
              deleteDialogOpened: false
            };
          });
        });
      },
      clear () {
        this.form = {
          name: "",
          type: "",
          amount: 0.00
        };
      },
      insertExpense () {
        const self = this;
        self.$store.dispatch("addExpenseForMonth", {
          month: self.month,
          year: self.year,
          name: self.form.name,
          type: self.form.type,
          amount: parseFloat(self.form.amount) * 100
        }).then(() => {
          self.clear();
          self.updateExpensesList();
        });
      },
      deleteExpense (expense) {
        const self = this;
        self.$store.dispatch("deleteExpense", {
          id: expense.id
        }).then(() => {
          expense.deleteDialogOpened = false;
          self.updateExpensesList();
        });
      }
    },
    watch: {
      month () {
        this.updateExpensesList();
      },

      paginationTable: {
        handler () {
          this.updateExpensesList();
        },
        deep: true
      }
    }
  };
</script>

<style scoped>
  .bold {
    font-weight: bold;
  }
</style>