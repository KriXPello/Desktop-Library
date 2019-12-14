<template>
  <div class="giveout-book">

    <v-snackbar v-model="snackbar" :timeout="1000" absolute>
      Вы не выбрали книги!
      <v-btn
        outlined
        @click="timeout = false"
      >ОК</v-btn>
    </v-snackbar>

    <v-card flat>
      <v-card-title class="pa-0 pl-4">
        <v-text-field
          v-model="search"
          label="Поиск"
          class="improved-input"
        ></v-text-field>
        <v-spacer></v-spacer>
        <span class="headline mr-12">Выберите книги</span>
      </v-card-title>
    </v-card>
    <div class="table-box">
      <table class="table" cellspacing="0">
        <thead align="left">
          <tr>
            <th style="width: 50px;"></th>
            <th class="t-name">Название книги/учебника</th>
            <th style="width: 70px;">Класс</th>
            <th class="t-name">Автор</th>
            <th style="width: 105px;">№ книги</th>
            <th style="width: 90px;">В наличии</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, i) in searched" :key="i">
            <td style="width: 50px;">
              <v-checkbox
                class="ml-2"
                v-model="selected"
                multiple
                :value="book"
                height="5"
                :key="book.number"
                :disabled="book.there == 0"
              ></v-checkbox>
            </td>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div class="t-name" v-on="on">{{ book.name }}</div>
                </template>
                <div>{{ book.name }}</div>
              </v-tooltip>
            </td>
            <td style="width: 70px;">{{ book.class }}</td>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div class="t-name" v-on="on">{{ book.author }}</div>
                </template>
                <div>{{ book.author }}</div>
              </v-tooltip>
            </td>
            <td style="width: 105px;">{{ book.number }}</td>
            <td style="width: 90px;">{{ book.there }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="button-block">
      <v-btn
        v-if="repeat"
        text
        width="150"
        class="info mr-2"
        @click="apply(3)"
      >Применить</v-btn>
      <v-btn
        v-else
        text
        width="150"
        class="info mr-2"
        @click="apply(2)"
      >Далее</v-btn>  
    </div>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

const getters = [
  'textbooks',
  'books',
];

export default {
  name: 'GiveoutBook',
  props: ['repeat'],
  data: () => {
    return {
      selected: [],
      search: '',
      snackbar: false,
    }
  },
  methods: {
    apply(step) {
      if (this.selected.length > 0) {
        this.$emit('books', this.selected);
        this.$emit('go', step);
      } else {
        this.snackbar = true;
      }
    },
  },
  computed: {
    ...mapGetters(getters),
    searched() {
      const all = this.textbooks.concat(this.books);
      const str = this.search.toLowerCase();

      return all.filter(el =>
        el.name.toLowerCase().includes(str) ||
        (el.class || '').toString().includes(str) ||
        el.author.toLowerCase().includes(str) ||
        el.number.toString().includes(str)
      );
    }
  },
}
</script>

<style scoped>
.improved-input {
  max-width: 300px;
}
.giveout-book {
  width: 100%;
  height: 100%;
}
.table-box {
  overflow: auto;
  height: calc(100% - 112px);
  font-family: sans-serif;
  font-size: 16px;
}
.table {
  width: 100%;
  max-height: 100%;
}
thead th {
	position: sticky;
	top: 0;
	background-color: #FFF;
	border-bottom: 1px solid lightgray;
}
thead th:first-child {
  left: 0;
  z-index: 1;
}
tbody tr:hover {
	transition: 500ms;
	background-color: rgb(221, 219, 219);
}
.t-name {
	width: 25vw;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
.button-block {
  width: 100%;
  height: 42px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
</style>