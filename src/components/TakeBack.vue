<template>
  <v-card height="30" class="mt-4 ml-2" flat>

    <v-btn
      :class="selected.length == 0 ? '' : 'warning'"
      text
      :disabled="selected.length == 0"
      @click="overlay = true"
    >Вернуть</v-btn>

    <v-overlay v-model="overlay" :dark="false">
      <template></template>
      <v-card>
        <v-card-title>
          <span>Подтверждение</span>
          <v-spacer></v-spacer>
          <v-btn icon text @click="overlay = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <span>
            Вы действительно хотите вернуть выбранные книги?
            ({{ selected.length }} шт.)
          </span>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            class="success"
            @click="takeback()"
          >Да</v-btn>
          <v-btn
            text
            class="error"
            @click="close()"
          >Нет</v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>

  </v-card>
</template>

<script>
import { mapActions } from 'vuex';

const actions = [
  'process_extradition',
];

export default {
  name: 'TakeBack',
  props: [ 'selected', ],
  data: () => {
    return {
      overlay: false,
    }
  },
  methods: {
    ...mapActions(actions),
    close() {
      this.$emit('clear');
      this.overlay = false;
    },
    takeback() {
      this.selected.forEach(el => {
        const obj = {};
        obj.id = el.id;
        obj.action = 'takeback';

        this.process_extradition(obj);
      });

      this.$emit('done');
      this.close();
    }
  },
}
</script>