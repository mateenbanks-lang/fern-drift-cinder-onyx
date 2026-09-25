import { n as createServerFn, r as TSS_SERVER_FUNCTION } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.functions-BazQzmIY.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var imageHits = [];
function limited(bucket, max, windowMs) {
	const now = Date.now();
	while (bucket.length && now - bucket[0] > windowMs) bucket.shift();
	if (bucket.length >= max) return true;
	bucket.push(now);
	return false;
}
async function generateImage(apiKey, model, prompt) {
	const res = await fetch("https://api.x.ai/v1/images/generations", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model,
			prompt,
			n: 1,
			response_format: "url"
		})
	});
	if (!res.ok) return {
		ok: false,
		status: res.status
	};
	return readImage(res);
}
async function readImage(res) {
	const first = (await res.json()).data?.[0];
	const url = first?.url ? first.url : first?.b64_json ? `data:image/png;base64,${first.b64_json}` : "";
	if (!url) return {
		ok: false,
		status: 502
	};
	return {
		ok: true,
		url
	};
}
var imagineImage_createServerFn_handler = createServerRpc({
	id: "de950e342c8eb442f49f2dd748d22b98acf97ba6f21b72ba559748b87e4dbf57",
	name: "imagineImage",
	filename: "src/lib/mash/ai.functions.ts"
}, (opts) => imagineImage.__executeServer(opts));
var imagineImage = createServerFn({ method: "POST" }).validator((input) => {
	const prompt = input && typeof input === "object" && "prompt" in input ? String(input.prompt).trim().slice(0, 1600) : "";
	if (prompt.length < 2) throw new Error("Describe the image first.");
	return { prompt };
}).handler(imagineImage_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI is not available right now."
	};
	if (limited(imageHits, 6, 6e4)) return {
		ok: false,
		error: "Short pause after heavy use."
	};
	try {
		let result = await generateImage(apiKey, "grok-imagine-image", data.prompt);
		if (!result.ok && result.status !== 401 && result.status !== 429) result = await generateImage(apiKey, "grok-imagine-image-2.0", data.prompt);
		if (!result.ok) return {
			ok: false,
			error: `Image failed (${result.status}).`
		};
		return {
			ok: true,
			url: result.url
		};
	} catch {
		return {
			ok: false,
			error: "Image failed. Try again."
		};
	}
});
var editImage_createServerFn_handler = createServerRpc({
	id: "b7429131bb7dbea3dfd244af6e5f6df136675bbe9ef2940052e81b46cedcb350",
	name: "editImage",
	filename: "src/lib/mash/ai.functions.ts"
}, (opts) => editImage.__executeServer(opts));
var editImage = createServerFn({ method: "POST" }).validator((input) => {
	const raw = input && typeof input === "object" ? input : {};
	const prompt = String(raw.prompt ?? "").trim().slice(0, 1600);
	const image = String(raw.image ?? "");
	if (prompt.length < 2) throw new Error("Say what to change.");
	if (!image.startsWith("data:image/") || image.length > 5e5) throw new Error("Attach the photo to edit.");
	return {
		prompt,
		image
	};
}).handler(editImage_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI is not available right now."
	};
	if (limited(imageHits, 6, 6e4)) return {
		ok: false,
		error: "Short pause after heavy use."
	};
	try {
		const res = await fetch("https://api.x.ai/v1/images/edits", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-imagine-image",
				prompt: data.prompt,
				image: { url: data.image },
				response_format: "url"
			})
		});
		if (!res.ok) return {
			ok: false,
			error: `Edit failed (${res.status}).`
		};
		const result = await readImage(res);
		if (!result.ok) return {
			ok: false,
			error: "Edit failed. Try again."
		};
		return {
			ok: true,
			url: result.url
		};
	} catch {
		return {
			ok: false,
			error: "Edit failed. Try again."
		};
	}
});
var speakText_createServerFn_handler = createServerRpc({
	id: "e8fdd19ee3278ee72fd45c8a5f79793899ad20afd8c6e425b91c7966fe3b56bb",
	name: "speakText",
	filename: "src/lib/mash/ai.functions.ts"
}, (opts) => speakText.__executeServer(opts));
var speakText = createServerFn({ method: "POST" }).validator((input) => {
	const text = input && typeof input === "object" && "text" in input ? String(input.text).trim().slice(0, 600) : "";
	if (!text) throw new Error("Nothing to read.");
	return { text };
}).handler(speakText_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Voice is not available right now."
	};
	try {
		for (const voiceId of ["ara", "eve"]) {
			const res = await fetch("https://api.x.ai/v1/tts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${apiKey}`
				},
				body: JSON.stringify({
					text: data.text,
					voice_id: voiceId,
					language: "en"
				})
			});
			if (!res.ok) continue;
			const mime = res.headers.get("content-type") || "audio/mpeg";
			const audio = Buffer.from(await res.arrayBuffer()).toString("base64");
			if (!audio) continue;
			return {
				ok: true,
				audio,
				mime
			};
		}
		return {
			ok: false,
			error: "Voice failed. Try again."
		};
	} catch {
		return {
			ok: false,
			error: "Voice failed. Try again."
		};
	}
});
//#endregion
export { editImage_createServerFn_handler, imagineImage_createServerFn_handler, speakText_createServerFn_handler };
