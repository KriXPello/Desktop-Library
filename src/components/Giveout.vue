<template>
  <div class="mt-4">

    <v-btn
      text
      class="info"
      @click="overlay = true; clear()"
    >НОВАЯ ВЫДАЧА</v-btn>

    <v-overlay v-model="overlay" :dark="false">
      <template></template>
      <div class="stepper">
        <div class="close-button-row">
          <v-btn text icon @click="close()" class="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>  
        </div>

        <GiveoutBook
          v-if="step == 1"
          @books="edit_books"
          @go="go"
          :repeat="repeat"
        />

        <GiveoutReader v-if="step == 2" @reader="edit_reader" />

        <GiveoutConfirmation
          v-if="step == 3"
          :books="books"
          :reader="reader"
          @go="go"
          @close="close"
        />
      </div>
    </v-overlay>

  </div>
</template>

<script>
import GiveoutBook from '../components/GiveoutBook';
import GiveoutReader from '../components/GiveoutReader';
import GiveoutConfirmation from '../components/GiveoutConfirmation';

export default {
  name: 'Giveout',
  components: {
    GiveoutBook,
    GiveoutReader,
    GiveoutConfirmation,
  },
  data: () => {
    return {
      overlay: false,
      step: 1,
      books: [],
      reader: {},
      repeat: false,
    }
  },
  methods: {
    edit_books(books) {
      this.books = books;
    },
    edit_reader(reader) {
      this.reader = reader;
      this.step++;
    },
    go(step) {
      if (step == 1) {
        this.repeat = true;
      }
      this.step = step;
    },
    close() {
      this.$emit('done');
      this.step = 1;
      this.books = [];
      this.reader = {};
      this.repeat = false;
      this.overlay = false;
    },
    clear() {
      this.$emit('clear');
    }
  },
}
</script>

<style>
.stepper {
  width: 94vw;
  height: 90vh;
  background-color: #fff;
}
.close-button-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.close {
  position: fixed;
  z-index: 5;
}
</style>