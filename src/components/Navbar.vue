<template>
	<div>

		<v-app-bar app short>

			<v-app-bar-nav-icon @click="navigation = !navigation"></v-app-bar-nav-icon>
			<v-sheet class="text-uppercase font-weight-medium title ml-6">
				<v-icon>{{ $route.name }}</v-icon>
			</v-sheet>
		</v-app-bar>

		<v-navigation-drawer v-model="navigation" app temporary>
			<v-list>
					<v-subheader class="subtitle-1">РАЗДЕЛЫ</v-subheader>
				<v-list-item v-for="(page, i) in pages" :key="i" route :to="page.route">
					<v-list-item-title class="text-uppercase font-weight-medium">{{ page.name }}</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

	</div>
</template>

<script>
export default {
	name: 'Navbar',
	data: () => {
		return {
			navigation: false,
			pages: [
				{ name: 'Книги', route: '/index.html' },
				{ name: 'Читатели', route: '/readers' },
				{ name: 'Выдача', route: '/extradition' },
			]
		}
	},
}
</script>