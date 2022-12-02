/* 1. Avant de commencer, il faut générer une clé API
sur l'interface de HelloAsso : Mon Compte => Integration/API 
puis générer une clé API */

/** @clientId */
/** @clientSecret  */

/*  2. Access token (valable 30 min) */
let start;
async function getTokens() {
	start = Date.now();
	const tokens = await fetch("https://api.helloasso.com/oauth2/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			client_id: `${clientId}`,
			client_secret: `${clientSecret}`,
			grant_type: "client_credentials",
		}),
	});
	return tokens.json();
}

async function refreshTokens(refreshToken) {
	const tokens = await fetch("https://api.helloasso.com/oauth2/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			client_id: `${clientId}`,
			refresh_token: refreshToken, // to change
			grant_type: "refresh_token",
		}),
	});
	return tokens.json();
}

export { start, getTokens, refreshTokens };
