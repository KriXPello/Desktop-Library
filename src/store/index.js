import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const stores = [
  'textbooks',
  'books',
  'readers',
  'extradition'
];

export default new Vuex.Store({
  state: {
    db: null,
    textbooks: [],
    books: [],
    readers: [],
    extradition: []
  },
  mutations: {
    set_db: (state, db) => state.db = db,
  },
  actions: {
    set_db: (ctx, db) => {
      ctx.commit('set_db', db);
    },
    update_data(ctx) {
      const transaction = this.state.db.transaction(stores, 'readonly');

      const textbooksStore = transaction.objectStore('textbooks');
      const booksStore = transaction.objectStore('books');
      const readersStore = transaction.objectStore('readers');
      const extraditionStore = transaction.objectStore('extradition');

      const textbooksCursor = textbooksStore.openCursor();
      const booksCursor = booksStore.openCursor();
      const readersCursor = readersStore.openCursor();
      const extraditionCursor = extraditionStore.openCursor();

      this.state.textbooks = [];
      this.state.books = [];
      this.state.readers = [];
      this.state.extradition = [];

      textbooksCursor.onsuccess = event => {
        const result = event.target.result;
        
        if (result) {
          this.state.textbooks.push(result.value);
          result.continue();
        }
      }

      booksCursor.onsuccess = event => {
        const result = event.target.result;

        if (result) {
          this.state.books.push(result.value);
          result.continue();
        }
      }

      readersCursor.onsuccess = event => {
        const result = event.target.result;

        if (result) {
          this.state.readers.push(result.value);
          result.continue();
        }
      }

      extraditionCursor.onsuccess = event => {
        const result = event.target.result;

        if (result) {
          this.state.extradition.push(result.value);
          result.continue();
        }
      }
    },
    process_book(ctx, data) {
      const transaction = this.state.db.transaction(['books', 'textbooks'], 'readwrite');

      const textbooksStore = transaction.objectStore('textbooks');
      const booksStore = transaction.objectStore('books');

      const insert = () => {
        if (! data) return;

        const request = textbooksStore.get(data.number);
        const request1 = booksStore.get(data.number);

        let exists = false;

        request.onsuccess = event => {
          if (event.target.result) {
            exists = true;
          }
        }
        request1.onsuccess = event => {
          if (event.target.result) {
            exists = true;
          }
        }

        if (! exists) {
          booksStore.add(data);
        }
      }

      const remove = () => {
        if (! data) return;

        const request = booksStore.get(data.number);

        request.onsuccess = event => {
          if (event.target.result && event.target.result.there != 0) {
            const request1 = booksStore.delete(data.number);
          }
        }
      }

      switch (data.action) {
        case 'insert':
          insert();
          break;
        case 'remove':
          remove();
          break;
      }
    },
    process_textbook(ctx, data) {
      if (! data) return;

      const transaction = this.state.db.transaction(['books', 'textbooks'], 'readwrite');

      const textbooksStore = transaction.objectStore('textbooks');
      const booksStore = transaction.objectStore('books');

      const insert = () => {
        const request = textbooksStore.get(data.number);
        const request1 = booksStore.get(data.number);

        let exists = false;

        request.onsuccess = event => {
          if (event.target.result) {
            exists = true;
          }
        }
        request1.onsuccess = event => {
          if (event.target.result) {
            exists = true;
          }
        }

        if (! exists) {
          textbooksStore.add(data);
        }
      }

      const add = () => {
        const request = textbooksStore.get(data.number);

        request.onsuccess = event => {
          const result = event.target.result;

          if (result) {
            result.total = +result.total + +data.count;
            result.there = +result.there + +data.count;

            textbooksStore.put(result);
          }
        }
      }

      const remove = () => {
        const request = textbooksStore.get(data.number);

        request.onsuccess = event => {
          const result = event.target.result;

          if (result && +result.there >= +data.count) {
            result.total = +result.total - +data.count;
            result.there = +result.there - +data.count;

            textbooksStore.put(result);
          }
        }
      }
      
      const deletetb = () => {
        const request = textbooksStore.get(data.number);

        request.onsuccess = event => {
          const result = event.target.result;

          if (result && result.there == result.total) {
            textbooksStore.delete(result.number);
          }
        }
      }

      switch (data.action) {
        case 'insert':
          insert();
          break;
        case 'add':
          add();
          break;
        case 'remove':
          remove();
          break;
        case 'delete':
          deletetb();
          break;
      }
    },
    process_reader(ctx, data) {
      if (! data) return;

      const transaction = this.state.db.transaction(['readers', 'extradition'], 'readwrite');

      const readersStore = transaction.objectStore('readers');
      const extraditionStore = transaction.objectStore('extradition');

      const add = () => {
        readersStore.add(data);
      }

      const change_address = () => {
        const request = readersStore.get(data.id);

        request.onsuccess = event => {
          const result = event.target.result;

          if (result) {
            result.address = data.address;

            readersStore.put(result);
          }
        }
      }

      const remove = () => {
        const cursor = extraditionStore.openCursor();

        let exists = false;

        cursor.onsuccess = event => {
          const result = event.target.result;

          if (result) {
            if (data.id == result.reader_id && result.status == 1) {
              exists = true;
            }
          }
        }

        if (! exists) {
          readersStore.delete(data.id);
        } else {
          return 'have';
        }
      }

      switch (data.action) {
        case 'add':
          add();
          break;
        case 'change_address':
          change_address();
          break;
        case 'remove':
          return remove();
          break;
      }
    },
    process_extradition(ctx, data) {
      if (! data) return;

      const transaction = this.state.db.transaction(stores, 'readwrite');

      const textbooksStore = transaction.objectStore('textbooks');
      const booksStore = transaction.objectStore('books');
      const readersStore = transaction.objectStore('readers');
      const extraditionStore = transaction.objectStore('extradition');

      const giveout = () => {
        const request = textbooksStore.get(data.number);
        const request1 = booksStore.get(data.number);

        request.onsuccess = event => {
          const result = event.target.result;

          if (result && result.there > 0) {
            result.there -= 1;
            textbooksStore.put(result);

            data.status = 1;
            extraditionStore.add(data);
          }
        }

        request1.onsuccess = event => {
          const result = event.target.result;

          if (result && result.there > 0) {
            result.there -= 1;
            booksStore.put(result);
            
            data.status = 1;
            extraditionStore.add(data);
          }
        }
      }

      const takeback = () => {
        const request = extraditionStore.get(data.id);

        request.onsuccess = event => {
          const result = event.target.result;

          if (result && result.status == 1) {
            const request1 = textbooksStore.get(result.number);
            const request2 = booksStore.get(result.number);

            request1.onsuccess = event => {
              const result1 = event.target.result;

              if (result1) {
                result1.there = +result1.there + 1;

                textbooksStore.put(result1);

                result.status = 0;
                extraditionStore.put(result);  
              }
            }

            request2.onsuccess = event => {
              const result2 = event.target.result;
              
              if (result2) {
                result2.there = +result2.there + 1;

                booksStore.put(result2);

                result.status = 0;
                extraditionStore.put(result);  
              }
            }
          }
        }
      }

      switch (data.action) {
        case 'giveout':
          giveout();
          break;
        case 'takeback':
          takeback();
          break;
      }
    }
  },
  getters: {
    db: state => state.db,
    textbooks: state => state.textbooks,
    books: state => state.books,
    readers: state => state.readers,
    extradition: state => state.extradition,
  }
})