<template>
  <v-card flat>

    <v-snackbar v-model="snackbar" top bottom :timeout="1500">
      У данного читателя есть выдачи!
      <v-btn
        outlined
        @click="snackbar = false"
      >ОК</v-btn>
    </v-snackbar>
    
    <v-overlay v-model="overlay" :dark="false">
      <template></template>
      <v-card width="600" height="420">
        <v-card-title>
          <span>Читатель № {{ data.id }}</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                v-model="data.fio"
                label="ФИО"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="data.birthday"
                label="Дата рождения"
                readonly
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="data.registered"
                label="Числится с"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-form ref="Address">
                <v-text-field
                  v-model="data.address"
                  label="Адрес"
                  required
                ></v-text-field> 
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            class="success ml-12"
            @click="save()"
          >Сохранить</v-btn>
          <v-spacer></v-spacer>
          <v-menu v-model="menu" left>
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on">
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-btn class="error" @click="remove()">Удалить</v-btn>
          </v-menu>
        </v-card-actions>
      </v-card>
    </v-overlay>

  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

const actions = [
  'process_reader',
];

const getters = [
  'extradition',
];

export default {
  name: 'ReaderInfo',
  props: [ 'reader', 'overlay' ],
  data: () => {
    return {
      data: {},
      menu: false,
      rules: [ val => !! val || 'Требуются данные', ],
      snackbar: false,
    }
  },
  methods: {
    ...mapActions(actions),
    save() {
      const obj = {};
      obj.id = this.data.id;
      obj.address = this.data.address;
      obj.action = 'change_address';

      this.process_reader(obj);

      this.$emit('done');
      this.close();
    },
    close() {
      this.menu = false;
      this.data = {};
      this.$emit('close');
    },
    remove() {
      if (! this.extradition.find(el =>
        el.reader_id == this.reader.id && el.status == 1)
      ) {
        const obj = {};
        obj.type = 'reader_remove';
        obj.id = this.data.id;
        obj.action = 'remove';

        const result = this.process_reader(obj);

        if (result == 'have') {
          this.snackbar = true;
          return;
        }

        this.$emit('done');
        this.close()
      } else {
        this.snackbar = true;
      }
    }
  },
  computed: {
    ...mapGetters(getters),
  },
  watch: {
    overlay(val) {
      this.data = val ? this.reader : {};
    }
  }
}
</script>