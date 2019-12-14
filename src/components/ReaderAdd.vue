<template>
  <v-card flat>

    <v-btn
      text
      @click="overlay = true"
      class="warning"
    >Добавить</v-btn>

    <v-overlay v-model="overlay" :dark="false">
      <template></template>
      <v-card width="600">
        <v-card-title>
          <span>Добавление читателя</span>
          <v-spacer></v-spacer>
          <v-btn text icon @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="ReaderAdd">
            <v-row>
              <v-col>
                <v-text-field
                  v-model="data.fio"
                  label="ФИО"
                  :counter="255"
                  :rules="nRules"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  placeholder="ДД.ММ.ГГГГ"
                  v-model="data.birthday"
                  label="Дата рождения"
                  v-mask="'##.##.####'"
                  :rules="dRules"
                  required
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  placeholder="ДД.ММ.ГГГГ"
                  v-model="data.registered"
                  label="Числится с"
                  v-mask="'##.##.####'"
                  :rules="dRules"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="data.address"
                  label="Адрес"
                  :counter="255"
                  :rules="nRules"
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
            class="warning"
            @click="add()"
          >Добавить</v-btn>
          <v-btn
            text
            class="error"
            @click="close()"
          >Отменить</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-overlay>

  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import { mask } from 'vue-the-mask';

const actions = [
  'process_reader',
];

export default {
  name: 'ReaderAdd',
  directives: {
    mask,
  },
  data: () => {
    return {
      overlay: false,
      data: {},
      nRules: [
				val => !! val || 'Требуется значение',
				val => (val || '').length < 256 || 'Слишком длинное значение'
      ],
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
    add() {
      if (this.$refs.ReaderAdd.validate()) {
        const obj = this.data;
        obj.action = 'add';
        
        this.process_reader(obj);

        this.$emit('done');
        this.close();
      }
    },
    close() {
      this.data = {};
      this.overlay = false;
    }
  },
}
</script>