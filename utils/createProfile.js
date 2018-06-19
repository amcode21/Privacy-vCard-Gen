let phoneFormatter = require('phone-formatter');

let status = require('./log');

module.exports = (config, card) => {
	let profile;

	switch (config.bot.toLowerCase()) {
		case 'dashe':
			profile = {
				"address": config.address1,
				"apt": config.address2,
				"cardCvv": card.cvv,
				"cardExpiry": `${card.expMonth}/${card.expYear}`,
				"cardName": `${config.firstName} ${config.lastName}`,
				"cardNumber": card.pan.match(/.{1,4}/g).join(' '),
				"city": config.city,
				"country": "United States",
				"email": config.email,
				"firstName": config.firstName,
				"lastName": config.lastName,
				"oneUseOnly": false,
				"phone": phoneFormatter.format(config.phoneNumber, '(NNN) NNN-NNNN'),
				"state": config.state,
				"zipCode": config.zipCode
			}
			break;

		case 'ghost':
			profile = {
				"ExpYear": card.expYear,
				"ExpMonth": card.expMonth,
				"CVV": card.cvv, 
				"Billing": {
					"FirstName": config.firstName,
					"LastName": config.lastName,
					"Address": config.address1,
					"Apt": config.address2,
					"State": config.state,
					"Zip": config.zipCode,
					"City": config.city
				},
				"CCNumber": card.pan.match(/.{1,4}/g).join(' '),
				"CardType": "Visa",
				"Shipping": {
					"FirstName": config.firstName,
					"LastName": config.lastName,
					"Address": config.address1,
					"Apt": config.address2,
					"State": config.state,
					"Zip": config.zipCode,
					"City": config.city
				},
				"Phone": config.phoneNumber,
				"Same": true,
				"Name": card.profileName,
				"Country": "US"
			}
			break;

		default:
			status.log('error', 'Invalid profile type');
			process.exit();
			break;
	}

	return profile;
}