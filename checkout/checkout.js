import { start, getTokens, refreshTokens } from "./token.js";

/** @nom_asso */
let tokens = await getTokens();

const infosPanier = {
	/* (Number : montant de la transaction (en centimes) - Exemple : 10€ => 1000) */
	amount: 500,

	/* (String : Nom de l'achat) */
	itemName: "Participation mission humanitaire",
};

/* Appeler cette fonction quand le donneur clique sur Proceed to Checkout
	avec les données du panier puis rediriger dessus */
async function redirectCheckoutUrl() {
	// Pour rafraîchir le token si necessaire
	const now = Date.now();
	if (now - start > tokens.expires_in * 60) {
		tokens = await refreshTokens(tokens.refresh_token);
	}

	/* Juste pour  le test ! */
	const amount = document.getElementById("amount").value;
	if (Number.isInteger(Number(amount))) {
		infosPanier.amount = amount * 100;
	}

	fetch(
		`https://api.helloasso.com/v5/organizations/${nom_asso}/checkout-intents`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + tokens.access_token,
			},
			body: JSON.stringify({
				totalAmount: infosPanier.amount, // changer si y a des échéances futures (peu probable)
				initialAmount: infosPanier.amount,
				itemName: infosPanier.itemName,
				/* L'url de retour sur le site
            (page précédente) si l'acheteur
            souhaite modifier son panier
            avant de payer. */
				backUrl: "https://www.transaharienne.fr/back_page",

				/* L’url de retour en cas d’erreur
             technique. Https uniquement */
				errorUrl: "https://www.transaharienne.fr/error_page",

				/* L’url de retour après le paiement (“succeeded” ou “refused”) */
				returnUrl: "https://www.transaharienne.fr/return_page",
				/* Indique que l'achat consiste en une partie à un don */
				containsDonation: true,
			}),
		}
	)
		.then((data) => data.json())
		.then((res) => {
			window.open(res.redirectUrl, "_self");
		});
}

// Il procède au paiement puis revient sur returnUrl

/* Juste pour  le test ! */
const payElement = document.getElementById("pay");
payElement.addEventListener("click", redirectCheckoutUrl);
