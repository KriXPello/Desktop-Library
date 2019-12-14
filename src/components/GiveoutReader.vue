<template>
  <div class="giveout-reader">
    
    <v-card flat>
      <v-card-title class="pa-0 pl-4">
        <v-text-field
          v-model="search"
          label="Поиск(имя, номер, адрес)"
          class="improved-input"
        ></v-text-field>
        <v-spacer></v-spacer>
        <span class="headline mr-12">Выберите читателя</span>
      </v-card-title>
    </v-card>
    <div class="table-box">
      <table class="table" cellspacing="0">
        <thead align="left">
          <tr>
            <th style="width: 80px" class="pl-2">№</th>
            <th>ФИО</th>
            <th>Дата рождения</th>
            <th>Адрес</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(reader, i) in searched"
            :key="i"
            @click="apply(reader)"
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
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';

const getters = [
  'readers',
];

export default {
  name: 'GiveoutReader',
  data: () => {
    return {
      search: '',
    }
  },
  methods: {
    apply(reader) {
      this.$emit('reader', reader);
    }
  },
  computed: {
    ...mapGetters(getters),
    searched() {
      const readers = this.readers;
      const str = this.search.toLowerCase();

      return readers.filter(el => 
        el.id.toString().includes(str) ||
        el.fio.toLowerCase().includes(str) ||
        el.address.toLowerCase().includes(str)
      );
    },
  },
}
</script>

<style scoped>
.improved-input {
  max-width: 300px;
}
.giveout-reader {
  width: 100%;
  height: 100%;
}
.table-box {
  overflow: auto;
  height: calc(100% - 72px);
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
	width: 32vw;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
</style>