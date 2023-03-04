const prompt = require('prompt-sync')();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
	A: 2,
	B: 4,
	C: 6,
	D: 8,
};

const SYMBOLS_VALUE = {
	A: 5,
	B: 4,
	C: 3,
	D: 2,
};

// Deposit money to play with
const deposit = () => {
	while (true) {
		const depositAmount = prompt('Enter a deposit amount: ');
		const numberDepositAmount = parseFloat(depositAmount);

		if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
			console.log('Invalid deposit amount, try again!');
		} else {
			return numberDepositAmount;
		}
	}
};

// Getting number of lines to bet on
const getNumOfLines = () => {
	while (true) {
		const lines = prompt(
			'Enter the number of lines you want to bet on (1-3): '
		);
		const numOfLines = parseFloat(lines);

		if (isNaN(numOfLines) || numOfLines <= 0 || numOfLines > 3) {
			console.log('Invalid number of lines, try again!');
		} else {
			return numOfLines;
		}
	}
};

// Get bet amount for lines
const getBet = (balance, lines) => {
	while (true) {
		const bet = prompt('Enter your bet per line: ');
		const numBet = parseFloat(bet);

		if (isNaN(numBet) || numBet <= 0 || numBet > balance / lines) {
			console.log('Invalid bet, try again!');
		} else {
			return numBet;
		}
	}
};

// Spin the slot machine
const spin = () => {
	const symbols = [];
	for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
		for (let i = 0; i < count; i++) {
			symbols.push(symbol);
		}
	}

	const reels = [];
	for (let i = 0; i < COLS; i++) {
		reels.push([]);
		const reelSymbols = [...symbols];
		for (let j = 0; j < ROWS; j++) {
			const randomIndex = Math.floor(Math.random() * reelSymbols.length);
			const selectedSymbol = reelSymbols[randomIndex];
			reels[i].push(selectedSymbol);
			reelSymbols.splice(randomIndex, 1);
		}
	}

	return reels;
};

// Transpose cols into rows
const transpose = (reels) => {
	const rows = [];

	for (let i = 0; i < ROWS; i++) {
		rows.push([]);
		for (let j = 0; j < COLS; j++) {
			rows[i].push(reels[j][i]);
		}
	}

	return rows;
};

// Printing rows into a format in term
const printRows = (rows) => {
	for (const row of rows) {
		let rowString = '';
		for (const [i, symbol] of row.entries()) {
			rowString += symbol;
			if (i != row.length - 1) {
				rowString += ' | ';
			}
		}
		console.log(rowString);
	}
};

// Give the player their winnings
const getWinnings = (rows, bet, lines) => {
	let winnings = 0;
	for (let row = 0; row < lines; row++) {
		const symbols = rows[row];
		let allSame = true;

		for (const symbol of symbols) {
			if (symbol != symbols[0]) {
				allSame = false;
				break;
			}
		}

		if (allSame) {
			winnings += bet * SYMBOLS_VALUE[symbols[0]];
		}
	}

	return winnings;
};

// Play game until done
const game = () => {
	let balance = deposit();

	while (true) {
		console.log(`You have a balance of: $${balance}`);
		const numOfLines = getNumOfLines();
		const bet = getBet(balance, numOfLines);
		balance -= bet * numOfLines;
		const reels = spin();
		const rows = transpose(reels);
		printRows(rows);
		const winnings = getWinnings(rows, bet, numOfLines);
		balance += winnings;
		console.log(`You won, $${winnings}!`);

		if (balance <= 0) {
			console.log('You ran out of money!');
			break;
		}

		const playAgain = prompt('Do you want to play again (y/n)? ');

		if (playAgain != 'y') break;
	}
};

game();
