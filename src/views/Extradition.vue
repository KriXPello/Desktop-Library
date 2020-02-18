<template>
  <div class="component">

    <v-card flat>
      <v-card-title>
        <v-layout row class="mx-0">
          <v-text-field
            v-model="search"
            label="Поиск"
            class="improved-input"
          ></v-text-field>
          <v-btn @click="update_data()" text class="ml-2 mt-3">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <Giveout @clear="clear" @done="update_data()" />
          <TakeBack :selected="selected" @clear="clear" @done="update_data()" />
        </v-layout>
      </v-card-title>  
    </v-card>
    <div class="table-box">
      <table class="table" cellspacing="0">
        <thead align="left">
          <tr>
            <th class="improved-th"></th>
            <th class="t-name">ФИО</th>
            <th style="width: 110px;">Дата выдачи</th>
            <th class="t-name">Название книги</th>
            <th style="width: 105px;">№ Книги</th>
            <th style="width: 120px;">Статус книги</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in searched" :key="i">
            <td class="improved-td">
              <v-checkbox
                v-model="selected"
                :value="item"
                height="0"
                :key="item.number"
                :disabled="disabled(item.reader_id) || item.status == '0'"
              ></v-checkbox>
            </td>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div class="t-name" v-on="on">
                    {{ find_name_by_id(item.reader_id).fio + ` (${item.reader_id})` }}
                  </div>
                </template>
                <div>
                  {{ find_name_by_id(item.reader_id).fio + ` (${item.reader_id})` }}
                </div>
              </v-tooltip>
            </td>
            <td style="width: 110px;">{{ item.date }}</td>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div class="t-name" v-on="on">
                    {{ find_book_by_number(item.number).name }}
                  </div>
                </template>
                <div>{{ find_book_by_number(item.number).name }}</div>
                <div>{{ find_book_by_number(item.number).author }}</div>
              </v-tooltip>
            </td>
            <td style="width: 105px;">{{ item.number }}</td>
            <td style="width: 120px;">
              <v-chip v-if="+item.status" class="error">Выдана</v-chip>
              <v-chip v-else class="success">Возвращена</v-chip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import Giveout from '../components/Giveout';
import TakeBack from '../components/TakeBack';

const getters = [
  'extradition',
  'readers',
  'textbooks',
  'books',
];

const actions = [
  'update_data',
];

export default {
  name: 'Extradition',
  components: {
    Giveout,
    TakeBack,
  },
  data: () => {
    return {
      search: '',
      selected: [],
      cur_user: -1,
    }
  },
  methods: {
    ...mapActions(actions),
    find_name_by_id(id) {
      const reader = this.readers.find(el => el.id == id) 
        || { fio: '*Неизвестный пользователь*' };
      
      return reader;
    },
    find_book_by_number(num) {
      const book = this.textbooks.find(el => el.number == num)
        || this.books.find(el => el.number == num)
        || { name: '*Неизвестная книга*', author: '*Неизвестный автор*', class: ''};

      return book;
    },
    disabled(cur_id) {
      return (this.cur_user != -1 && this.cur_user != cur_id);
    },
    clear() {
      this.selected = [];
    },
  },
  computed: {
    ...mapGetters(getters),

    searched() { // Отфильтрованные данные
      const str = this.search.toLowerCase();

      return this.extradition.filter(el => {
        const reader = this.find_name_by_id(el.reader_id);
        const book = this.find_book_by_number(el.number);
        
        return (
          reader.fio.toLowerCase().includes(str) ||
          book.name.toLowerCase().includes(str) ||
          book.author.toLowerCase().includes(str) ||
          el.date.toLowerCase().includes(str) ||
          el.number.toString().toLowerCase().includes(str)
        );
      });
    },
  },
  watch: {
    selected(selected) {
      this.cur_user = selected.length == 0
        ? -1
        : selected[0].reader_id;
    },
  },
}
</script>

<style scoped>
.improved-input {
  max-width: 300px;
}
.v-chip {
  position: initial;
}
.component {
	height: calc(100vh - 104px);
  background-color: #fff;
}
.table-box {
	height: calc(100% - 104px);
	overflow: auto;
}
.table {
	max-height: 100%;
	width: 100%;
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
	width: 22vw;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
</style>