<script lang="ts">
	import Router from "svelte-spa-router";
	import routes from "./routes";
	import { onMount } from "svelte";
	import auth from "./auth-service";
	import { canWrite, isAuthenticated, user} from "./store";

	let auth0Client;

	onMount(async () => {
		auth0Client = await auth.createClient();
		await auth.init(auth0Client);
	});

	function login() {
		auth.loginWithPopup(auth0Client);
	}

	function logout() {
		auth.logout(auth0Client);
	}

</script>

<div class="nav">
	<nav
		class="navbar container is-widescreen"
		role="navigation"
		aria-label="main navigation"
	>
		<div class="navbar-brand">
			<a class="navbar-item" href="#/"> BRules </a>
			<a
				role="button"
				class="navbar-burger"
				aria-label="menu"
				aria-expanded="false"
				data-target="navbarBasicExample"
			>
				<span aria-hidden="true" />
				<span aria-hidden="true" />
				<span aria-hidden="true" />
			</a>
		</div>

		<div id="navbarBasicExample" class="navbar-menu">
			<div class="navbar-start">
				<a class="navbar-item" href="#/rules"> Regras de Negócio </a>
				<a class="navbar-item"> Sobre </a>
			</div>
			
			
			<div class="navbar-end">
				<div class="navbar-item">
					<div class="buttons">
						{#if !$isAuthenticated}
						<a class="button is-light" on:click={login}>
							Log in
						</a>
						{:else}
						<a class="button is-light" on:click={logout}>
							Log out
						</a>
						{/if}
					</div>
				</div>
			</div>
		</div>

	</nav>
</div>

<main class="main container is-widescreen">
	<Router {routes} />
</main>

<style lang="scss">
</style>
