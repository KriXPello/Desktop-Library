<template>
  <v-card flat>

    <v-btn
      text
      :disabled="selected.length == 0"
      :class="selected.length > 0 ? 'error' : ''"
      @click="overlay = true"
    >Удалить</v-btn>

    <v-overlay v-model="overlay" :dark="false">
      <template></template>
      <v-card>
        <v-card-title>Удаление</v-card-title>
        <v-card-text>
          <span>Вы действительно хотите удалить выбранные книги?</span>
          <v-list nav dense>
            <v-list-item
              v-for="item in selected"
              :key="item.number"
              two-line
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Номер: {{ item.number }}
                </v-list-item-subtitle>  
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            class="error"
            @click="remove()"
          >Удалить</v-btn>
          <v-btn
            text
            class="warning"
            @click="close()"
          >Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>
  
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';

const actions = [
  'process_book',
];

export default {
  name: 'BookRemove',
  props: [ 'selected', ],
  data: () => {
    return {
      overlay: false,
    }
  },
  methods: {
    ...mapActions(actions),
    remove() {
      this.selected.forEach(async el => {
        el.action = 'remove';
        this.process_book(el);
      });

      this.$emit('done');
      this.close();
    },
    close() {
      this.$emit('clear');
      this.overlay = false;
    }
  },
}
</script>