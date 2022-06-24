class TransactionService {
    createTransaction = async (data) => {
        try{
            const transaction = await data.save();
            return transaction;
        } catch (err){
            console.log("Transaction Failed");
            console.log(err);
            return "Transaction Failed";
        }
    }
}

module.exports = TransactionService;