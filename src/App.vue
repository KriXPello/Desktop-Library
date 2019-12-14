<template>
  <v-app>
    
    <Navbar />

    <v-content>
      <v-container class="container mt-3 grey lighten-4">
        <router-view></router-view>
      </v-container>
    </v-content>
    
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';
import Navbar from './components/Navbar';

const actions = [
  'set_db',
  'update_data'
];

export default {
  name: 'App',
  components: {
    Navbar,
  },
  methods: {
    ...mapActions(actions),
  },
  mounted() {
    const tables = [
      [
        'name',
        'class',
        'author',
        'number',
        'parts',
        'total',
        'there'
      ],
      [
        'name',
        'author',
        'number',
        'publisher',
        'publication_year',
        'there'
      ],
      [
        'fio',
        'birthday',
        'address',
        'registered'
      ],
      [
        'reader_id',
        'date',
        'number',
        'status'
      ]
    ];

    const request = window.indexedDB.open('libraryDataBase', 1);

    request.onerror = err => console.log('Ошибка:', err.target.error);

    request.onsuccess = event => {
      const db = event.target.result;

      this.set_db(db);
      this.update_data();
    }

    request.onupgradeneeded = event => {
      const db = event.target.result;

      if (! db.objectStoreNames.contains('textbooks')) {
        const textbooks = db.createObjectStore('textbooks', {
          keyPath: 'number',
        });

        tables[0].forEach(el => {
          textbooks.createIndex(el, el, {
            unique: el == 'number'
          });
        });
      }

      if (! db.objectStoreNames.contains('books')) {
        const books = db.createObjectStore('books', {
          keyPath: 'number',
        });

        tables[1].forEach(el => {
          books.createIndex(el, el, {
            unique: el == 'number'
          });
        });
      }

      if (! db.objectStoreNames.contains('readers')) {
        const readers = db.createObjectStore('readers', {
          keyPath: 'id',
          autoIncrement: true,
        });

        tables[2].forEach(el => {
          readers.createIndex(el, el, {
            unique: el == 'id'
          });
        });
      }

      if (! db.objectStoreNames.contains('extradition')) {
        const extradition = db.createObjectStore('extradition', {
          keyPath: 'id',
          autoIncrement: true,
        });

        tables[3].forEach(el => {
          extradition.createIndex(el, el, {
            unique: el == 'id'
          });
        });
      }

      this.set_db(db);
    }

    console.log(location.pathname);
  }
};
</script>

<style>
.container {
  height: calc(100% - 24px);
  max-width: 98% !important;
}
</style>
