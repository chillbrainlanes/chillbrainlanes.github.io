import os
import sys

def generateHTML(code):
	output_html_file = "sets/" + code + ".html"

	with open(os.path.join("sets", code + "-files", code + "-fullname.txt"), encoding='utf-8-sig') as f:
		set_name = f.read()

	# Start creating the HTML file content
	html_content = '''<html>
<head>
  <title>''' + set_name + '''</title>
  <link rel="icon" type="image/x-icon" href="/sets/''' + code + '''-files/icon.png">
  <link rel="stylesheet" href="/resources/mana.css">
  <link rel="stylesheet" href="/resources/header.css">
</head>
<style>
	@font-face {
		font-family: Beleren;
		src: url('/resources/beleren.ttf');
	}
	body {
		font-family: 'Helvetica', 'Arial', sans-serif;
		overscroll-behavior: none;
		margin: 0px;
		background-color: #f3f3f3;
	}
	.banner {
		width: 100%;
		background-color: #bbbbbb;
	}
	.banner-container {
		width: 85%;
		max-width: 1100px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		margin: auto;
	}
	.set-banner {
		font-family: Beleren;
		display: flex;
		gap: 30px;
		align-items: center;
		justify-items: center;
		font-size: 26px;
		color: #171717;
		margin: auto;
		padding-top: 10px;
		padding-bottom: 10px;
		justify-self: left;
		width: 100%;
	}
	.set-banner img {
		width: 50px;
	}
	.set-banner a {
		font-size: 18px;
		padding-top: 6px;
		color: #1338be;
		text-decoration: none;
	}
	.set-banner a:hover {
		color: #0492c2;
	}
	.select-text {
		display: flex;
		align-items: center;
		justify-content: left;
		gap: 8px;
		font-size: 14.5px;
		justify-self: right;
		text-align: center;
	}
	select {
		background-color: #fafafa;
		border: 1px solid #656565;
		border-radius: 8px;
		box-shadow: rgba(213, 217, 217, .5) 0 2px 5px 0;
		text-align: center;
		color: #171717;
		font-size: 13px;
		height: 30px;
	}
	.grid-container {
		display: grid;
		grid-template-columns: auto;
		padding-top: 30px;
		padding-bottom: 30px;
		max-width: 1200px;
		margin: auto;
	}
	.image-grid-container {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		width: 70%;
		max-width: 1200px;
		margin: auto;
		gap: 5px;
		justify-items: center;
		padding-top: 30px;
		padding-bottom: 30px;
	}
	@media ( max-width: 750px ) {
		.image-grid-container {
			grid-template-columns: 1fr 1fr;  
		}
	}
	.image-grid {
		width: 70%;
		margin: auto;
		display: grid;
		grid-template-columns: minmax(150px, 1fr) minmax(300px, 2fr);
		gap: 50px;
		padding-bottom: 10px;
		justify-items: left;
	}
	.image-grid img {
		position: relative;
	}
	.card-image {
		float: left;
		width: 100%;
		height: auto;
		display: block;
	}
	.card-text {
		padding-top: 20px;
		padding-bottom: 20px;
		background: #fcfcfc;
		width: 100%;
		border: 1px solid #d5d9d9;
		border-top: 3px solid #171717;
		border-bottom: 3px solid #171717;
		border-radius: 6px;
		height: fit-content;
		min-height: 75%;
		margin-top: 3%;
	}
	.card-text div {
		white-space: normal;
		font-size: 15px;
		padding-bottom: 10px;
		padding-left: 12px;
		padding-right: 12px;
		line-height: 155%;
	}
	.card-text .name-cost {
		font-weight: bold;
		font-size: 20px;
		white-space: pre-wrap;
	}
	.card-text .type {
		font-size: 16px;
	}
	.card-text .pt {
		font-weight: bold;
	}
	.card-text br {
		content: "";
		display: block;
		margin-bottom: 5px;
	}
	.img-container {
		position: relative;
		width: 100%;
		align-self: center;
	}
	.img-container img {
		width: 100%;
		height: auto;
	}
	.img-container .btn {
		background: url('/img/flip.png') no-repeat;
		background-size: contain;
		background-position: center;
		width: 15%;
		height: 11%;
		cursor: pointer;
		border: none;
		position: absolute;
		top: 6.5%;
		left: 8.5%;
		transform: translate(-50%, -85%);
	}
	.img-container .btn:hover {
		background: url('/img/flip-hover.png') no-repeat;
		background-size: contain;
		background-position: center;
		width: 15%;
		height: 11%;
		cursor: pointer;
		border: none;
		position: absolute;
		top: 6.5%;
		left: 8.5%;
		transform: translate(-50%, -85%);
	}
	.img-container .hidden-text {
		position: absolute;
		font-family: Beleren;
		top: 5%;
		left: 9%;
		font-size: .97vw;
		color: rgba(0, 0, 0, 0);
	}
</style>
<body>
	'''

	with open(os.path.join('resources', 'snippets', 'header.txt'), encoding='utf-8-sig') as f:
		snippet = f.read()
		html_content += snippet

	html_content += '''
	<div class="banner">
		<div class="banner-container">
			<div class="set-banner" id="set-banner">
				<img class="set-logo" src="/sets/''' + code + '''-files/icon.png">
				<div class="set-title">''' + set_name + '''</div>'''

	if os.path.exists(os.path.join('sets', code + '-files', code + '-draft.txt')):
		html_content += '''<a href="/sets/''' + code + '''-files/''' + code + '''-draft.txt" download>Draft me!</a>
		'''

	html_content += '''
			</div>
			<div class="select-text">Cards displayed as<select name="display" id="display"><option value="cards-only">Cards Only</option><option value="cards-text">Cards + Text</option></select>sorted by<select name="sort-by" id="sort-by"><option value="set-num">Set Number</option><option value="name">Name</option><option value="mv">Mana Value</option><option value="color">Color</option><option value="rarity">Rarity</option></select> : <select name="sort-order" id="sort-order"><option value="ascending">Asc</option><option value="descending">Desc</option></select></div>
		</div>
	</div>

	<div class="grid-container" id="grid">
	</div>

	<div class="image-grid-container" id="imagesOnlyGrid">
	</div>

	<script>
		let card_list_arrayified = [];
		let set_list_arrayified = [];
		let specialchars = "";
		let displayStyle = "";

		document.addEventListener("DOMContentLoaded", async function () {
			'''

	with open(os.path.join('resources', 'snippets', 'load-files.txt'), encoding='utf-8-sig') as f:
		snippet = f.read()
		html_content += snippet

	html_content += '''

			for (let i = 0; i < card_list_arrayified.length; i++)
			{
				if (card_list_arrayified[i][11] == "''' + code + '''")
				{
					set_list_arrayified.push(card_list_arrayified[i]);
				}
			}

			setCardView();
		});

		document.getElementById("sort-by").onchange = displayChangeListener;
		document.getElementById("display").onchange = displayChangeListener;
		document.getElementById("sort-order").onchange = displayChangeListener;
  
		function displayChangeListener() {
			setCardView();
		}

		function setCardView() {
			displayStyle = document.getElementById("display").value;

			imagesOnlyGrid.style.display = displayStyle == "cards-only" ? '' : 'none';
			grid.style.display = displayStyle == "cards-only" ? 'none' : '';

			updatePageContents();
		}

		function updatePageContents() {
			if (displayStyle == "cards-only")
			{
				cardGrid = document.getElementById("imagesOnlyGrid");
			}
			else
			{
				cardGrid = document.getElementById("grid");
			}

			let set_cards = [];
			let set_tokens_basics = [];

			for (const card of set_list_arrayified)
			{
				if (card[10].includes("token") || card[3].includes("Basic"))
				{
					set_tokens_basics.push(card);
				}
				else
				{
					set_cards.push(card);
				}
			}

			set_cards.sort(compareFunction);
			set_tokens_basics.sort(compareFunction);
			if (document.getElementById("sort-order").value == "descending")
			{
				set_cards.reverse();
				set_tokens_basics.reverse();
			}
			set_list_sorted = set_cards.concat(set_tokens_basics);
			cardGrid.innerHTML = "";

			for (const card of set_list_sorted)
			{
				cardGrid.append(gridifyCard(card));
			}
		}

		'''

	with open(os.path.join('resources', 'snippets', 'compare-function.txt'), encoding='utf-8-sig') as f:
		snippet = f.read()
		html_content += snippet

	html_content += '''

		'''

	with open(os.path.join('resources', 'snippets', 'tokenize-symbolize.txt'), encoding='utf-8-sig') as f:
		snippet = f.read()
		html_content += snippet

	html_content += '''

		function gridifyCard(card_stats) {
			const card_name = card_stats[0];

			if (displayStyle == "cards-only")
			{
				return buildImgContainer(card_stats, true);
			}

		'''

	with open(os.path.join('resources', 'snippets', 'img-container-defs.txt'), encoding='utf-8-sig') as f:
		snippet = f.read()
		html_content += snippet

	html_content += '''

		document.getElementById("search").addEventListener("keypress", function(event) {
		  if (event.key === "Enter") {
				event.preventDefault();
				search();
		  }
		});

		function search() {
			window.location = ("/search?search=" + document.getElementById("search").value);
		}

		'''

	with open(os.path.join('resources', 'snippets', 'random-card.txt'), encoding='utf-8-sig') as f:
		snippet = f.read()
		html_content += snippet

	html_content += '''
	</script>
</body>
</html>'''

	# Write the HTML content to the output HTML file
	with open(output_html_file, 'w', encoding='utf-8-sig') as file:
		file.write(html_content)

	print(f"HTML file saved as {output_html_file}")