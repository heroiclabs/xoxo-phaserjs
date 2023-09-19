<script>
	import MainMenu from "./scenes/MainMenu";
	import Matchmaking from "./scenes/Matchmaking";
	import InGame from "./scenes/InGame";

	import CONFIG from "./config";

	const config = {
		type: Phaser.AUTO,
		width: CONFIG.WIDTH,
		height: CONFIG.HEIGHT,
		backgroundColor: "#FF4C4C",
 		autoCenter: true,
		scene: [MainMenu, Matchmaking, InGame],
	};

	new Phaser.Game(config);
</script>
