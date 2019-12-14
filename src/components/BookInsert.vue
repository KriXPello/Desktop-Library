<template>
  <v-card flat>

    <v-btn
      text
      class="warning"
      @click="overlay = true; clear()"
    >ВНЕСТИ</v-btn>

    <v-overlay v-model="overlay" :dark="false">
      <template></template>
      <v-card width="800">
        <v-card-title>
          <v-sheet>Внесение книги</v-sheet>
          <v-spacer></v-spacer>
          <v-btn text icon @click="overlay = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="insert">
            <v-row>
              <v-col>
                <v-text-field
									v-model="data.number"
									:rules="[
										...rules,
										val => ! (textbooks || []).find(el => el.number == val)
											|| 'Номер уже занят (учебником)',
										val => ! (books || []).find(el => el.number == val)
											|| 'Номер уже занят (книгой)'
									]"
									label="Номер книги"
									hint="До 9 знаков"
									persistent-hint
									:counter="9"
									required
									v-mask="'#########'"
								></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="data.publication_year"
                  :rules="[
                    ...rules,
                    val => val <= new Date().getFullYear() || 'Указанная дата больше текущей',
                    val => (val || '').length == 4 || 'Неправильный год'
                  ]"
                  label="Год издания"
                  required
                  v-mask="'####'"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="data.name"
                  :rules="rules"
                  label="Название книги"
                  :counter="255"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="data.author"
                  :rules="rules"
                  label="Автор"
                  :counter="255"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="data.publisher"
                  :rules="rules"
                  label="Издательство"
                  :counter="255"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="validate()"
            class="warning"
          >ВНЕСТИ В СПИСОК</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-overlay>

  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { mask } from 'vue-the-mask';

const getters = [
  'textbooks',
  'books',
];

const actions = [
  'process_book',
];

export default {
  name: 'BookInsert',
  directives: {
    mask,
  },
  data: () => {
    return {
      overlay: false,
      data: {},
      rules: [ 
        val => !! val || 'Введите данные',
        val => (val || '').length < 256 || 'Слишком длинное значение'
      ]
    }
  },
  methods: {
    ...mapActions(actions),
    validate() {
      if ( this.$refs.insert.validate() ) {
        const obj = this.data;

        obj.there = 1;
        obj.action = 'insert';
        
        this.process_book(obj);

        this.$emit('done');
        this.data = {};
        this.overlay = false;
      }
    },
    clear() {
      this.$emit('clear');
    }
  },
  computed: {
    ...mapGetters(getters),
  },
}
</script>