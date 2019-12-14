<template>
  <div class="component">

    <ReaderInfo
      :reader="reader"
      :overlay="overlay"
      @close="close()"
      @done="update_data()"
    />
    <v-card flat>
      <v-card-title>
        <v-text-field
          v-model="search"
          label="Поиск (номер, ФИО, адрес)"
          class="improved-input"
        ></v-text-field>
        <v-spacer></v-spacer>
        <ReaderAdd @done="update_data()" />
      </v-card-title>
    </v-card>
    <div class="table-box">
      <table class="table" cellspacing="0">
        <thead align="left">
          <tr>
            <th style="width: 80px" class="pl-2">№</th>
            <th class="t-name">ФИО</th>
            <th style="width: 135px">Дата рождения</th>
            <th class="t-name">Адрес</th>
            <th style="width: 135px">Зарегистрирован</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(reader, i) in searched"
            :key="i"
            @click="open(reader)"
          >
            <td style="width: 80px" class="pl-2">{{ reader.id }}</td>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div class="t-name" v-on="on">{{ reader.fio }}</div>
                </template>
                <div>{{ reader.fio }}</div>
              </v-tooltip>
            </td>
            <td style="width: 135px">{{ reader.birthday }}</td>
            <td>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div class="t-name" v-on="on">{{ reader.address }}</div>
                </template>
                <div>{{ reader.address }}</div>
              </v-tooltip>
            </td>
            <td style="width: 135px">{{ reader.registered }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import ReaderAdd from '../components/ReaderAdd';
import ReaderInfo from '../components/ReaderInfo';

const getters = [
  'readers',
];

const actions = [
  'update_data',
];

export default {
  name: 'Readers',
  components: {
    ReaderAdd,
    ReaderInfo,
  },
  data: () => {
    return {
      overlay: false,
      reader: {},
      search: '',
    }
  },
  methods: {
    ...mapActions(actions),
    close() {
      this.overlay = false;
      this.reader = {};
    },
    open(reader) {
      this.overlay = true;
      this.reader = reader;
    },
  },
  computed: {
    ...mapGetters(getters),
    searched() {
      const str = this.search.toLowerCase();

      return this.readers.filter(el => 
        el.id.toString().toLowerCase().includes(str) ||
        el.fio.toLowerCase().includes(str) ||
        el.address.toLowerCase().includes(str)
      );
    }
  },
}
</script>

<style scoped>
.improved-input {
  max-width: 300px;
}
.component {
	height: calc(100vh - 102px);
  background-color: #FFF;
}
.table-box {
	height: calc(100% - 106px);
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
.t-name {
	width: 25vw;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
tr {
  background-color: #FFF;
  height: 40px;
}
tbody tr:hover {
	transition: 500ms;
	background-color: rgb(221, 219, 219);
}
</style>