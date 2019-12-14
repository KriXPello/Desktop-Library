<template>
  <v-card flat>

    <v-btn
			text
      :class="selected.length == 0 ? '' : 'error'"
      :disabled="selected.length == 0"
      @click="overlay = true"
    >СПИСАТЬ</v-btn>

    <!-- Оверлей списания -->
    <v-overlay v-model="overlay" :dark="false">
			<template></template>
			<v-card width="940" height="440">
				<v-card-title>
					<v-sheet>Списание учебника</v-sheet>
					<v-spacer></v-spacer>
					<v-btn text icon @click="overlay = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
						<v-tabs
							v-model="tab"
							hide-slider
							vertical
							height="360"
						>
							<v-tabs-slider></v-tabs-slider>
							<v-navigation-drawer width="190" permanent>
								<v-list>
									<v-list-item
										v-for="(item, i) in selected"
										:key="item.number"
										@click="tab = i"
									>
										<v-tooltip bottom>
										<template v-slot:activator="{ on }">
											<span v-on="on">{{ optimize(item.name) }}</span>
										</template>
										<span>
											{{ item.name }}
										</span>
									</v-tooltip>
									</v-list-item>
								</v-list>
							</v-navigation-drawer>
							
							<v-tab-item v-for="(item, i) in selected" :key="item.number" class="ml-3">
								<v-form :ref="i">
									<v-row>
										<v-col cols="8">
											<v-text-field
												label="Название"
												:value="item.name"
												readonly
											></v-text-field>
										</v-col>
										<v-col cols="2">
											<v-text-field
												label="Класс"
												:value="item.class"
												readonly
											></v-text-field>
										</v-col>
										<v-col cols="2">
											<v-text-field
												label="Номер"
												:value="item.number"
												readonly
											></v-text-field>
										</v-col>
									</v-row>
									<v-row>
										<v-col>
											<v-textarea
												label="Автор"
												:value="item.author"
												rows="2"
												row-height="25"
												readonly
												no-resize
											></v-textarea>
										</v-col>
									</v-row>
									<v-row no-gutters>
										<v-col cols="3">
											<v-text-field
												label="Сколько списать"
												v-model="data[item.number]"
												:rules="[
													...rules,
													val => (+val || 0) <= +item.there
														|| 'Превышено кол-во учебников',
												]"
												v-mask="'###'"
												autofocus
												required
											></v-text-field>
										</v-col>
										<v-col>
											/В наличии: {{ item.there }}
											| Всего: {{ item.total }}
										</v-col>
									</v-row>
									<v-row align="center">
										<v-col class="mt-8">
											<v-btn
												text
												class="warning"
												v-if="tab > 0"
												@click="tab--"
											>
												Назад
											</v-btn>
											<v-btn
												text
												:class="'primary' + `${tab > 0 ? ' ml-3' : ''}`"
												v-if="tab+1 < selected.length"
												@click="next(i)"
											>
												Далее
											</v-btn>
											<v-btn
												text
												:class="'success' + `${tab == 0 ? '' : ' ml-3'}`"
												v-if="tab+1 == selected.length"
												@click="validate_all()"
											>
												Применить
											</v-btn>
										</v-col>
									</v-row>
								</v-form>
								
							</v-tab-item>
						</v-tabs>				


				</v-card-text>
			</v-card>
		</v-overlay>

  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { mask } from 'vue-the-mask';

const getters = [

];

const actions = [
	'process_textbook',
];

export default {
  name: 'TextBookRemove',
  directives: {
    mask,
  },
  props: [ 'selected', ],
  data: () => {
    return {
      overlay: false,
			data: {},
      tab: 0,
      rules: [
				val => !! val || 'Требуется значение'
			],
    }
  },
  methods: {
    ...mapActions(actions),
		next(num) {
			this.tab += this.validate(num) ? 1 : 0;
		},
		validate(num) {
			let result = true;

			try {
				result = this.$refs[num][0].validate();
				// eslint-disable-next-line
			} catch(err) {}
			
			if (! result) {
				this.tab = num;
				return;
			}

			return result;
		},
		validate_all() {
			const arr = [];

			for (let key in this.$refs) {
				arr[key] = this.$refs[key];
			}

			const result = arr.every( (el, i) => this.validate(i) );
			
			if (result) {
				for (let key in this.data) {
					const obj = {};
					obj.number = key;
					obj.count = this.data[key];
					obj.action = 'remove';

					this.process_textbook(obj);
				}

				this.$emit('clear');
				this.$emit('done');
				this.reset();
			}
		},
		optimize: str => str.length > 14 ? str.slice(0, 14) + '...' : str,
		reset() {
			this.data = {};
			this.$refs = {};
			this.tab = 0;
			this.overlay = false;
		},
  },
  computed: {
    ...mapGetters(getters),
	},
	watch: {
		selected(val) {
			this.tab = this.tab+1 > val.length ? val.length - 1 : this.tab;
			if (val.length == 0) {
				this.reset();
			}

			const obj = {};

			val.forEach(el => {
				if (this.data[el.number]) {
					obj[el.number] = this.data[el.number];
				}
			});

			this.data = obj;
		}
	}
}
</script>