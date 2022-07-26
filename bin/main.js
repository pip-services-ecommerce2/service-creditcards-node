let CreditCardsProcess = require('../obj/src/container/CreditCardsProcess').CreditCardsProcess;

try {
    new CreditCardsProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
