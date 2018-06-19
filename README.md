# Privacy-vCard-Gen
Easy way to create virtual credit cards on the VISA Privacy platform
No CAPTCHA solving required

## Quick Note
- I take NO responsibility for ANYTHING that happens to your Privacy account
- Privacy allows the creation of a total of **12 cards in a 24-hour period**
- Privacy allows the creation of a total of **36 cards in a 30-day period**
### To add to your computer...
- CD to Desktop in terminal, and type `git clone https://github.com/coder486/Privacy-vCard-Gen.git`
- CD to `Privacy-vCard-Gen` in Desktop
- Type `npm install` and hit enter!


### To use the program...
- Edit `config.example.json` with your details
- Rename to `config.json`
- CD to directory in terminal
- Type `node index` in terminal OR `npm start` to generate profiles
- Bots Supported
	- Name of Bot --> name of bot in `config.json`
	- ^^ example, below are actual terms
	- Shopify Dashe --> dashe
	- Ghost SNKRS --> ghost

### Once you're done running the program...
- Check the new directory `profiles`
- All profiles should be saved with:
	- Something like a date
	- Name of `bot` in `config.json` in uppercase
- Just import the profiles file straight into the bot if it's supported!