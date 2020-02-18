<template>
	<div class="component">

		<v-snackbar bottom top :timeout="1500" v-model="snackbar">
			<span>Не удалось удалить книгу № {{ error }}</span>
		</v-snackbar>

		<v-tabs v-model="tab" grow>
			<v-tab>Учебники</v-tab>
			<v-tab>Художественная литература</v-tab>
		</v-tabs>
		
		<v-tabs-items v-model="tab" class="tab-items">
			<!-- FIXME: Учебники -->
			<v-tab-item class="tab-item">
				<v-card flat>
					<v-card-title>
						<v-text-field
							v-model="search"
							label="Поиск (название, класс, автор, номер)"
							class="improved-input"
						></v-text-field>
						<v-spacer></v-spacer>
						<div class="mr-3">
							<v-menu v-model="menu" left>
								<template v-slot:activator="{ on }">
									<v-btn text v-on="on" :disabled="selected.length == 0">
										<v-icon>mdi-chevron-down</v-icon>
									</v-btn>
								</template>
								<v-btn
									class="error"
									@click="delete_textbooks()"
								>Удалить</v-btn>
							</v-menu>	
						</div>
						<TextBookInsert @done="update_data()" />
						<TextBookAdd 
							class="mx-3"
							:selected="selected"
							@clear="clear"
							@done="update_data()"
						/>
						<TextBookRemove
							:selected="selected"
							@clear="clear"
							@done="update_data()"
						/>
					</v-card-title>
				</v-card>
				<div class="table-box">
					<table class="table" cellspacing="0">
						<thead align="left">
							<tr>
								<th class="improved-th"></th>
								<th class="t-name">Название учебника</th>
								<th style="width: 70px">Класс</th>
								<th class="t-name">Автор</th>
								<th style="width: 105px">№ учебника</th>
								<th style="width: 75px">Частей</th>
								<th style="width: 60px">Всего</th>
								<th style="width: 90px">В наличии</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(textbook, i) in searched_textbooks" :key="i">
								<td class="improved-td">
									<v-checkbox
										v-model="selected"
										:value="textbook"
										height="0"
										:key="textbook.number"
									></v-checkbox>
								</td>
								<td>
									<v-tooltip bottom>
										<template v-slot:activator="{ on }">
											<div class="t-name" v-on="on">{{ textbook.name }}</div>
										</template>
										<div>{{ textbook.name }}</div>
									</v-tooltip>
								</td>
								<td style="width: 70px">{{ textbook.class }}</td>
								<td>
									<v-tooltip bottom>
										<template v-slot:activator="{ on }">
											<div class="t-name" v-on="on">{{ textbook.author }}</div>
										</template>
										<div>{{ textbook.author }}</div>
									</v-tooltip>
								</td>
								<td style="width: 105px">{{ textbook.number }}</td>
								<td style="width: 75px">{{ textbook.parts }}</td>
								<td style="width: 60px">{{ textbook.total }}</td>
								<td style="width: 90px">{{ textbook.there }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</v-tab-item>
			
			<!-- FIXME: Художественная литература -->
			<v-tab-item class="tab-item">
				<v-card flat>
					<v-card-title>
						<v-text-field
							v-model="search"
							label="Поиск"
							class="improved-input"
						></v-text-field>
						<v-spacer></v-spacer>
						<BookInsert @done="update_data()" @clear="clear()" />
						<BookRemove
							class="mx-3"
							:selected="selected_books"
							@clear="clear()"
							@done="update_data()"
						/>
					</v-card-title>
				</v-card>
					<div class="table-box">
						<table class="table" cellspacing="0">
							<thead align="left">
								<tr>
									<th class="improved-th"></th>
									<th class="t2-name">Название книги</th>
									<th class="t2-name">Автор</th>
									<th style="width: 105px">№ книги</th>
									<th class="t2-name">Издательство</th>
									<th style="width: 105px;">Год издания</th>
									<th style="width: 105px;">Статус</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(book, i) in searched_books" :key="i">
									<td class="improved-td">
										<v-checkbox
											v-model="selected_books"
											:value="book"
											:disabled="! +book.there"
											height="0"
											:key="book.number"
										></v-checkbox>
									</td>
									<td>
										<v-tooltip bottom>
											<template v-slot:activator="{ on }">
												<div class="t2-name" v-on="on">{{ book.name }}</div>
											</template>
											<div>{{ book.name }}</div>
										</v-tooltip>
									</td>
									<td>
										<v-tooltip bottom>
											<template v-slot:activator="{ on }">
												<div class="t2-name" v-on="on">{{ book.author }}</div>
											</template>
											<div>{{ book.author }}</div>
										</v-tooltip>
									</td>
									<td style="width: 105px">{{ book.number }}</td>
									<td>
										<v-tooltip bottom>
											<template v-slot:activator="{ on }">
												<div class="t2-name" v-on="on">{{ book.publisher }}</div>
											</template>
											<div>{{ book.publisher }}</div>
										</v-tooltip>
									</td>
									<td style="width: 105px;">{{ book.publication_year }}</td>
									<td style="width: 105px;">
										<u v-if="book.there == 0">Выдана</u>
										<span v-else>В наличии</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
			</v-tab-item>
		</v-tabs-items>

	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { mask } from 'vue-the-mask';

import TextBookInsert from '../components/TextBookInsert';
import TextBookAdd from '../components/TextBookAdd';
import TextBookRemove from '../components/TextBookRemove';
import BookInsert from '../components/BookInsert';
import BookRemove from '../components/BookRemove';

const getters = [
	'textbooks',
	'books',
];

const actions = [
	'process_textbook',
	'update_data',
];

export default {
	name: 'Books',
	directives: {
		mask,
	},
	components: {
		TextBookInsert,
		TextBookAdd,
		TextBookRemove,
		BookInsert,
		BookRemove,
	},
	data: () => {
		return {
			tab: 0,
			selected: [],
			selected_books: [],
			rules: [ val => !! val || 'Введите данные' ],
			mRules: [ val => val.length > 0 || 'Введите данные' ],
			search: '',
			menu: false,
			snackbar: false,
			error: '',
		}
	},
	methods: {
		...mapActions(actions),
		delete_textbooks() {
			this.selected.forEach(el => {
				el.action = 'delete';
				const result = this.process_textbook(el);
				
				if (result == 'error') {
					this.snackbar = true;
					this.error = el.number;
				}
			});

			this.update_data();
			this.clear();
		},
		clear() {
			this.selected = [];
			this.selected_books = [];
		},
	},
	computed: {
		...mapGetters(getters),
		searched_textbooks() { // Отфильтрованные учебники
			const str = this.search.toLowerCase();
			return this.$store.getters.textbooks.filter(el => 
				el.name.toLowerCase().includes(str) ||
				el.class.toString().toLowerCase().includes(str) ||
				el.author.toLowerCase().includes(str) ||
				el.number.toString().toLowerCase().includes(str)
			);
		},
		searched_books() { // Отфильтрованные книги
			const str = this.search.toLowerCase();
			
			return this.$store.getters.books.filter(el => 
				el.name.toLowerCase().includes(str) ||
				el.author.toLowerCase().includes(str) ||
				el.number.toString().toLowerCase().includes(str) ||
				el.publisher.toLowerCase().includes(str) ||
				el.publication_year.toString().toLowerCase().includes(str)
			);
		}
	},
	watch: {
		tab(val) {
			localStorage.tab = +val;
			this.search = '';
			this.selected = [];
		},
	},
	mounted() {
		if (localStorage.tab) {
			this.tab = +localStorage.tab;
		}
	}
}
</script>

<style scoped>
.improved-input {
  max-width: 300px;
}
.component {
	height: calc(100vh - 102px);
}
.tab-items {
	height: calc(100% - 48px);
}
.tab-item {
	height: 100%;
}
.card-text {
	padding: 0;
}
.table-box {
	height: calc(100% - 56px);
	overflow: auto;
}
.table {
	max-height: 100%;
	width: 100%;
}
thead th {
	position: sticky;
	top: 0;
	background-color: #FFF;
	border-bottom: 1px solid lightgray;
}
thead th:first-child {
  left: 0;
  z-index: 1;
}
tbody tr:hover {
	transition: 500ms;
	background-color: rgb(221, 219, 219);
}
.t-name {
	width: 25vw;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
.t2-name {
	width: 20vw;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}
</style>