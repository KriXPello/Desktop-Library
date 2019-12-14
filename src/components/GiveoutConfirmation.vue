<template>
  <div class="giveout-confirmation">

    <div class="main-container">
      <div class="book-list">
        <v-btn
          class="mx-auto my-2"
          width="98%"
          tile
          outlined
          @click="go(1)"
        >Выбрать другие книги</v-btn>
        <div class="list">
          <div v-for="(book, i) in books" :key="i" class="list-item">
            <div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div class="c-name" v-on="on">
                    {{ `№${book.number}. ${book.name}` }}
                  </div>
                </template>
                <div>{{ `№${book.number}. ${book.name}` }}</div>
              </v-tooltip>
            </div>
            <div v-if="!! book.class">{{ book.class ? book.class + ' класс' : ''}}</div>
            <div >
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div class="c-name" v-on="on">
                    {{ book.author }}
                  </div>
                </template>
                <div>{{ book.author }}</div>
              </v-tooltip>
            </div>
          </div>
        </div>
      </div>

      <div class="reader-info">
        <v-btn
          class="mr-9 ml-2 my-2"
          tile
          outlined
          @click="go(2)"
        >Выбрать другого читателя</v-btn>
        <div>
          <div class="headline">
            Книги будут выданы читателю:
          </div>
          <div class="title mt-3">{{ reader.fio }}</div>
          <div class="subtitle-1 mt-2">{{ reader.birthday }}</div>
          <div class="title mt-12">
            С датой выдачи:
          </div>
          <div>
            <v-form ref="Confirmation">
              <v-text-field
                v-model="date"
                class="improved-input"
                v-mask="'##.##.####'"
                placeholder="ДД.ММ.ГГГГ"
                :rules="dRules"
                clearable
                required
              ></v-text-field>
            </v-form>
          </div>
        </div>
      </div>
    </div>

    <div class="button-row">
      <v-btn
        text
        class="success mr-6"
        @click="giveout()"
      >Выдать</v-btn>
    </div>

  </div>
</template>

<script>
import { mask } from 'vue-the-mask';
import { mapActions, mapGetters } from 'vuex';

const now = new Date();
const day = now.getDate().toString().length == 2 
  ? now.getDate()
  : '0' + now.getDate();
const month = (now.getMonth() + 1).toString().length == 2
  ? (now.getMonth() + 1)
  : '0' + (now.getMonth() + 1);

const date = `${day}.${month}.${now.getFullYear()}`;

const actions = [
  'process_extradition',
];

export default {
  name: 'GiveoutConfirmation',
  props: [ 'books', 'reader' ],
  directives: {
    mask,
  },
  data: () => {
    return {
      date: date,
      dRules: [
        val => (val || '').length == 10 || 'Некорректная дата',
        val => +(val || '').slice(0, 2) != 0 || 'День указывается с 01',
        val => +(val || '').slice(0, 2) <= 31 || 'В месяце до 31 дня',
        val => +(val || '').slice(3, 5) != 0 || 'Месяц указывается с 01',
        val => +(val || '').slice(3, 5) <= 12 || 'В году до 12 месяцев',
        val => {
          let result = true;
          const day = (val || '').slice(0, 2);
          const month = (val || '').slice(3, 5);
          const year = (val || '').slice(6, 10);

          const nDay = new Date().getDate();
          const nMonth = new Date().getMonth() + 1;
          const nYear = new Date().getFullYear();

          if (year > nYear)
            result = false;

          if (month > nMonth && year == nYear)
            result = false;
          
          if (day > nDay && month == nMonth && year == nYear)
            result = false;
          
          return result ? true : 'Указанная дата больше текущей';
        } 
      ],
    }
  },
  methods: {
    ...mapActions(actions),
    optimize: val => val.length > 50 ? val.slice(0, 50) + '...' : val,
    giveout() {
      if (this.$refs.Confirmation.validate()) {
        this.books.forEach(async el => {
          const obj = {};
          obj.reader_id = this.reader.id;
          obj.date = this.date;
          obj.number = el.number;
          obj.action = 'giveout';

          this.process_extradition(obj);
        });

        this.$emit('close');
      }
    },
    go(step) {
      this.$emit('go', step);
    }
  },
}
</script>

<style scoped>
.improved-input {
  width: 200px;
}
.giveout-confirmation {
  width: 100%;
  height: 100%;
  font-family: sans-serif;
}
.main-container {
  width: 100%;
  height: calc(100% - 44px);
  display: flex;
  flex-direction: row;
}
.book-list {
  width: 40%;
  height: calc(100% + 44px);
  display: flex;
  flex-direction: column;
}
.list {
  height: 100%;
  overflow: auto;
  border-right: 1px solid darkgray;
}
.list-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid gray;
}
.list-item div {
  height: 30px;
  margin: 1px;
  margin-left: 5px;
  margin-right: 5px;
}
.reader-info {
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.reader-info > * {
  margin-left: 10px;
}
.button-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  height: 44px;
}
.c-name {
  width: 32vw;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
</style>