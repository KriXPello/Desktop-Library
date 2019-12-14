<template>
  <v-card flat>

    <v-btn
			text
      class="warning"
      @click="overlay = true"
    >Внести</v-btn>

    <!-- Оверлей внесения -->
    <v-overlay v-model="overlay" :dark="false">
			<template></template>
			<v-card width="800" height="420">
				<v-card-title>
					<v-sheet>Внесение учебника</v-sheet>
					<v-spacer></v-spacer>
					<v-btn text icon @click="overlay = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<v-form ref="insert">
						<v-row>
							<v-col cols="4">
								<v-select
									v-model="data.class"
									:rules="mRules"
									:items="classes"
									multiple
									label="Класс(-ы)"
									:menu-props="{maxHeight: 400}"
									required
								></v-select>
							</v-col>
							<v-col>
								<v-text-field
									v-model="data.number"
									:rules="[
										...rules,
										val => ! textbooks.find(el => el.number == val)
											|| 'Номер уже занят (учебником)',
										val => ! books.find(el => el.number == val)
											|| 'Номер уже занят (книгой)'
									]"
									label="Номер учебника"
									hint="До 9 знаков"
									persistent-hint
									:counter="9"
									required
									v-mask="'#########'"
								></v-text-field>
							</v-col>
							<v-col cols="3">
								<v-select
									v-model="data.parts"
									:rules="rules"
									:items="parts"
									label="Частей"
									required
								></v-select>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<v-text-field
									v-model="data.name"
									:rules="nRules"
									label="Название учебника"
									:counter="255"
									required
								></v-text-field>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<v-text-field
									v-model="data.author"
									:rules="nRules"
									label="Автор"
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
					>Внести в список</v-btn>
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
	'process_textbook',
];

export default {
  name: 'TextBookInsert',
  directives: {
    mask,
  },
  data: () => {
    return {
      overlay: false,
      data: {},
      rules: [ val => !! val || 'Введите данные' ],
			nRules: [
				val => !! val || 'Введите данные',
				val => (val || '').length < 256 || 'Слишком длинное значение'
			],
			mRules: [ val => val.length > 0 || 'Введите данные' ],
      classes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			parts: [1, 2, 3, 4],
    }
  },
  methods: {
		...mapActions(actions),
    validate() {
			if ( this.$refs.insert.validate() ) {
				const obj = this.data;
				obj.class = this.data.class.join(', ');
				obj.there = 0;
				obj.total = 0;
				obj.action = 'insert';
				
				this.process_textbook(obj);

				this.data = {};
				this.$emit('done');
				this.overlay = false;	
			}
		},
	},
	computed: {
		...mapGetters(getters),
	}
}
</script>